# FRONTEND DOMAIN RULES (REACT NATIVE / EXPO SDK 57)

Bu kural seti, sadece `frontend/` dizini altinda calisilirken gecerlidir.

---

## 1. MMARI SINIRLAR
* Ekranlar (`src/screens/`) yalnizca gorsel yerlesimden sorumludur; socket veya audio yonetimini dogrudan yapamaz.
* Tum veri akisi, zamanlayicilar (timers) ve donanim erisimleri `src/hooks/` altinda toplanir.
* Gorsel bilesenler `src/components/` altinda tutulur ve mumkun oldugunca saf (pure/dumb) tutulur.

## 2. STIL VE TASARIM SISTEMI
* Renkler ve stiller `src/styles/styles.js` icinde tanimlanir; bilesen icinde daginik inline stil veya ad-hoc deger yazilamaz.
* Koyu tema (dark theme) esas alinir (#0f172a zemin, #1e293b kartlar, #38bdf8 aksan renkleri).
* Ikonlar sadece `@expo/vector-icons` uzerinden temin edilir; emoji kullanilamaz.

## 3. CEVIRI VE METIN YONETIMI
* Arayuz metinleri kod icine ham metin olarak yazilamaz. Tum metinler `src/constants/translations.js` icindeki sozluk uzerinden `t.anahtarKelime` seklinde cagrilir.

## 4. EXPO SDK 57 BAGIMLILIKLARI
* Ses islemleri icin yalnizca `expo-audio` kullanilir; `expo-av` projeye sokulamaz.
* Paket surum uyusmazligi durumunda `package.json` icindeki `overrides` kuralina sadik kalinir (SDK 58 paketleri yuklenemez).
