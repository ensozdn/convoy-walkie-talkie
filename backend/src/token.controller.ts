import { Controller, Get, Post, Body, Query, BadRequestException } from "@nestjs/common";
import { AccessToken } from "livekit-server-sdk";

interface ParticipantData {
  id: string;
  name: string;
  roomName: string;
  lastSeen: number;
  isSpeaking: boolean;
  coords?: {
    latitude: number;
    longitude: number;
  };
}

// In-memory oda yönetimi
const roomParticipants = new Map<string, Map<string, ParticipantData>>();
const roomSpeakers = new Map<string, string | null>(); // roomName -> participantName or null

@Controller()
export class TokenController {
  @Get("token")
  async getToken(
    @Query("participantName") participantName: string,
    @Query("roomName") roomName?: string,
  ) {
    if (!participantName) {
      throw new BadRequestException("participantName parametresi gerekli");
    }

    const apiKey = process.env.LIVEKIT_API_KEY || "devkey";
    const apiSecret = process.env.LIVEKIT_API_SECRET || "secret";
    const wsUrl = process.env.LIVEKIT_WS_URL || "ws://localhost:7880";
    const targetRoom = roomName || "konvoy-gizli-oda";

    const at = new AccessToken(apiKey, apiSecret, {
      identity: participantName,
      name: participantName,
    });

    at.addGrant({
      roomJoin: true,
      room: targetRoom,
      canPublish: true,
      canSubscribe: true,
    });

    const token = await at.toJwt();

    // Odaya katılımcıyı ekle/güncelle
    if (!roomParticipants.has(targetRoom)) {
      roomParticipants.set(targetRoom, new Map());
    }
    const roomMap = roomParticipants.get(targetRoom)!;
    roomMap.set(participantName, {
      id: participantName,
      name: participantName,
      roomName: targetRoom,
      lastSeen: Date.now(),
      isSpeaking: false,
    });

    return {
      token,
      wsUrl,
      roomName: targetRoom,
      participantName,
    };
  }

  @Get("room-state")
  getRoomState(@Query("roomName") roomName: string, @Query("participantName") participantName: string) {
    if (!roomName) return { participants: [], activeSpeaker: null };

    const roomMap = roomParticipants.get(roomName);
    if (!roomMap) return { participants: [], activeSpeaker: null };

    const now = Date.now();
    // 15 saniyedir haber alınamayanları temizle
    for (const [name, p] of roomMap.entries()) {
      if (now - p.lastSeen > 15000) {
        roomMap.delete(name);
      }
    }

    // Katılımcının son görülme zamanını güncelle
    if (participantName && roomMap.has(participantName)) {
      roomMap.get(participantName)!.lastSeen = now;
    }

    const participants = Array.from(roomMap.values());
    const activeSpeaker = roomSpeakers.get(roomName) || null;

    return {
      participants,
      activeSpeaker,
    };
  }

  @Post("speak")
  setSpeakState(
    @Body() body: { roomName: string; participantName: string; isSpeaking: boolean },
  ) {
    const { roomName, participantName, isSpeaking } = body;
    if (!roomName || !participantName) return { success: false };

    if (isSpeaking) {
      roomSpeakers.set(roomName, participantName);
    } else {
      if (roomSpeakers.get(roomName) === participantName) {
        roomSpeakers.set(roomName, null);
      }
    }

    return { success: true, activeSpeaker: roomSpeakers.get(roomName) };
  }

  @Post("location")
  updateLocation(
    @Body() body: { roomName: string; participantName: string; coords: { latitude: number; longitude: number } },
  ) {
    const { roomName, participantName, coords } = body;
    const roomMap = roomParticipants.get(roomName);
    if (roomMap && roomMap.has(participantName)) {
      const p = roomMap.get(participantName)!;
      p.coords = coords;
      p.lastSeen = Date.now();
    }
    return { success: true };
  }

  @Post("leave")
  leaveRoom(@Body() body: { roomName: string; participantName: string }) {
    const { roomName, participantName } = body;
    const roomMap = roomParticipants.get(roomName);
    if (roomMap) {
      roomMap.delete(participantName);
    }
    if (roomSpeakers.get(roomName) === participantName) {
      roomSpeakers.set(roomName, null);
    }
    return { success: true };
  }
}
