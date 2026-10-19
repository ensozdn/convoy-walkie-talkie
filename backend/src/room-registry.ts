export interface Coordinates {
  latitude: number;
  longitude: number;
  latitudeDelta?: number;
  longitudeDelta?: number;
  speedKmh?: number;
}

export interface RoomWaypoint {
  latitude: number;
  longitude: number;
  setBy: string;
  timestamp: number;
}

export interface RoomParticipant {
  socketId: string;
  name: string;
  roomName: string;
  lastSeen: number;
  isSpeaking: boolean;
  coords: Coordinates | null;
  avatarColor?: string | null;
  vehicleType?: string | null;
}

export interface AudioClip {
  id: number;
  sender: string;
  audioBase64: string;
  timestamp: number;
}

export type QuickPingType = 'break' | 'slow' | 'hazard' | 'ok';

export interface QuickPingPayload {
  id: number;
  sender: string;
  pingType: QuickPingType;
  timestamp: number;
}

const PARTICIPANT_TTL_MS = 45000;
const MAX_STORED_CLIPS = 5;

export class RoomRegistry {
  private readonly rooms = new Map<string, Map<string, RoomParticipant>>();
  private readonly leaders = new Map<string, string>();
  private readonly waypoints = new Map<string, RoomWaypoint>();
  private readonly audioClips = new Map<string, AudioClip[]>();

  join(
    roomName: string,
    participantName: string,
    socketId: string,
    coords?: Coordinates,
    avatarColor?: string,
    vehicleType?: string,
  ): RoomParticipant {
    if (!this.rooms.has(roomName)) {
      this.rooms.set(roomName, new Map());
    }
    const participants = this.rooms.get(roomName)!;
    const existing = participants.get(participantName);

    const record: RoomParticipant = {
      socketId,
      name: participantName,
      roomName,
      lastSeen: Date.now(),
      isSpeaking: false,
      coords: coords ?? existing?.coords ?? null,
      avatarColor: avatarColor ?? existing?.avatarColor ?? null,
      vehicleType: vehicleType ?? existing?.vehicleType ?? null,
    };
    participants.set(participantName, record);

    const currentLeader = this.leaders.get(roomName);
    if (!currentLeader || !participants.has(currentLeader)) {
      this.leaders.set(roomName, participantName);
    }

    return record;
  }

  touch(
    roomName: string,
    participantName: string,
    socketId: string,
    coords?: Coordinates,
    avatarColor?: string,
    vehicleType?: string,
  ): boolean {
    const participants = this.rooms.get(roomName);
    const existing = participants?.get(participantName);
    if (!existing) return false;

    existing.socketId = socketId;
    existing.lastSeen = Date.now();
    if (coords) {
      existing.coords = coords;
    }
    if (avatarColor) {
      existing.avatarColor = avatarColor;
    }
    if (vehicleType) {
      existing.vehicleType = vehicleType;
    }
    return true;
  }

  isLeader(roomName: string, participantName: string): boolean {
    return this.leaders.get(roomName) === participantName;
  }

  setWaypoint(roomName: string, participantName: string, coords: { latitude: number; longitude: number } | null): RoomWaypoint | null {
    if (!this.isLeader(roomName, participantName)) {
      return this.waypoints.get(roomName) ?? null;
    }
    if (!coords || typeof coords.latitude !== 'number' || typeof coords.longitude !== 'number') {
      this.waypoints.delete(roomName);
      return null;
    }
    const wp: RoomWaypoint = {
      latitude: coords.latitude,
      longitude: coords.longitude,
      setBy: participantName,
      timestamp: Date.now(),
    };
    this.waypoints.set(roomName, wp);
    return wp;
  }

  leave(roomName: string, participantName: string, socketId: string, requireMatchingSocket: boolean): boolean {
    const participants = this.rooms.get(roomName);
    if (!participants) return false;

    const existing = participants.get(participantName);
    if (!existing) return false;

    // Yeniden baglanan kullanicinin yeni soketini, gecikmeli kapanan eski soketin silmesini engeller
    if (requireMatchingSocket && existing.socketId !== socketId) {
      return false;
    }

    participants.delete(participantName);
    this.reconcileRoomAfterRemoval(roomName, participants, participantName);
    return true;
  }

  storeClip(roomName: string, sender: string, audioBase64: string): AudioClip {
    const clip: AudioClip = {
      id: Date.now(),
      sender,
      audioBase64,
      timestamp: Date.now(),
    };

    if (!this.audioClips.has(roomName)) {
      this.audioClips.set(roomName, []);
    }
    const clips = this.audioClips.get(roomName)!;
    clips.push(clip);
    if (clips.length > MAX_STORED_CLIPS) {
      clips.shift();
    }
    return clip;
  }

  sweepStale(now = Date.now()): Array<{ roomName: string; removedNames: string[] }> {
    const affected: Array<{ roomName: string; removedNames: string[] }> = [];

    for (const [roomName, participants] of this.rooms.entries()) {
      const removedNames: string[] = [];
      for (const [participantName, participant] of participants.entries()) {
        if (now - participant.lastSeen > PARTICIPANT_TTL_MS) {
          participants.delete(participantName);
          removedNames.push(participantName);
        }
      }

      if (removedNames.length > 0) {
        for (const removed of removedNames) {
          this.reconcileRoomAfterRemoval(roomName, participants, removed);
        }
        affected.push({ roomName, removedNames });
      }
    }

    return affected;
  }

  getSnapshot(roomName: string, activeSpeaker: string | null) {
    const participantsMap = this.rooms.get(roomName);
    if (!participantsMap) {
      return {
        participants: [],
        activeSpeaker: null,
        leaderName: null,
        waypoint: null,
      };
    }

    const leaderName = this.leaders.get(roomName) ?? null;
    const participants = Array.from(participantsMap.values()).map((p) => ({
      name: p.name,
      coords: p.coords,
      isSpeaking: p.isSpeaking,
      isLeader: p.name === leaderName,
      avatarColor: p.avatarColor ?? null,
      vehicleType: p.vehicleType ?? null,
    }));

    return {
      participants,
      activeSpeaker,
      leaderName,
      waypoint: this.waypoints.get(roomName) ?? null,
    };
  }

  private reconcileRoomAfterRemoval(
    roomName: string,
    participants: Map<string, RoomParticipant>,
    removedName: string,
  ) {
    if (participants.size === 0) {
      this.rooms.delete(roomName);
      this.leaders.delete(roomName);
      this.waypoints.delete(roomName);
      this.audioClips.delete(roomName);
      return;
    }

    if (this.leaders.get(roomName) === removedName) {
      const nextLeader = participants.keys().next().value;
      if (nextLeader) {
        this.leaders.set(roomName, nextLeader);
      }
    }
  }
}
