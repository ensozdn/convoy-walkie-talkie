# ADR 0002: expo-av Yerine expo-audio Entegrasyonu

* **Durum:** Kabul Edildi (Accepted)
* **Tarih:** 2026-10-18

## Baglam
Proje Expo SDK 57 seviyesine yukseltilmistir. Eski `expo-av` kütüphanesi SDK 57 ile birlikte Expo Go yerel ikilisinden (native binary) cikarilmis ve `Cannot find native module ExponentAV` hatasina sebep olmustur.

## Karar
`expo-av` tamamen kaldirilmis ve Expo'nun resmi yeni modulu olan `expo-audio` sistemin tek ses motoru olarak belirlenmistir.

## Gerekce
1. Expo Go (SDK 57) ile fiziksel cihazlarda dogrudan test yapabilme zorunlulugu.
2. Apple ve Expo'nun modern ses mimarisini zorunlu kilmasi.
3. `expo-audio`'nun daha az bellek tuketmesi ve stabilite avantaji.
