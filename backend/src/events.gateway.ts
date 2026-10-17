import { OnModuleDestroy } from '@nestjs/common';
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

interface RoomParticipant {
  socketId: string;
  name: string;
  roomName: string;
  lastSeen: number;
  isSpeaking: boolean;
  coords?: {
    latitude: number;
    longitude: number;
  };
}

interface AudioClip {
  id: number;
  sender: string;
  audioBase64: string;
  timestamp: number;
}

// In-memory oda yönetimi (WebSocket destekli)
const roomsMap = new Map<string, Map<string, RoomParticipant>>(); // roomName -> (name -> RoomParticipant)
const roomAudioClips = new Map<string, AudioClip[]>(); // roomName -> AudioClip[]

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleDestroy {
  @WebSocketServer()
  server!: Server;

  private readonly speakerLock = new SpeakerLock((roomName) => this.emitSpeakerCleared(roomName));

  onModuleDestroy() {
    this.speakerLock.dispose();
  }

  handleConnection(client: Socket) {
    console.log(`[WS CONNECT] Socket bağlandı: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`[WS DISCONNECT] Socket ayrıldı: ${client.id}`);
    const data = client.data as { roomName?: string; participantName?: string };
    if (data && data.roomName && data.participantName) {
      this.leaveRoomInternal(client, data.roomName, data.participantName);
    }
  }

  // --- 1. Odaya Katılma Event'i ---
  @SubscribeMessage('join_room')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomName: string; participantName: string; coords?: any },
  ) {
    const { roomName, participantName, coords } = payload;
    if (!roomName || !participantName) return { success: false };

    // Socket'i Socket.io odasına dahil et (Izole yayın kanalı)
    client.join(roomName);
    client.data = { roomName, participantName };

    if (!roomsMap.has(roomName)) {
      roomsMap.set(roomName, new Map());
    }
    const participants = roomsMap.get(roomName)!;
    
    participants.set(participantName, {
      socketId: client.id,
      name: participantName,
      roomName,
      lastSeen: Date.now(),
      isSpeaking: false,
      coords: coords || null,
    });

    console.log(`[WS JOIN] ${participantName} "${roomName}" odasına katıldı.`);

    // Odadaki herkese güncel durumu bildir (Push)
    this.broadcastRoomState(roomName);
    return { success: true };
  }

  // --- 2. Odadan Ayrılma Event'i ---
  @SubscribeMessage('leave_room')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomName: string; participantName: string },
  ) {
    const { roomName, participantName } = payload;
    this.leaveRoomInternal(client, roomName, participantName);
    return { success: true };
  }

  private leaveRoomInternal(client: Socket, roomName: string, participantName: string) {
    client.leave(roomName);
    this.speakerLock.release(roomName, participantName);
    if (roomsMap.has(roomName)) {
      const participants = roomsMap.get(roomName)!;
      participants.delete(participantName);
      if (participants.size === 0) {
        roomsMap.delete(roomName);
        roomAudioClips.delete(roomName);
      }
    }
    console.log(`[WS LEAVE] ${participantName} "${roomName}" odasından ayrıldı.`);
    this.broadcastRoomState(roomName);
  }

  // --- 3. Bas-Konuş Başlatma Event'i ---
  @SubscribeMessage('ptt_start')
  handlePttStart(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomName: string; participantName: string },
  ) {
    const { roomName, participantName } = payload;
    if (!roomName || !participantName) return;

    this.speakerLock.acquire(roomName, participantName);
    console.log(`[WS PTT START] ${participantName} konuşuyor...`);

    this.server.to(roomName).emit('speaker_changed', {
      activeSpeaker: participantName,
    });
  }

  @SubscribeMessage('ptt_stop')
  handlePttStop(
    @MessageBody() payload: { roomName: string; participantName: string },
  ) {
    const { roomName, participantName } = payload;
    if (!roomName || !participantName) return;
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

  // --- 4. Bas-Konuş Durdurma & Ses Klibi Yayınlama Event'i (~40ms Canlı İletim) ---
  @SubscribeMessage('audio_broadcast')
  handleAudioBroadcast(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomName: string; sender: string; audioBase64: string },
  ) {
    const { roomName, sender, audioBase64 } = payload;
    if (!roomName || !sender || !audioBase64) return { success: false };

    this.releaseSpeaker(roomName, sender);

    const newClip: AudioClip = {
      id: Date.now(),
      sender,
      audioBase64,
      timestamp: Date.now(),
    };

    // Bellekte son 5 klip sakla (otomatik bellek temizliği - RAM koruması)
    if (!roomAudioClips.has(roomName)) {
      roomAudioClips.set(roomName, []);
    }
    const clips = roomAudioClips.get(roomName)!;
    clips.push(newClip);
    if (clips.length > 5) clips.shift();

    console.log(`[WS AUDIO BROADCAST] "${roomName}" odasına ${sender} ses gönderdi (boyut: ${audioBase64.length})`);

    // Sesi gönderen HARİÇ tüm oda üyelerine ANINDA (Push ~40ms) fırlat
    client.to(roomName).emit('audio_incoming', newClip);

    return { success: true, audioId: newClip.id };
  }

  // --- 5. Canlı GPS Konum Güncelleme Event'i ---
  @SubscribeMessage('location_update')
  handleLocationUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomName: string; participantName: string; coords: any },
  ) {
    const { roomName, participantName, coords } = payload;
    if (!roomName || !participantName || !coords) return;

    if (roomsMap.has(roomName)) {
      const participants = roomsMap.get(roomName)!;
      const p = participants.get(participantName);
      if (p) {
        p.coords = coords;
        p.lastSeen = Date.now();
      }
    }

    // Odadaki diğer üyelere canlı konum paketini at
    client.to(roomName).emit('location_broadcast', {
      participantName,
      coords,
    });
  }

  // --- Yardımcı: Odadaki Tüm Üyelere Durumu Yayınla ---
  private broadcastRoomState(roomName: string) {
    if (!roomsMap.has(roomName)) {
      this.server.to(roomName).emit('room_state_update', {
        participants: [],
        activeSpeaker: null,
      });
      return;
    }

    const participants = Array.from(roomsMap.get(roomName)!.values()).map((p) => ({
      name: p.name,
      coords: p.coords,
      isSpeaking: p.isSpeaking,
    }));

    const activeSpeaker = this.speakerLock.getSpeaker(roomName);

    this.server.to(roomName).emit('room_state_update', {
      participants,
      activeSpeaker,
    });
  }
}
