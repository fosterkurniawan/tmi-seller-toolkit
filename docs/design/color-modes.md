# Pilihan terang / gelap — 16 September 2026

Satu tombol sun/moon dengan role switch, label aksesibel dan status aria-checked pada header halaman akses serta workspace. Label desktop menunjukkan tema aktif; di layar kecil ikon dipertahankan untuk menjaga ruang pilihan bahasa. Palet merah/cyan tetap digunakan. Tema terang halaman akses memakai latar terang; tema gelap juga mengubah form, kartu, hasil, tabel, dialog dan navigasi.

Default mengikuti prefers-color-scheme. Pilihan eksplisit disimpan di localStorage dengan key terpisah, diterapkan sebelum paint, dan tersinkron lewat storage event. Input dan perhitungan tidak dibangun ulang. Tidak ada perubahan pada daftar nomor, gate akses atau pengiriman data.

Verifikasi:
- 17 tes Node lulus, termasuk preferensi awal/perangkat, toggle, aria state, penyimpanan diblokir, dan sinkronisasi antar-tab.
- Browser: form tetap mempertahankan nama/toko saat tema diganti; tema terbawa setelah masuk dan tetap berlaku saat reload.
- Input harga 123456 menghasilkan Rp49,860.43 pada kedua tema; penggantian tema via keyboard tidak mengubah nilai.
- 11 halaman × 4 lebar (320, 768, 1024, 1440) × 2 tema: 88 kombinasi tanpa overflow. Halaman akses 320px juga diperiksa dalam 3 bahasa × 2 tema.
- Screenshot form gelap desktop, dashboard gelap desktop, kalkulator gelap HP, dan form terang HP diperiksa. Ini emulasi ukuran browser, bukan tes perangkat fisik.
- Tidak ada warning/error console selama verifikasi.

## Penyempurnaan kontras light mode

Latar memakai gradasi cyan–pink lembut. Kartu memakai garis biru-abu yang lebih jelas dan bayangan ringan; formulir akses memakai bingkai 2px. Input diberi latar abu muda serta garis lebih gelap. Panel hasil tetap bernuansa mint dan bagian proteksi bernuansa pink. Header, sidebar, navigasi langkah, tabel dan dialog mengikuti kontras baru. Seluruh aturan dibatasi pada light mode dan media screen.

Verifikasi perubahan visual:
- Screenshot formulir dan kalkulator desktop, beranda 1440px, serta kalkulator dan formulir akses 320px diperiksa.
- Sembilan menu sidebar diperiksa pada 1440px tanpa overflow horizontal. Kalkulator dan formulir akses juga tidak overflow pada 320px.
- Kalkulator dark mode pada 320px tetap tampil sesuai palet sebelumnya.
- Ketiga aset publik cocok byte demi byte dengan versi lokal; halaman akses publik menampilkan bingkai 2px dan gradasi baru tanpa warning/error console.
- Pemeriksaan ukuran menggunakan emulasi browser, bukan perangkat fisik. Tidak ada perubahan JavaScript, perhitungan atau alur akses.
