# CONVOY WALKIE-TALKIE PROJECT CONSTITUTION

Bu doküman, bu depoda geliştirme yapacak tüm yapay zeka ajanları (Antigravity, Cursor, Copilot vb.) ve geliştiriciler için bağlayıcı temel anayasadır. Herhangi bir kod yazılmadan, dosya oluşturulmadan veya commit atılmadan önce bu kurallara uyulması zorunludur.

---

## 1. KESIN EMOJI YASAGI (STRICT NO-EMOJI POLICY)
* **Kod tabanında emoji kullanımı kesinlikle yasaktır.**
* Arayüz metinlerinde, butonlarda, modal pencerelerde, toast bildirimlerinde ve alert mesajlarında emoji kullanılamaz.
* Loglarda (`console.log`, `console.error`, `console.warn`), exception mesajlarında emoji bulunamaz.
* Git commit mesajlarında (`feat: add feature` gibi) emoji kullanılamaz; sadece standart metin kullanılır.
* Kod içi yorum satırlarında emoji kullanılamaz.
* Arayüz, kurumsal, ciddi, profesyonel ve modern bir tasarım dilini korumalıdır. İkon ihtiyacı sadece `@expo/vector-icons` gibi vektörel kütüphanelerle karşılanır.

---

## 2. KENDINI ANLATAN KOD & YORUM SATIRI SINIRLAMASI (SELF-DOCUMENTING CODE)
* **Bariz ve gereksiz yorum satırları yazmak yasaktır.**
  * Yasak örnekler: `// butona basınca burası çalışır`, `// state'i günceller`, `// veriyi çeker`.
* Kod kendini isimlendirmeleriyle (açık, net ve amacını belirten fonksiyon, değişken ve bileşen adlarıyla) anlatmalıdır.
* **Yorum satırına izin verilen tek istisna:**
  * Kodun "ne yaptığı" değil, "neden öyle yapıldığı" (why) zorunlu bir teknik sebepten kaynaklanıyorsa (örn: Apple Guideline 1.2 UGC uyumluluğu, iOS arka plan ses oturumu donanım kısıtı vb.) en fazla 1-2 satırlık teknik bir açıklama bırakılabilir.
* Yorum satırına alınmış ölü kod (commented-out dead code) depoda tutulamaz; ihtiyaç duyulmayan kod silinir (tarihçe Git'te saklıdır).

---

## 3. SOLID & TEMIZ MIMARI PRENSIPLERI (CLEAN ARCHITECTURE)
* **Tek Sorumluluk Prensibi (Single Responsibility Principle - SRP):**
  * **Ekranlar (`src/screens/`):** Yalnızca yerleşim düzeni (layout) ve görsel sunumdan sorumludur. Ağ istekleri, socket bağlantıları veya donanım (mikrofon/GPS) mantığı doğrudan ekran dosyasına yazılamaz.
  * **Kancalar (`src/hooks/`):** Tüm iş mantığı, durum makineleri ve yan etkiler (ses kaydı `usePTT`, soket yönetimi `useRoomSocket`, GPS takibi `useLocation`) izole hook'lar içinde yaşar.
  * **Bileşenler (`src/components/`):** Tekrar kullanılabilir, modüler ve odaklanmış görsel yapı taşlarıdır.
  * **Sabitler (`src/constants/`):** Çoklu dil metinleri (`translations.js`), backend adresleri ve ekran boyutları (`config.js`) tek bir merkezden yönetilir; kod içine sabit metin (hardcoded string) gömülemez.
* **Dosya Boyutu Sınırı:**
  * Hiçbir bileşen veya hook 250-300 satırı geçmemelidir. Bu sınıra yaklaşan veya aşan dosyalar derhal alt modüllere bölünmelidir.
* **KISS (Keep It Simple, Stupid) & DRY (Don't Repeat Yourself):**
  * Aşırı soyutlamadan kaçınılmalı, kod tekrarı yapılmamalı, doğrudan ve en sade çözüm tercih edilmelidir.

---

## 4. HATA YONETIMI & DAYANIKLILIK (ERROR HANDLING & RELIABILITY)
* **Sessiz hata yutma (silent catch) kesinlikle yasaktır:**
  * `try { ... } catch (e) {}` şeklinde hatayı yok sayan bloklar yazılamaz. Hatalar en azından `console.error('[MODUL_ADI] Hata:', e.message)` şeklinde bağlamıyla loglanmalıdır.
* **Bellek Sızıntısı (Memory Leak) Koruması:**
  * `useEffect` içinde başlatılan her timer, event listener, ses oynatıcı ve socket aboneliği unmount anında mutlaka iptal edilmeli ve temizlenmelidir.
* **Null & Tip Güvenliği:**
  * Ağdan ve socket üzerinden gelen nesnelerin alanlarına erişirken opsiyonel zincirleme (`?.`) ve nullish coalescing (`??`) operatörleri zorunludur.

---

## 5. PLATFORM & BAGIMLILIK HIJYENI (DEPENDENCY HYGIENE)
* **Sürüm Disiplini:**
  * Projenin resmi temeli güncel Expo SDK sürümüdür (Expo SDK 57).
  * Yeni bir npm paketi eklenirken sürüm uyumsuzluklarına ve kütüphanenin güncelliğine dikkat edilmelidir.
* **Eski ve Yeni API'ları Karıştırma Yasağı:**
  * Kullanımdan kalkan kütüphaneler (örn: `expo-av`) kesinlikle yeniden projeye sokulamaz; modern resmi alternatifleri (örn: `expo-audio`) kullanılmalıdır.
* **Gereksiz Bağımlılık Yasağı:**
  * Bir iki fonksiyon için harici ağır npm paketleri eklenemez; yerel utils modüllerinde saf JavaScript ile çözülmelidir.

---

## 6. GIT & COMMIT STANDARTLARI (CONVENTIONAL COMMITS)
* Tüm commit mesajları Conventional Commits standartlarına uygun, açık ve net olmalıdır:
  * `feat:` Yeni bir kullanıcı özelliği eklendiğinde.
  * `fix:` Bir hata düzeltildiğinde.
  * `refactor:` Davranış değiştirmeyen kod düzenlemelerinde.
  * `chore:` Bağımlılık, yapılandırma ve derleme güncellemelerinde.
* Değişiklikler tek bir dev commit yerine mantıksal, küçük ve atomik adımlarla kaydedilmelidir.
