# AI AGENT GUIDELINES & CONSTITUTION

Tum yapay zeka ajanlari (Antigravity, Cursor, Copilot vb.) bu depoda kod yazarken veya degisiklik yaparken asagidaki anayasal kurallara ve mimari standartlara uymak ZORUNDADIR.

Ayrintili kilavuzlar:
* [instructions/CONSTITUTION.md](instructions/CONSTITUTION.md) - Ana Anayasa
* [instructions/CANONICAL.md](instructions/CANONICAL.md) - Altin Standart Referans Sablon Dosyalar
* [instructions/rules/frontend.md](instructions/rules/frontend.md) - Frontend Kural Seti
* [instructions/rules/backend.md](instructions/rules/backend.md) - Backend Kural Seti
* [instructions/rules/audio-socket.md](instructions/rules/audio-socket.md) - Ses ve Socket Kurallari
* [docs/adr/](docs/adr/) - Mimari Karar Kayitlari (ADR)

---

## ZORUNLU KURALLAR (MANDATORY RULES)

1. **EMOJI YASAGI (STRICT NO-EMOJIS):**
   - Kod tabaninda, UI metinlerinde, loglarda, hata mesajlarinda ve commit mesajlarinda EMOJI KULLANILAMAZ. Kesinlikle yasaktir.

2. **KENDINI ANLATAN KOD & YORUM SATIRI SINIRI:**
   - Ne yaptigi bariz olan kodlara yorum satiri eklemek YASAKTIR (`// butona basinca burasi calisir` gibi aciklamalar yazmayin).
   - Kod temiz fonksiyon ve degisken adlariyla kendini anlatmalidir.
   - Sadece zorunlu teknik nedenleri (neden oyle yapildigini) aciklayan 1-2 satirlik istisnai yorumlara izin verilir.

3. **ALTIN STANDARTLARI REFERANS ALMA:**
   - Yeni bir hook yazarken: `frontend/src/hooks/usePTT.js`
   - Yeni bir UI ekrani yazarken: `frontend/src/screens/RadioTab.js`
   - Yeni bir backend gateway yazarken: `backend/src/events.gateway.ts`
   dosyalarindaki mimari stil, temizlik ve hata yonetimi ornek alinmalidir.

4. **TEK KOMUTLUK DOGRULAMA DONGUSU:**
   - Kod yazildiktan veya degisiklik yapildiktan sonra mutlaka terminalde `npm run verify` calistirilmali, derleme veya soz dizimi hatasi varsa kimseye sormadan tek seferde cozulmelidir.

5. **ADR BILINCI:**
   - `docs/adr/` altindaki bilincli mimari kararlari (WebRTC yerine WebSocket, expo-av yerine expo-audio, monorepo tercihi) bozan refactoring veya degisiklik yapilamaz.

6. **SOLID & MODULERLIK:**
   - Single Responsibility (SRP): Ekranlar (`screens/`) sadece gorsel duzen icerir. Is mantigi hook'lara (`hooks/`) yazilir.
   - Dosyalar 250-300 satiri gecemez. Yaklasan dosyalar alt modullere bolunmelidir.
   - Sabit metinler (stringler) kod icine gomulemez; `src/constants/translations.js` kullanilmalidir.

7. **HATA YONETIMI:**
   - Sessizce gecistirilen `catch (e) {}` bloklari YASAKTIR. Hatalar anlamli loglanmalidir.
   - `useEffect` icindeki tum timer, listener ve socket abonelikleri unmount aninda temizlenmelidir (memory leak engelleme).

8. **BAGIMLILIK VE DERLEYICI HIJYENI:**
   - Proje temeli Expo SDK 57'dir.
   - Eski/kullanimdan kalkan paketler (orn: `expo-av`) projeye eklenemez, resmi modern alternatifleri (`expo-audio`) kullanilir.
   - Backend TypeScript katmaninda `noImplicitAny: true` ve `strictNullChecks: true` kurallarina harfiyen uyulur.

9. **GIT COMMIT STANDARTLARI:**
   - Conventional Commits zorunludur: `feat:`, `fix:`, `refactor:`, `chore:`. Emojisiz olmalidir.
