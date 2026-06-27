# Backend - LiveKit Token Generator

NestJS tabanlı minimal token üretici servis.

## Kurulum

```bash
npm install
```

## Çalıştırma

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

## API Endpoint

### GET /token

Token üretir ve LiveKit bağlantı bilgilerini döner.

**Query Parametresi:**

- `participantName` (required): Katılımcı ismi

**Örnek İstek:**

```
GET http://localhost:3000/token?participantName=Sürücü1
```

**Örnek Yanıt:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "wsUrl": "ws://localhost:7880",
  "roomName": "konvoy-gizli-oda",
  "participantName": "Sürücü1"
}
```

## Environment Variables

`.env` dosyası oluşturun:

```env
LIVEKIT_API_KEY=devkey
LIVEKIT_API_SECRET=secret
LIVEKIT_WS_URL=ws://localhost:7880
PORT=3000
```

Production için gerçek değerleri kullanın!

## Güvenlik Notu

Bu minimal implementasyon herkese açık. Production'da:

1. API key authentication ekleyin
2. Rate limiting uygulayın
3. Sadece belirli IP'lerden erişim verin
4. HTTPS kullanın
