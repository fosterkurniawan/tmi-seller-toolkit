# Halaman akses TikTok — 16 September 2026

Permintaan: modernisasi halaman awal dengan warna TikTok, visual 3D, dan perjalanan pengisian yang mudah.

## Implementasi

- Latar hitam, headline cyan, tombol merah, form putih. Ilustrasi 3D ecommerce yang sudah tersedia digunakan kembali tanpa dependensi atau gambar eksternal.
- Desktop: hero dan form berdampingan. HP: hero ringkas dengan gambar di sebelah headline, dilanjutkan form satu kolom.
- Nama → WhatsApp → email → persetujuan. Tombol Next/Enter berpindah ke field wajib berikutnya hanya jika isian valid.
- Nama toko, keterangan dan preferensi pemasaran disimpan dalam disclosure opsional. Marketing tetap tidak tercentang secara default dan tidak diperlukan untuk masuk.
- Label tetap terlihat, keyboard tel/email, autofill, error inline dengan aria-live, fokus input invalid, dan reduced-motion.
- Bahasa ID/EN; perubahan bahasa mempertahankan input dan disclosure.
- Gerbang sesi dan mekanisme data tetap sama: penanda 12 jam, tanpa penyimpanan/pengiriman data pribadi atau registrasi backend.

## Verifikasi

- 10 tes Node yang sudah ada lulus; syntax access.js dan i18n.js lulus.
- Browser: submit kosong, nomor invalid, alur Enter, disclosure opsional, bahasa, dan submit valid sampai workspace tanpa persetujuan pemasaran.
- 320/390/768/1024/1440 px × ID/EN: tidak ada overflow horizontal dan gambar terunduh. Screenshot desktop serta HP diperiksa; bukan tes perangkat fisik.
- Tidak ada warning/error console pada sesi pengujian.
