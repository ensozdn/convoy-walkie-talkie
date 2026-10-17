# ADR 0003: Submodule Yerine Tekil Birlesik Depo

* **Durum:** Kabul Edildi (Accepted)
* **Tarih:** 2026-10-18

## Baglam
Projenin baslangicinda `frontend` klasoru icinde ayri bir `.git` depolamasi (submodule/gitlink) bulunmaktaydi. Bu durum commit, push ve build asamasinda bagimsiz remote eksikliginden dolayi surekli hatalara yol aciyordu.

## Karar
`frontend` klasorundeki bagimsiz `.git` silinmis, tum dosyalar ana `convoy-walkie-talkie` deposuna dogrudan baglanmistir.

## Gerekce
1. Tek repo (monorepo) mimarisi ile frontend ve backend surumlerinin atomik senkronizasyonu saglanmistir.
2. Gelistirici ve AI ajanlarinin ayri ayri commit takip etme ihtiyaci ortadan kaldirilmistir.
