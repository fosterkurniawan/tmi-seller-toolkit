# Alur workspace seller

## Temuan

- Harga/HPP dan biaya per item tersimpan dalam state.margin. Promo membaca state yang sama secara langsung; enam diskon merupakan pembanding, belum ada pilihan promo aktif.
- ROAS memakai pendapatan kampanye, biaya iklan, dan margin sebelum iklan yang diisi terpisah. Ini tidak sama dengan margin setelah iklan pada kalkulator produk.
- Stok memakai satu SKU dan rata-rata penjualan harian; unit rencana promo bukan permintaan harian dan tidak boleh dipindahkan otomatis.
- Retur merupakan catatan biaya aktual, tidak otomatis mengurangi simulasi laba produk.
- Excel merupakan template awal statis; CSV berisi hasil input pengguna. Menekan simpan menyimpan seluruh state di perangkat, bukan mengekspor file.
- Form TokioTalk merupakan demo; proteksi dan sumber merupakan materi pendukung.

## Rancangan

Gunakan menu berdasarkan pekerjaan seller, dengan urutan opsional (semua alat tetap dapat diakses langsung):

1. Mulai di sini: peta alur ringkas dan ringkasan hitungan produk yang hidup.
2. Rencana jualan: Harga & keuntungan → Simulasi diskon → Cek biaya iklan.
3. Operasional toko: Rencana stok; Retur & pesan pembeli.
4. Panduan & unduhan: Template & hasil; Belajar di TokioTalk; Kenali proteksi; Cara hitung & sumber.

Bandingkan alternatif: wizard wajib akan menghambat pengguna yang hanya perlu satu alat; pengelompokan menu saja tidak menjelaskan perpindahan data. Pilih menu berkelompok dengan alur opsional, ringkasan sumber data, dan tautan lanjutan.

Form harga dibagi menjadi harga/diskon, modal/operasional, biaya penjualan, serta target. Semua biaya tetap per item; label dan bantuan menegaskan alokasi biaya order. Hasil menjelaskan keuntungan setelah biaya yang diinput dan margin sebelum iklan. Rumus asli dipertahankan.

ROAS dapat mengambil snapshot margin sebelum iklan dari satu produk melalui tindakan eksplisit. Jelaskan bahwa ini hanya sesuai untuk kampanye dengan struktur biaya produk yang sama. Input manual tetap tersedia. Jika biaya/harga produk berubah, snapshot ditandai perlu diperbarui; tidak ada transfer otomatis dari diskon pembanding.

Tampilkan status simpan global, sumber angka contoh/tersimpan/perubahan, dan tombol simpan untuk semua alat. Simpan berbeda dari ekspor. Halaman unduhan menghubungkan tiap hasil CSV dan membedakannya dari template Excel awal.

Navigasi mendukung browser Back/Forward, fokus judul setelah pindah halaman, serta menu seluler yang dapat ditutup dengan Escape dan mengembalikan fokus. Pertahankan palet hijau dan mint, tingkatkan ukuran teks dan keterbacaan.

## Verifikasi

Periksa hubungan harga→promo, snapshot margin sebelum iklan→ROAS termasuk status usang/manual, validasi angka, navigasi/back/forward, penyimpanan, ekspor dan file Excel tetap tersedia, serta layout desktop/320/768/1024. Verifikasi rumus inti tidak berubah. Tidak mengubah tarif, isi produk proteksi, workbook atau integrasi eksternal.
