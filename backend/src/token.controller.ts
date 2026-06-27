import { Controller, Get, Query, BadRequestException } from "@nestjs/common";
import { AccessToken } from "livekit-server-sdk";

@Controller("token")
export class TokenController {
  /**
   * LiveKit token üretici endpoint
   * GET /token?participantName=Sürücü1
   */
  @Get()
  async getToken(@Query("participantName") participantName: string) {
    // Katılımcı adı kontrolü
    if (!participantName) {
      throw new BadRequestException("participantName parametresi gerekli");
    }

    // LiveKit API anahtarları (.env'den gelecek)
    const apiKey = process.env.LIVEKIT_API_KEY || "devkey";
    const apiSecret = process.env.LIVEKIT_API_SECRET || "secret";
    const wsUrl = process.env.LIVEKIT_WS_URL || "ws://localhost:7880";

    // Sabit oda adı (konvoy için)
    const roomName = "konvoy-gizli-oda";

    // Token oluştur
    const at = new AccessToken(apiKey, apiSecret, {
      identity: participantName,
      name: participantName,
    });

    // Oda izinleri
    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true, // Mikrofon paylaşabilir
      canSubscribe: true, // Diğerlerini dinleyebilir
    });

    const token = await at.toJwt();

    return {
      token,
      wsUrl,
      roomName,
      participantName,
    };
  }
}
