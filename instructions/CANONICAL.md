# CANONICAL REFERENCE FILES (ALTIN STANDART SABLONLAR)

Bu dosyalar, yeni bir kod veya refactor yazilirken yapay zeka ajanlari ve gelistiriciler tarafindan birebir ornek alinmasi gereken "altin standart" referanslardir. Soyut kurallar yerine bu dosyalardaki mimari stil, hata yakalama, temizlik ve adlandirma kaliplari taklit edilmelidir.

---

## 1. FRONTEND HOOK STANDARDI: `frontend/src/hooks/usePTT.js`
Yeni bir hook yazarken veya mevcut bir hook duzenlenirken referans alinacak modeldir.

Gosterdigi kaliplar:
* Tek Sorumluluk: Sadece ses oturumu, bas-konus durumu ve roger beep mantigindan sorumludur.
* Unmount Temizligi: `useEffect` donusunde baslatilan tum oynaticilari (`remove()`), kaydedicileri (`stop()`) temizler.
* Hata Yonetimi: Try-catch bloklarinda hatalar sessizce gecistirilmez; `console.error('[WS AUDIO PLAYBACK ERROR]:', e.message)` seklinde etiketli loglanir.
* Geriye Donuk Uyumluluk: Yeni API metodlarini eski cagrilarla uyumlu kilacak wrapper metodlar saglar.

---

## 2. FRONTEND EKRAN (UI) STANDARDI: `frontend/src/screens/RadioTab.js`
Yeni bir ekran (screen) veya gorsel bilesen yazilirken referans alinacak modeldir.

Gosterdigi kaliplar:
* Is Mantigindan Arinmislik: Ekran dosyasi icinde dogrudan socket dinleyicisi veya audio kaydi yapilmaz. Tum durum ve fonksiyonlar props / hook uzerinden alinir.
* Gorsel Ayrim: Sabit renk kodlari yerine `styles` nesnesi uzerinden stil uygulanir.
* Metin Standartlari: Ekrana gomulu ham string yerine ceviri sabiti (`t.radio`, `t.pttDefault`) kullanilir.
* Sade Render: 250 satirin altinda tutulmus, okunabilir JSX hiyerarsisi.

---

## 3. BACKEND GATEWAY & WEBSOCKET STANDARDI: `backend/src/events.gateway.ts`
Yeni bir backend gateway, controller veya servis yazilirken referans alinacak modeldir.

Gosterdigi kaliplar:
* Guvenli Veri Erisimi: Gelen socket isteklerinde oda ve katilimci verileri guvenle kontrol edilir.
* Tip Guvenligi: `RoomParticipant`, `AudioClip` gibi acik interface tanimlari kullanilir; gevsek `any` kullanilmaz.
* Olay Ayriligi: Her `@SubscribeMessage` tek bir isi (katilma, ayrilma, bas-konus baslangici, ses yayini) yonetir.
