---
description: Project Constitution & Engineering Standards (Strict No-Emoji, No Obvious Comments, SOLID, Clean Architecture)
---

# PROJECT CONSTITUTION & STANDARDS

Tüm yapay zeka ajanları (Antigravity ve diğerleri) bu depoda çalışırken aşağıdaki kuralları eksiksiz uygulamakla yükümlüdür:

1. **EMOJI YASAĞI (KESİN):**
   - Kod tabanında, loglarda (`console.log`), commit mesajlarında, butonlarda ve arayüz metinlerinde hiçbir şekilde emoji kullanılamaz. Profesyonel, ciddi ve kurumsal tasarım dili esastır. İkonlar sadece `@expo/vector-icons` ile sağlanır.

2. **KENDİNİ ANLATAN KOD (YORUM SATIRI YASAĞI):**
   - Bariz şeyleri anlatan yorum satırları (`// state güncellenir`, `// veriyi çeker`) yazmak kesinlikle yasaktır.
   - Kod, fonksiyon ve değişken isimleriyle kendini anlatmalıdır. Yorum satırı sadece teknik bir zorunluluk (örn: Apple Guideline veya platform workaround) durumunda en fazla 1 satır olarak yazılabilir.
   - Ölü (yorum satırına alınmış) kod depoda bırakılamaz; doğrudan silinir.

3. **SOLID & MODÜLER MİMARİ:**
   - Single Responsibility (SRP): Ekranlar (`src/screens/`) sadece arayüz düzeninden sorumludur. Tüm iş mantığı ve yan etkiler izole hook'larda (`src/hooks/`) toplanmalıdır.
   - Dosya satır sınırı: 250-300 satırı aşan dosyalar derhal alt parçalara bölünmelidir.
   - Çoklu dil: Kod içine doğrudan Türkçe/İngilizce metin gömülmez; `src/constants/translations.js` sözlüğü kullanılır.

4. **HATA YÖNETİMİ & GÜVENİLİRLİK:**
   - Sessiz `catch (e) {}` yasaktır. Hatalar anlamlı ve etiketli loglanmalıdır.
   - Memory leak koruması: `useEffect` içinde başlatılan her dinleyici, abonelik ve ses nesnesi unmount anında temizlenmelidir.

5. **GİT VE BAĞIMLILIKLAR:**
   - Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`) standardı emojisiz kullanılır.
   - Proje Expo SDK 57 tabanındadır. Eski modüller (örn: `expo-av`) projeye eklenemez, güncel modüller (`expo-audio`) kullanılır.
