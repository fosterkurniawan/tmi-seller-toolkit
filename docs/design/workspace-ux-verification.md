# Verifikasi UX — 15 September 2026

## Diperiksa

- Sintaks JavaScript inline dan workspace.js melalui node --check.
- Empat fungsi hitungan margin, promo, ROAS, dan stok identik dengan versi impor. Workbook base64 tidak berubah.
- Harga Rp120.000 mengalir ke promo: diskon 10% → harga Rp108.000 → keuntungan Rp33.710.
- Margin sebelum iklan produk Rp120.000 menghasilkan 35,842592…%; penyalinan eksplisit ke ROAS menghasilkan keuntungan setelah iklan Rp1.584.259 pada input iklan awal.
- Perubahan harga produk menandai salinan margin iklan perlu diperbarui. Pengeditan margin iklan secara manual menghapus hubungan salinan.
- Harga 0 menampilkan pesan error dan menghilangkan angka hasil yang tidak valid. Input valid memulihkan hasil.
- Browser Back/Forward kembali ke halaman yang benar. Fokus berpindah ke judul.
- Menu seluler bisa dibuka dan ditutup dengan Escape; fokus kembali ke tombol menu. Menu tertutup memiliki visibility:hidden.
- Beranda tidak melebar keluar layar pada 1440, 1024, 768, dan 320 px. Seluruh halaman alat/panduan juga diperiksa pada 320 px; tidak ada overflow pada dokumen. Tabel panjang dapat digulir dalam wadahnya.
- Simpan dan reload di origin uji localhost mempertahankan harga Rp120.000 dan hasil Rp33.710. Perubahan berikutnya menunjukkan status belum disimpan. Origin pengguna 127.0.0.1 tetap memakai data semula.
- Tombol hasil CSV pada pusat unduhan menghasilkan TMI_margin_hasil.csv dengan input Rp100.000 dan keuntungan Rp18.050.
- Unduhan TMI_Seller_Toolkit_Starter.xlsx identik dengan workbook tertanam dan lolos pemeriksaan ZIP. Event unduhan pada API browser sempat timeout; keberhasilan dikonfirmasi dari file yang benar-benar tersimpan di Downloads.
- Tidak ada log error/warning browser dalam alur yang diperiksa.

## Batas pemeriksaan

Ini verifikasi fungsi dan pengalaman menggunakan prototype lokal, bukan audit tarif marketplace, akurasi asuransi, atau kepatuhan aksesibilitas menyeluruh. Data simulasi bukan data aktual toko.
