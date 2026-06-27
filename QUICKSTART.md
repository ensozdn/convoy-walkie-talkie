# 🎯 HIZLI BAŞLANGIÇ REHBERİ

## ✅ Projeniz Hazır!

İki komponente sahipsiniz:

1. **Backend** (NestJS): LiveKit token üretici
2. **Frontend** (React Native + Expo): Push-to-Talk telsiz UI

---

## 🚀 3 Adımda Başlat

### 1️⃣ LiveKit Sunucusunu Başlat (Docker)

Yeni terminal açın:

```bash
docker run --rm -p 7880:7880 -p 7881:7881 -p 7882:7882/udp \
  -e LIVEKIT_KEYS="devkey: secret" \
  livekit/livekit-server:latest --dev
```

> ℹ️ Docker yoksa: https://www.docker.com/products/docker-desktop

---

### 2️⃣ Backend'i Başlat

Yeni terminal açın:

```bash
cd convoy-walkie-talkie/backend
npm run dev
```

✅ "🚗 Konvoy Telsiz Backend çalışıyor" mesajını görmelisiniz

---

### 3️⃣ Frontend'i Başlat

#### A) Simülatörde Test (Hızlı)

```bash
cd convoy-walkie-talkie/frontend

# iOS
npm run ios

# Android
npm run android
```

#### B) Gerçek Telefonlarda Test (Önerilen)

1. **Expo Go** uygulamasını telefonlara yükleyin
2. **ÖNEMLİ:** `frontend/App.js` dosyasını açın ve backend URL'i düzenleyin:

```javascript
// Değiştirin:
const BACKEND_URL = "http://localhost:3000";

// Şu şekilde (bilgisayarınızın IP'si):
const BACKEND_URL = "http://192.168.1.XXX:3000";
```

> 💡 IP adresinizi öğrenmek için: `ifconfig | grep inet` (macOS/Linux) veya `ipconfig` (Windows)

3. Frontend'i başlatın:

```bash
cd convoy-walkie-talkie/frontend
npm start
```

4. QR kodu Expo Go ile tarayın

---

## 📱 Nasıl Kullanılır?

1. Uygulamayı açın
2. İsminizi girin (örn: "Araç 1")
3. "Konvoya Katıl" butonuna basın
4. Büyük yuvarlak butona **basılı tutarak** konuşun 🎤
5. Bıraktığınızda mikrofon kapanır

**Birden fazla cihazda test edin!** Tek cihazda kendinizi duyamazsınız.

---

## 🐛 Sorun mu Yaşıyorsunuz?

### "Token alınamadı" hatası

- Backend çalışıyor mu kontrol edin
- `BACKEND_URL` doğru mu? (gerçek cihazlarda IP adresi kullanın)
- Telefonla bilgisayar aynı WiFi'de mi?

### Ses gelmiyor

- LiveKit sunucusu çalışıyor mu?
- Mikrofon izinleri verildi mi?
- En az 2 cihazda test ettiniz mi?

### iOS'ta arka planda kopuyor

- Normal! Expo Go production değil
- Production için EAS build gerekli: `eas build`

---

## 📂 Dosya Yapısı

```
convoy-walkie-talkie/
├── backend/
│   ├── src/
│   │   ├── main.ts              # NestJS entry point
│   │   ├── app.module.ts        # Ana modül
│   │   └── token.controller.ts  # Token endpoint
│   ├── .env                     # LiveKit credentials
│   └── package.json
│
└── frontend/
    ├── App.js                   # Ana React Native kodu
    └── package.json
```

---

## 🔐 Production'a Almadan Önce

1. **LiveKit**: AWS'de kendi sunucunuzu kurun
2. **Backend**: `.env` dosyasını güncelle:
   ```env
   LIVEKIT_API_KEY=production-key
   LIVEKIT_API_SECRET=production-secret
   LIVEKIT_WS_URL=wss://your-server.com
   ```
3. **Frontend**: `BACKEND_URL`'i production IP'ye çevir
4. **Native Build**: `eas build --platform ios/android`
5. **Güvenlik**: Backend'e authentication ekle

---

## 🎉 Başarılar!

Artık kendi private konvoy telsiz sisteminiz var!

**Sorularınız için:** `README.md` dosyalarına bakın veya GitHub Issues kullanın.

**İyi yolculuklar! 🚗📻**
