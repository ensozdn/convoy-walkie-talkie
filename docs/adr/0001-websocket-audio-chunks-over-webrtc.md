# ADR 0001: WebRTC Yerine WebSocket ve Base64 Ses Parcalari

* **Durum:** Kabul Edildi (Accepted)
* **Tarih:** 2026-10-18

## Baglam
Telsiz uygulamasi icin anlik ses iletimi gerekmektedir. Alternatifler arasinda tam WebRTC orkestrasyonu (STUN/TURN/SFU) ile WebSocket uzerinden kisa ses klibi yayini mevcuttur.

## Karar
WebRTC mesh veya SFU karmasikligi yerine Socket.io uzerinden AAC (.m4a) ses kliplerinin base64 yayini tercih edilmistir.

## Gerekce
1. Telsiz (PTT - Push to Talk) dogasi geregi yari cift yonlu (half-duplex) calisir; ayni anda herkes konusmaz.
2. WebRTC mobilde arka plana gecildiginde baglanti kopmalari ve yuksek pil/veri tuketimi uretir.
3. Socket.io, NAT asimi ve guvenlik duvari engellerine takilmadan calisir; ek TURN sunucusu maliyeti yaratmaz.
