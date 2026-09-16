# Mandarin sederhana — 16 September 2026

Pilihan 简体中文 (`zh`) ditambahkan pada header halaman akses dan workspace. Atribut dokumen memakai `zh-Hans`, format angka `zh-CN`, dan mata uang tetap rupiah (Rp). Bahasa diingat memakai key preferensi yang sudah ada. Workbook Excel tetap berbahasa Indonesia, sesuai keterangan unduhan.

Kamus terpisah `i18n-zh.js` mencakup 582 frasa untuk halaman aktif, termasuk form, error, tooltip, proteksi, kalkulator, hasil, CSV, panduan dan template respons. String dinamis (langkah, progres, ringkasan harga, hari/unit, label hapus dan tooltip) juga diterjemahkan. Nama brand, produk dan ID catatan tidak diterjemahkan. Tidak ada API terjemahan atau pengiriman input ke pihak ketiga.

Verifikasi:
- 13 tes Node lulus, termasuk preferensi bahasa, string dinamis, fallback ID/EN serta cakupan key UI aktif.
- Form nama Mandarin dapat masuk; pergantian bahasa mempertahankan nama dan nama toko.
- Harga 123456 tetap sama saat ID→EN→ZH; hasil Rp49.860,43 / Rp49,860.43 konsisten, hanya format angka berubah.
- 11 halaman × 320/768/1024/1440 px = 44 kombinasi tanpa overflow horizontal. Form Mandarin 320px diperiksa secara visual.
- Pesan nama/email/nomor/toko/persetujuan tampil Mandarin. Tidak ada warning/error console pada alur uji.
