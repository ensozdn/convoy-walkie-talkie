# BACKEND DOMAIN RULES (NESTJS / WEBSOCKET)

Bu kural seti, sadece `backend/` dizini altinda calisilirken gecerlidir.

---

## 1. MMARI DUZEN
* NestJS standart modul yapisi (`*.module.ts`, `*.controller.ts`, `*.gateway.ts`) korunur.
* REST uc noktalari `TokenController` icinde, anlik WebSocket olaylari `EventsGateway` icinde tutulur.
* Sunucu in-memory oda yonetimi kullanir (`roomsMap`, `SpeakerLock`, `roomAudioClips`). Veritabanina ihtiyac duyulmaz.

## 2. AG VE PERFORMANS KONTROLLERI
* Ses yuklemeleri icin Express govde boyutu limiti (`json` ve `urlencoded`) 10MB olarak korunmalidir.
* CORS ayarlari Expo Go ve mobil ag erisimine izin verecek sekilde acik kalmalidir.

## 3. TIP GUVENLIGI VE COMPILER
* TypeScript derleyicisi strict modda calisir. Gevsek `any` kullanilamaz.
* Gelen socket ve HTTP isteklerindeki alanlar tip kontrolunden gecirilmelidir.
