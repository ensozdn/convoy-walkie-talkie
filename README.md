# 🚗 Konvoy Telsiz Uygulaması

Private konvoy iletişim sistemi - LiveKit + NestJS + React Native (Expo)

## 📁 Proje Yapısı

```
convoy-walkie-talkie/
├── backend/          # NestJS - LiveKit token üretici
└── frontend/         # React Native (Expo) - Push-to-Talk UI
```

## 🚀 Kurulum ve Çalıştırma

### 1️⃣ LiveKit Sunucusunu Başlatın

Local test için Docker ile:

```bash
docker run --rm -p 7880:7880 \
  -p 7881:7881 \
  -p 7882:7882/udp \
  -e LIVEKIT_KEYS="devkey: secret" \
  livekit/livekit-server:latest \
  --dev
```

> **Production için:** AWS'de kendi LiveKit sunucunuzu kurmalısınız!

### 2️⃣ Backend'i Başlatın

```bash
cd backend
npm install
npm run dev
```

Backend http://localhost:3000 adresinde çalışacak.

### 3️⃣ Frontend'i Başlatın

Önce `frontend/App.js` dosyasındaki `BACKEND_URL`'i güncelleyin:

- Local test için: `http://localhost:3000`
- Gerçek cihazlar için: Bilgisayarınızın IP'si (örn: `http://192.168.1.100:3000`)

```bash
cd frontend
npm install

# iOS simülatörde test
npm run ios

# Android emülatörde test
npm run android

# Gerçek cihazda Expo Go ile test
npm start
# QR kodu telefonunuzdan Expo Go ile tarayın
```

## 📱 Kullanım

1. **Expo Go**'yu telefonunuza yükleyin (App Store / Google Play)
2. Backend'in çalıştığından emin olun
3. Frontend'i başlatın ve QR kodu okutun
4. İsminizi girin (örn: "Sürücü 1")
5. "Konvoya Katıl" butonuna basın
6. Devasa **BAS & KONUŞ** butonuna basılı tutarak konuşun!

## 🔐 Güvenlik

- `.env` dosyasını `.gitignore`'a ekleyin
- Production'da güçlü API key/secret kullanın
- Backend'e sadece konvoy üyelerinin erişebileceği bir şifre mekanizması ekleyebilirsiniz

## ⚙️ Yapılandırma

### Backend (`backend/.env`)

```env
LIVEKIT_API_KEY=devkey
LIVEKIT_API_SECRET=secret
LIVEKIT_WS_URL=ws://localhost:7880
PORT=3000
```

### Frontend (`frontend/App.js`)

```javascript
const BACKEND_URL = "http://192.168.1.100:3000"; // IP'nizi yazın
```

## 🐛 Sorun Giderme

**"Token alınamadı" hatası:**

- Backend'in çalıştığından emin olun
- `BACKEND_URL`'in doğru olduğunu kontrol edin
- Gerçek cihazda test ediyorsanız, bilgisayarınızın IP adresini kullanın

**Ses gelmiyor:**

- LiveKit sunucusunun çalıştığından emin olun
- Mikrofon izinlerini kontrol edin
- Birden fazla cihazda test edin (tek cihazda kendinizi duyamazsınız)

**iOS'ta arka planda kopuyor:**

- Bu normal! Expo Go production değil. TestFlight veya App Store build'i gerekli.

## 📦 Production Deployment

1. **LiveKit**: AWS EC2'de kendi sunucunuzu kurun
2. **Backend**: Heroku, Railway, veya AWS'de deploy edin
3. **Frontend**: `eas build` ile native build alın ve TestFlight/Google Play'e yükleyin

## 🛠 Teknolojiler

- **LiveKit**: WebRTC media server
- **NestJS**: Backend framework
- **React Native + Expo**: Mobile framework
- **Push-to-Talk**: `onPressIn`/`onPressOut` ile mikrofon kontrolü

---

**İyi yolculuklar! 🚗📻**
