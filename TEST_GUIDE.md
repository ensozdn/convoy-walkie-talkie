# 🧪 Test Senaryosu

4 araç için test adımları.

## Hazırlık

### 1. LiveKit Sunucusu

```bash
docker run --rm -p 7880:7880 -p 7881:7881 -p 7882:7882/udp \
  -e LIVEKIT_KEYS="devkey: secret" livekit/livekit-server:latest --dev
```

### 2. Backend

```bash
cd convoy-walkie-talkie/backend
npm run dev
```

### 3. IP Adresinizi Öğrenin

```bash
# macOS/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# Örnek çıktı: 192.168.1.105
```

### 4. Frontend'te IP'yi Güncelleyin

`frontend/App.js` dosyasında:

```javascript
const BACKEND_URL = "http://192.168.1.105:3000"; // Kendi IP'niz
```

---

## Test: 4 Cihaz Senaryosu

### Cihaz 1 - iPhone (Araç 1 - Sürücü)

1. Expo Go'yu aç
2. QR kodu tara
3. İsim: **"Araç 1 - Ahmet"**
4. Konvoya Katıl

### Cihaz 2 - Android (Araç 2 - Sürücü)

1. Expo Go'yu aç
2. QR kodu tara
3. İsim: **"Araç 2 - Mehmet"**
4. Konvoya Katıl

### Cihaz 3 - iPad (Araç 3 - Sürücü)

1. Expo Go'yu aç
2. QR kodu tara
3. İsim: **"Araç 3 - Ayşe"**
4. Konvoya Katıl

### Cihaz 4 - Simülatör (Araç 4 - Sürücü)

```bash
cd convoy-walkie-talkie/frontend
npm run ios
```

İsim: **"Araç 4 - Fatma"**

---

## 🎤 İletişim Testi

### Test 1: Basit Konuşma

1. **Araç 1** büyük butona basılı tutsun
2. "Merhaba, ben Araç 1, beni duyuyor musunuz?"
3. Butonu bıraksın
4. Diğer 3 cihazda ses duyulmalı
5. **Araç 2** yanıt versin: "Araç 1, seni 5'e 5 duyuyorum"

### Test 2: Sırayla Konuşma

1. **Araç 1**: "Konvoy burası Araç 1, yol durumu iyi, devam"
2. **Araç 2**: "Araç 2 anlaşıldı, biz de devam ediyoruz"
3. **Araç 3**: "Araç 3, tamamdır"
4. **Araç 4**: "Araç 4, alındı"

### Test 3: Eş Zamanlı Konuşma (Beklenen: Karışım)

1. **Araç 1** ve **Araç 2** aynı anda konuşsun
2. Diğer cihazlarda karışık ses duyulmalı
3. Normal davranış - telsizlerde de böyle olur!

### Test 4: Kesik-Kesik Konuşma

1. **Araç 1** butona basıp-bırakıp-basıp-bıraksın
2. Her basışta ses açılıp kapanmalı
3. Diğer cihazlar kesikli ses duymalı

---

## ✅ Kontrol Listesi

Her cihazda kontrol edin:

- [ ] Katılımcı sayısı: "👥 4 Kişi Aktif" yazıyor mu?
- [ ] Konuşan kişi gösterimi: "🎤 Araç 1 - Ahmet konuşuyor"
- [ ] Kendi konuşurken: "KONUŞUYORSUNUZ" yazıyor mu?
- [ ] Butonu bırakınca: "BAS & KONUŞ" yazısı geri geliyor mu?
- [ ] Ses kalitesi: Net duyuluyor mu?
- [ ] Gecikme: 1 saniyeden az mı?

---

## 🐛 Hata Senaryoları

### Hata 1: Bağlantı Kopması

1. **Araç 2**'nin WiFi'sini kapat
2. Diğer cihazlarda "👥 3 Kişi Aktif" görünmeli
3. WiFi'yi tekrar aç
4. "Konvoya Katıl" ile tekrar bağlansın

### Hata 2: Backend Çökmesi

1. Backend terminalinde Ctrl+C ile durdur
2. Yeni bir cihaz bağlanmaya çalışsın
3. "Token alınamadı" hatası almalı
4. Backend'i tekrar başlat
5. Şimdi bağlanabilmeli

### Hata 3: Mikrofon İzni Yok

1. İlk açılışta mikrofon iznini reddet
2. "Konvoya Katıl" butonu çalışmamalı
3. Telefon ayarlarından izin ver
4. Uygulamayı kapat-aç
5. Şimdi çalışmalı

---

## 📊 Performans Testi

### Gecikme Ölçümü

1. **Araç 1** ve **Araç 2** yan yana olsun
2. **Araç 1** "BİR, İKİ, ÜÇ" desin
3. **Araç 2** hem fiziksel hem de telefondan duysun
4. Gecikme: ~200-500ms normal
5. 1 saniyeden fazlaysa ağ sorunu var

### Bant Genişliği

- Ses codec: Opus (~30-50 kbps per kişi)
- 4 kişi = ~150 kbps upload + ~150 kbps download
- Minimum ağ: 512 kbps (4G yeterli)

---

## 🚗 Gerçek Senaryo (Yolculuk)

### Kilometre Taşları

**0 km** - Başlangıç

```
Araç 1: "Konvoy, hazır mısınız? Yola çıkıyoruz"
Araç 2: "Araç 2 hazır"
Araç 3: "Araç 3 hazır"
Araç 4: "Araç 4 hazır, hadi bakalım!"
```

**50 km** - Mola duyurusu

```
Araç 1: "Konvoy, 10 km sonra benzinlikte mola, tamam mı?"
Araç 2-4: "Tamam"
```

**100 km** - Sorun bildirimi

```
Araç 3: "Araç 1, burası Araç 3, lastikte sorun var gibi"
Araç 1: "Alındı Araç 3, en yakın tesiste duralım"
```

---

## 🎯 Başarı Kriterleri

Proje başarılı sayılır eğer:

- ✅ 4 cihaz aynı anda bağlanabilir
- ✅ Ses kalitesi net ve anlaşılır
- ✅ Gecikme 1 saniyeden az
- ✅ Push-to-talk sorunsuz çalışıyor
- ✅ Bağlantı kopmaları otomatik düzeliyor
- ✅ Ekran kilitliyken çalışıyor (native build ile)

---

## 📝 Sonuç Raporu

Test tamamlandıktan sonra doldurun:

```
Tarih: __________
Tester: __________

Cihazlar:
- Cihaz 1: ________ (iOS/Android)
- Cihaz 2: ________ (iOS/Android)
- Cihaz 3: ________ (iOS/Android)
- Cihaz 4: ________ (iOS/Android)

Sonuçlar:
- Bağlantı başarılı: ☐ Evet ☐ Hayır
- Ses kalitesi: ☐ Mükemmel ☐ İyi ☐ Kötü
- Gecikme: ______ ms
- Karşılaşılan sorunlar: _________________

Genel Değerlendirme: ☐ Başarılı ☐ Başarısız
```

---

**Kolay gelsin! 🚗📻**
