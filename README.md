# Toolkit Seller

Website **TMI Seller Toolkit — Ruang Kerja Seller**, diimpor dari HTML pengguna pada 15 September 2026.

## Buka website

Jalankan dari folder proyek:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory web
```

Buka http://127.0.0.1:4173. URL lokal tersedia selama server berjalan di Mac ini. File `web/index.html` juga bisa dibuka langsung.

Tidak membutuhkan npm atau build: CSS, JavaScript, ikon, dan Excel bawaan berada dalam satu HTML.

## Versi awal

- Source aktif: [web/index.html](web/index.html).
- Diimpor identik dari `/Users/fosterkurniawan/Downloads/TMI_Seller_Toolkit_Worksite.html`.
- SHA-256: `ca8b145327399ea351bb453af7e7a4ae0a79513b06de9cc680728d165166a6f4`.
- Tampilan file ini memakai hijau gelap, mint, dan putih. Ini baseline dari pengguna; arsip chat juga menyebut versi redesign navy yang berbeda.
- Fitur: HPP/margin, promo, ROAS, stok, retur/respons, ekspor CSV, Excel 8 sheet, dan edukasi TokioTalk/proteksi.
- Data disimpan di browser setelah tombol Simpan dipilih. Penyimpanan mengikuti browser dan alamat website.

## Konteks pengembangan

- [Riset Toolkit TikTok Shop](docs/research/riset-toolkit-tiktok-shop.md): arah fee engine berdasarkan tanggal efektif serta integrasi premi.
- [Branch · Isi Template Excel](docs/research/branch-isi-template-excel.md): pembahasan website dan template.

Arsip merupakan konteks, bukan verifikasi tarif terkini. Fee master, rekonsiliasi settlement, dan integrasi premi pada riset belum diimplementasikan dalam impor ini. Website masih prototype lokal dengan biaya contoh yang bisa diedit, belum tersambung ke TikTok Shop, Mekari, atau sistem polis.

## Verifikasi impor

- SHA-256 file asli, file proyek, dan respons HTTP sama.
- Homepage dan navigasi kalkulator terbuka tanpa log error/warning selama pemeriksaan browser.
- Harga Rp100.000 menghasilkan kontribusi Rp18.050; harga Rp120.000 menghasilkan Rp33.710 dengan input lain tetap. Input dikembalikan setelah pemeriksaan.
- Excel tertanam lolos pemeriksaan integritas ZIP dan berisi 8 sheet.

Ini pemeriksaan impor dan interaksi dasar, bukan audit seluruh rumus atau kebijakan marketplace.
