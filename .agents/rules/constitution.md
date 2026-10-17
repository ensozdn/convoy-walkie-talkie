---
description: Project Constitution & Engineering Standards (Strict No-Emoji, No Obvious Comments, SOLID, Clean Architecture, Canonical References, ADRs, Verify Loop)
---

# PROJECT CONSTITUTION & STANDARDS

Tum yapay zeka ajanlari (Antigravity ve digerleri) bu depoda calisirken asagidaki kurallari eksiksiz uygulamakla yukumludur:

1. **EMOJI YASAGI (KESIN):**
   - Kod tabaninda, loglarda (`console.log`), commit mesajlarinda, butonlarda ve arayuz metinlerinde hicbir sekilde emoji kullanilamaz. Profesyonel, ciddi ve kurumsal tasarim dili esastir. Ikonlar sadece `@expo/vector-icons` ile saglanir.

2. **KENDINI ANLATAN KOD (YORUM SATIRI YASAĞI):**
   - Bariz seyleri anlatan yorum satirlari (`// state guncellenir`, `// veriyi ceker`) yazmak kesinlikle yasaktir.
   - Kod, fonksiyon ve degisken isimleriyle kendini anlatmalidir. Yorum satiri sadece teknik bir zorunluluk (orn: Apple Guideline veya platform workaround) durumunda en fazla 1 satir olarak yazilabilir.
   - Olu (yorum satirina alinmis) kod depoda birakilamaz; dogrudan silinir.

3. **ALTIN STANDARTLARI REFERANS ALMA (CANONICAL):**
   - Yeni bir hook yazarken: `frontend/src/hooks/usePTT.js`
   - Yeni bir UI ekrani yazarken: `frontend/src/screens/RadioTab.js`
   - Yeni bir backend gateway yazarken: `backend/src/events.gateway.ts`
   dosyalarindaki mimari stil, temizlik ve hata yonetimi ornek alinmalidir.

4. **TEK KOMUTLUK DOGRULAMA DONGUSU:**
   - Kod yazildiktan veya degisiklik yapildiktan sonra mutlaka terminalde `npm run verify` calistirilmali, derleme veya soz dizimi hatasi varsa kimseye sormadan tek seferde cozulmelidir.

5. **ADR BILINCI:**
   - `docs/adr/` altindaki bilincli mimari kararlari (WebRTC yerine WebSocket, expo-av yerine expo-audio, monorepo tercihi) bozan refactoring veya degisiklik yapilamaz.

6. **SOLID & MODULER MIMARI:**
   - Single Responsibility (SRP): Ekranlar (`src/screens/`) sadece arayuz duzeninden sorumludur. Tum is mantigi ve yan etkiler izole hook'larda (`src/hooks/`) toplanmalidir.
   - Dosya satir siniri: 250-300 satiri asan dosyalar derhal alt parcalara bolunmelidir.
   - Coklu dil: Kod icine dogrudan Turkce/Ingilizce metin gomulmez; `src/constants/translations.js` sozlugu kullanilir.

7. **HATA YONETIMI & GUVENILIRLIK:**
   - Sessiz `catch (e) {}` yasaktir. Hatalar anlamli ve etiketli loglanmalidir.
   - Memory leak korumasi: `useEffect` icinde baslatilan her dinleyici, abonelik ve ses nesnesi unmount aninda temizlenmelidir.

8. **GIT VE BAGIMLILIKLAR:**
   - Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`) standardi emojisiz kullanilir.
   - Proje Expo SDK 57 tabanindadir. Eski moduller (orn: `expo-av`) projeye eklenemez, guncel moduller (`expo-audio`) kullanilir.
   - Backend TypeScript derleyicisinde strict kurallara uyulur.
