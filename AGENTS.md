# AI AGENT GUIDELINES & CONSTITUTION

Tüm yapay zeka ajanları (Antigravity, Cursor, Copilot vb.) bu depoda kod yazarken veya değişiklik yaparken aşağıdaki anayasal kurallara uymak ZORUNDADIR.

Ayrıntılı kılavuz için bkz: [instructions/CONSTITUTION.md](instructions/CONSTITUTION.md)

---

## ZORUNLU KURALLAR (MANDATORY RULES)

1. **EMOJI YASAGI (STRICT NO-EMOJIS):**
   - Kod tabanında, UI metinlerinde, loglarda, hata mesajlarında ve commit mesajlarında EMOJI KULLANILAMAZ. Kesinlikle yasaktır.

2. **KENDINI ANLATAN KOD & YORUM SATIRI SINIRI:**
   - Ne yaptığı bariz olan kodlara yorum satırı eklemek YASAKTIR (`// butona basınca burası çalışır` gibi açıklamalar yazmayın).
   - Kod temiz fonksiyon ve değişken adlarıyla kendini anlatmalıdır.
   - Sadece zorunlu teknik nedenleri (neden öyle yapıldığını) açıklayan 1-2 satırlık istisnai yorumlara izin verilir.

3. **SOLID & MODULERLIK:**
   - Single Responsibility (SRP): Ekranlar (`screens/`) sadece görsel düzen içerir. İş mantığı hook'lara (`hooks/`) yazılır.
   - Dosyalar 250-300 satırı geçemez. Yaklaşan dosyalar alt modüllere bölünmelidir.
   - Sabit metinler (stringler) kod içine gömülemez; `src/constants/translations.js` kullanılmalıdır.

4. **HATA YONETIMI:**
   - Sessizce geçiştirilen `catch (e) {}` blokları YASAKTIR. Hatalar anlamlı loglanmalıdır.
   - `useEffect` içindeki tüm timer, listener ve socket abonelikleri unmount anında temizlenmelidir (memory leak engelleme).

5. **BAGIMLILIK HIJYENI:**
   - Proje temeli Expo SDK 57'dir.
   - Eski/kullanımdan kalkan paketler (örn: `expo-av`) projeye eklenemez, resmi modern alternatifleri (`expo-audio`) kullanılır.

6. **GIT COMMIT STANDARTLARI:**
   - Conventional Commits zorunludur: `feat:`, `fix:`, `refactor:`, `chore:`. Emojisiz olmalıdır.
