import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SpeakerLock } from './speaker-lock';
import { Coordinates, QuickPingPayload, QuickPingType, RoomRegistry } from './room-registry';

const STALE_SWEEP_INTERVAL_MS = 15000;
const VALID_PING_TYPES = new Set<QuickPingType>(['break', 'slow', 'hazard', 'ok']);

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit, OnModuleDestroy {
  @WebSocketServer()
  server!: Server;

  private readonly registry = new RoomRegistry();
  private readonly speakerLock = new SpeakerLock((roomName) => this.emitSpeakerCleared(roomName));
  private sweepTimer: ReturnType<typeof setInterval> | null = null;

  onModuleInit() {
    this.sweepTimer = setInterval(() => this.sweepStaleParticipants(), STALE_SWEEP_INTERVAL_MS);
  }

  onModuleDestroy() {
    if (this.sweepTimer) {
      clearInterval(this.sweepTimer);
      this.sweepTimer = null;
    }
    this.speakerLock.dispose();
  }

  handleConnection(client: Socket) {
    console.log(`[WS CONNECT] Socket baglandi: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`[WS DISCONNECT] Socket ayrildi: ${client.id}`);
    const data = client.data as { roomName?: string; participantName?: string };
    if (data && data.roomName && data.participantName) {
      this.leaveRoomInternal(client, data.roomName, data.participantName, true);
    }
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: {
      roomName: string;
      participantName: string;
      coords?: Coordinates;
      avatarColor?: string;
      vehicleType?: string;
    },
  ) {
    const { roomName, participantName, coords, avatarColor, vehicleType } = payload;
    if (!roomName || !participantName) return { success: false };

    client.join(roomName);
    client.data = { roomName, participantName };

    this.registry.join(roomName, participantName, client.id, coords, avatarColor, vehicleType);
    console.log(`[WS JOIN] ${participantName} "${roomName}" odasina katildi.`);
    this.broadcastRoomState(roomName);
    return { success: true };
  }

  @SubscribeMessage('heartbeat')
  handleHeartbeat(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: {
      roomName: string;
      participantName: string;
      coords?: Coordinates;
      avatarColor?: string;
      vehicleType?: string;
    },
  ) {
    const { roomName, participantName, coords, avatarColor, vehicleType } = payload;
    if (!roomName || !participantName) return { success: false };

    client.data = { roomName, participantName };
    const touched = this.registry.touch(roomName, participantName, client.id, coords, avatarColor, vehicleType);
    if (!touched) {
      return this.handleJoinRoom(client, payload);
    }
    return { success: true };
  }

  @SubscribeMessage('update_profile')
  handleUpdateProfile(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: {
      roomName: string;
      participantName: string;
      avatarColor?: string;
      vehicleType?: string;
    },
  ) {
    const { roomName, participantName, avatarColor, vehicleType } = payload;
    if (!roomName || !participantName) return { success: false };

    this.registry.touch(roomName, participantName, client.id, undefined, avatarColor, vehicleType);
    console.log(`[WS PROFILE] ${participantName} profilini guncelledi: ${vehicleType} / ${avatarColor}`);
    this.broadcastRoomState(roomName);
    return { success: true };
  }

  @SubscribeMessage('leave_room')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomName: string; participantName: string },
  ) {
    const { roomName, participantName } = payload;
    if (!roomName || !participantName) return { success: false };
    this.leaveRoomInternal(client, roomName, participantName, false);
    return { success: true };
  }

  private leaveRoomInternal(
    client: Socket,
    roomName: string,
    participantName: string,
    requireMatchingSocket: boolean,
  ) {
    client.leave(roomName);
    const removed = this.registry.leave(roomName, participantName, client.id, requireMatchingSocket);
    if (!removed) return;

    this.speakerLock.release(roomName, participantName);
    console.log(`[WS LEAVE] ${participantName} "${roomName}" odasindan ayrildi.`);
    this.broadcastRoomState(roomName);
  }

  @SubscribeMessage('ptt_start')
  handlePttStart(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomName: string; participantName: string },
  ) {
    const { roomName, participantName } = payload;
    if (!roomName || !participantName) return;

    this.registry.touch(roomName, participantName, client.id);
    this.speakerLock.acquire(roomName, participantName);
    console.log(`[WS PTT START] ${participantName} konusuyor...`);

    this.server.to(roomName).emit('speaker_changed', {
      activeSpeaker: participantName,
    });
  }

  @SubscribeMessage('ptt_stop')
  handlePttStop(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomName: string; participantName: string },
  ) {
    const { roomName, participantName } = payload;
    if (!roomName || !participantName) return;
    this.registry.touch(roomName, participantName, client.id);
    this.releaseSpeaker(roomName, participantName);
  }

  private releaseSpeaker(roomName: string, participantName?: string) {
    if (this.speakerLock.release(roomName, participantName)) {
      this.emitSpeakerCleared(roomName);
    }
  }

  private emitSpeakerCleared(roomName: string) {
    this.server.to(roomName).emit('speaker_changed', { activeSpeaker: null });
  }

  @SubscribeMessage('audio_broadcast')
  handleAudioBroadcast(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomName: string; sender: string; audioBase64: string },
  ) {
    const { roomName, sender, audioBase64 } = payload;
    if (!roomName || !sender || !audioBase64) return { success: false };

    this.registry.touch(roomName, sender, client.id);
    this.releaseSpeaker(roomName, sender);

    const newClip = this.registry.storeClip(roomName, sender, audioBase64);
    console.log(`[WS AUDIO BROADCAST] "${roomName}" odasina ${sender} ses gonderdi (boyut: ${audioBase64.length})`);
    client.to(roomName).emit('audio_incoming', newClip);

    return { success: true, audioId: newClip.id };
  }

  @SubscribeMessage('location_update')
  handleLocationUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomName: string; participantName: string; coords: Coordinates },
  ) {
    const { roomName, participantName, coords } = payload;
    if (!roomName || !participantName || !coords) return;

    this.registry.touch(roomName, participantName, client.id, coords);
    client.to(roomName).emit('location_broadcast', {
      participantName,
      coords,
    });
  }

  @SubscribeMessage('quick_ping')
  handleQuickPing(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomName: string; sender: string; pingType: QuickPingType },
  ) {
    const { roomName, sender, pingType } = payload;
    if (!roomName || !sender || !VALID_PING_TYPES.has(pingType)) {
      return { success: false };
    }

    this.registry.touch(roomName, sender, client.id);
    const eventPayload: QuickPingPayload = {
      id: Date.now(),
      sender,
      pingType,
      timestamp: Date.now(),
    };

    this.server.to(roomName).emit('quick_ping_incoming', eventPayload);
    return { success: true, pingId: eventPayload.id };
  }

  @SubscribeMessage('set_waypoint')
  handleSetWaypoint(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: {
      roomName: string;
      participantName: string;
      coords: { latitude: number; longitude: number } | null;
    },
  ) {
    const { roomName, participantName, coords } = payload;
    if (!roomName || !participantName) return { success: false };

    if (!this.registry.touch(roomName, participantName, client.id)) {
      client.join(roomName);
      this.registry.join(roomName, participantName, client.id);
    }
    if (!this.registry.isLeader(roomName, participantName)) {
      return { success: false };
    }

    const waypoint = this.registry.setWaypoint(roomName, participantName, coords);
    this.server.to(roomName).emit('waypoint_updated', { waypoint });
    this.broadcastRoomState(roomName);
    return { success: true, waypoint };
  }

  @SubscribeMessage('user_reported')
  handleUserReported(@MessageBody() payload: { reportedUser?: string; reason?: string; reportedBy?: string; room?: string }) {
    console.warn(`[UGC REPORT] Oda="${payload?.room ?? '-'}" Raporlayan="${payload?.reportedBy ?? '-'}" Hedef="${payload?.reportedUser ?? '-'}" Sebep="${payload?.reason ?? '-'}"`);
    return { success: true };
  }

  @SubscribeMessage('user_blocked_report')
  handleUserBlockedReport(@MessageBody() payload: { blockedUser?: string; reportedBy?: string; room?: string }) {
    console.warn(`[UGC BLOCK] Oda="${payload?.room ?? '-'}" Engelleyen="${payload?.reportedBy ?? '-'}" Engellenen="${payload?.blockedUser ?? '-'}"`);
    return { success: true };
  }

  private sweepStaleParticipants() {
    const sweptRooms = this.registry.sweepStale();
    for (const { roomName, removedNames } of sweptRooms) {
      for (const participantName of removedNames) {
        this.speakerLock.release(roomName, participantName);
        console.log(`[WS SWEEP] ${participantName} zaman asimi nedeniyle "${roomName}" odasindan temizlendi.`);
      }
      this.broadcastRoomState(roomName);
    }
  }

  private broadcastRoomState(roomName: string) {
    const activeSpeaker = this.speakerLock.getSpeaker(roomName);
    const snapshot = this.registry.getSnapshot(roomName, activeSpeaker);
    this.server.to(roomName).emit('room_state_update', snapshot);
  }
}
