# ADR 0004: Veritabani Yerine In-Memory Oda Yonetimi

* **Durum:** Kabul Edildi (Accepted)
* **Tarih:** 2026-10-18

## Baglam
Konvoy telsiz iletisiminde odalar (room code), anlik baglanan suruculer ve konum verileri surekli degisir ve oturum sonlandiginda saklanmasi gerekmez.

## Karar
PostgreSQL/MongoDB gibi harici kalici veritabanlari yerine backend icerisinde Map tabanli (`roomsMap`, `roomActiveSpeaker`) in-memory durum yonetimi kullanilmaktadir.

## Gerekce
1. Sifir veritabani gecikmesi (sub-millisecond state updates).
2. Telsiz oturumlarinin gecici (ephemeral) dogasi.
3. Sunucu altyapisinin (Render, Docker) harici DB baglantisina ihtiyac duymadan hafif ve bagimsiz calisabilmesi.
