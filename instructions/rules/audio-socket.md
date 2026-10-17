# AUDIO & SOCKET PROTOCOL RULES

Bu kural seti, telsiz ses akisi ve Socket.io iletisimi uzerinde calisilirken gecerlidir.

---

## 1. BAS-KONUS (PTT) PROTOKOLU
* `ptt_start`: Kullanici telsiz tusuna bastiginda odaya gonderilir. O an baska biri konusuyorsa yerel istemcide engelleme haptic geri bildirimi verilir.
* `audio_broadcast`: Konusma bitince kaydedilen ses klibi base64 formatinda odaya dagitilir.
* Yalnizca ayni `roomName` icindeki katilimcilar birbirlerinin sesini ve konumunu alabilir.

## 2. SES MOTORU KISITLAMALARI
* Ses formati: `.m4a` (AAC, Low Quality, mobil ag bant genisligi optimizasyonu).
* Gelen ses bittiginde `rogerBeep` ayari aciksa `beep-off.wav` yerel olarak calinir.
* Engellenen kullanicilarin (`blockedUsers`) ses paketleri istemciye ulastiginda otomatik olarak sessize alinir (mute).
