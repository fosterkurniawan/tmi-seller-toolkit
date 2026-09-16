# Toolkit Seller

## Hosting Sites

[Buka TMI Seller Toolkit](https://tmi-seller-toolkit.tmisquadgenai.chatgpt.site) — hosting publik tanpa perlu laptop menyala. Hosting termasuk dalam kuota beta akun Sites. Form dan daftar nomor akses tetap sama. Data tersimpan pada alamat lama tidak otomatis berpindah ke alamat ini.

Panduan pembaruan: [Sites hosting](docs/design/sites-hosting.md).

Website **TMI Seller Toolkit — Ruang Kerja Seller**, diimpor dari HTML pengguna pada 15 September 2026.

## Kolaborasi lewat GitHub

Repositori: [fosterkurniawan/tmi-seller-toolkit](https://github.com/fosterkurniawan/tmi-seller-toolkit).

Untuk menjalankan project setelah mendapat akses:

```sh
git clone https://github.com/fosterkurniawan/tmi-seller-toolkit.git
cd tmi-seller-toolkit
python3 -m http.server 4173 --bind 127.0.0.1 --directory web
```

Buka `http://127.0.0.1:4173`. Tes perhitungan, bahasa, akses, dan tema dapat dijalankan dengan `node --test tests/*.test.cjs`.

Perubahan kode di GitHub belum otomatis memperbarui website Sites; publikasi website mengikuti [panduan hosting](docs/design/sites-hosting.md). Folder `.runtime/`, berkas `.env`, dan credential lokal tidak termasuk repositori.

## Buka website

Jalankan dari folder proyek:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory web
```

Buka http://127.0.0.1:4173. URL lokal tersedia selama server berjalan di Mac ini. Gunakan server HTTP agar penanda sesi formulir bekerja konsisten.

### Buka dari HP / tablet

Hubungkan HP dan Mac ke Wi-Fi yang sama. Jalankan server dengan akses jaringan lokal:

```sh
python3 -m http.server 4173 --bind 0.0.0.0 --directory web
```

Cari IP Mac dengan `ipconfig getifaddr en0`, lalu buka `http://IP-MAC:4173` di browser HP. Server dan Mac harus tetap menyala. `127.0.0.1` pada HP menunjuk ke HP itu sendiri. Alamat jaringan lokal ini bukan hosting publik.

Navigasi bawah muncul di layar sampai 880px, dengan akses Beranda, Jualan, Toko, dan semua menu. Tabel diskon/retur menjadi kartu sampai 600px. Form memakai ukuran sentuh yang lebih besar, keyboard angka, dan modal yang dapat digulir. Data tersimpan tetap mengikuti browser dan alamat website; data Mac tidak otomatis tersinkron ke HP.

Tidak membutuhkan npm atau build. HTML berisi engine kalkulasi dan workbook bawaan; `web/workspace.css` dan `web/workspace.js` mengatur alur, bantuan input, dan navigasi. `web/mobile.css` mengatur pengalaman HP dan tablet. `web/theme.css` mengatur palet TikTok Shop, sementara `web/i18n.js` menyediakan sistem terjemahan lokal dan `web/i18n-zh.js` memuat kamus Mandarin. Sertakan seluruh folder `web/`, termasuk ilustrasi di `web/assets/`, jika memindahkan website.

## Akses internet — pola Dashboard S1

Toolkit memakai **Cloudflare Quick Tunnel**, dengan server khusus yang hanya menyajikan folder `web/`. Server publik memakai `127.0.0.1:4174`; preview lokal 4173 tetap terpisah.

Alamat aktif tersedia di `.runtime/public_url.txt`:

```sh
cat .runtime/public_url.txt
```

Mac harus menyala, login, dan terhubung internet. HP tidak perlu berada di Wi-Fi yang sama. Alamat Quick Tunnel dapat berubah setelah tunnel dimulai ulang; data browser pada alamat sebelumnya tidak otomatis pindah. Ini akses demo publik dengan HTTPS, tanpa jaminan uptime, bukan hosting permanen. [Dokumentasi Cloudflare](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/trycloudflare/).

Layanan `com.seller-toolkit.serve` dan `com.seller-toolkit.tunnel` dikelola oleh LaunchAgent: mulai saat login dan dijalankan ulang jika proses berhenti. Untuk memasang kembali dari folder proyek:

```sh
python3 tools/install_public_access.py
```

Log ada di `~/Library/Logs/seller-toolkit/`. Untuk menutup akses publik:

```sh
launchctl bootout gui/$(id -u)/com.seller-toolkit.tunnel
launchctl bootout gui/$(id -u)/com.seller-toolkit.serve
```

Dua file `com.seller-toolkit.*.plist` di `~/Library/LaunchAgents/` perlu dipindahkan keluar folder itu jika ingin menonaktifkan mulai otomatis pada login berikutnya. Tidak ada perubahan pada layanan, token, atau notifikasi Telegram Dashboard S1. Toolkit berisi angka contoh; input pengguna hanya tersimpan di browser masing-masing.

## Tampilan ringkas

Dashboard memakai kartu misi, ikon bergaya 3D, dan ilustrasi ecommerce lokal. Progres 0–3 menghitung alat rencana jualan yang dibuka selama kunjungan ini; kembali ke 0 saat reload. Bantuan input tersedia lewat tombol `?`, tanpa menghilangkan label dan petunjuk pembaca layar.

## Bahasa & tema

Pilih **Indonesia / English / 简体中文 (Mandarin sederhana)** pada header. Pilihan bahasa diingat terpisah dari data hitungan. Formulir, navigasi, bantuan, pesan error, template balasan, dan label CSV mengikuti bahasa; angka tetap dalam rupiah dengan pemisah sesuai bahasa. Angka yang sedang diketik, ID internal, dan nilai status tersimpan tidak berubah. Workbook Excel bawaan tetap berbahasa Indonesia, ditandai pada halaman unduhan.

Palet hitam–putih, merah, dan cyan mengacu pada [situs resmi TikTok Shop](https://seller.tiktok.com/), ditinjau 15 September 2026. Nuansa ini diterapkan pada seluruh halaman dan ilustrasi 3D lokal, dengan identitas toolkit sendiri. [Rancangan dan verifikasi](docs/design/language-tiktok-theme.md).

## Alur workspace

- **Rencana jualan:** Harga dan keuntungan → Simulasi diskon → Cek biaya iklan.
- **Operasional toko:** Rencana stok; Retur & pesan pembeli.
- **Panduan & unduhan:** Template & hasil; Belajar di TokioTalk; Kenali proteksi; Biaya & referensi; Cara hitung & sumber.

Promo otomatis memakai biaya produk. Halaman iklan dapat dihubungkan ke margin produk setelah premi dan operasional, sebelum iklan. Perubahan produk langsung diperhitungkan; edit margin iklan secara manual memutus hubungan. Stok dan retur memiliki input terpisah. Status simpan berlaku untuk seluruh alat, CSV berisi hasil saat ini, sedangkan Excel merupakan template awal.

Rancangan dan hubungan data dijelaskan di [catatan UX](docs/design/workspace-ux.md). [Hasil pemeriksaan](docs/design/workspace-ux-verification.md) mencakup alur antaralat, penyimpanan, navigasi, unduhan, dan layar kecil.

## Versi awal

- Source aktif: [web/index.html](web/index.html).
- Versi impor di commit `96224e4` identik dengan `/Users/fosterkurniawan/Downloads/TMI_Seller_Toolkit_Worksite.html`; versi aktif sudah mendapat penyempurnaan UX.
- SHA-256 versi impor: `ca8b145327399ea351bb453af7e7a4ae0a79513b06de9cc680728d165166a6f4`.
- Tampilan file ini memakai hijau gelap, mint, dan putih. Ini baseline dari pengguna; arsip chat juga menyebut versi redesign navy yang berbeda.
- Fitur: HPP/margin, promo, ROAS, stok, retur/respons, ekspor CSV, Excel 8 sheet, dan edukasi TokioTalk/proteksi.
- Data disimpan di browser setelah tombol Simpan dipilih. Penyimpanan mengikuti browser dan alamat website.

## Konteks pengembangan

- [Riset Toolkit TikTok Shop](docs/research/riset-toolkit-tiktok-shop.md): arah fee engine berdasarkan tanggal efektif serta integrasi premi.
- [Branch · Isi Template Excel](docs/research/branch-isi-template-excel.md): pembahasan website dan template.

Arsip merupakan konteks, bukan verifikasi tarif terkini. Premi simulasi, profil biaya contoh, dan estimasi settlement sudah tersedia. Fee engine berdasarkan tanggal efektif serta rekonsiliasi transaksi aktual belum tersedia. Website masih prototype lokal dengan biaya contoh yang bisa diedit, belum tersambung ke TikTok Shop, Mekari, atau sistem polis.

## Verifikasi impor

- SHA-256 file asli, file proyek, dan respons HTTP sama.
- Homepage dan navigasi kalkulator terbuka tanpa log error/warning selama pemeriksaan browser.
- Harga Rp100.000 menghasilkan kontribusi Rp18.050; harga Rp120.000 menghasilkan Rp33.710 dengan input lain tetap. Input dikembalikan setelah pemeriksaan.
- Excel tertanam lolos pemeriksaan integritas ZIP dan berisi 8 sheet.

Ini pemeriksaan impor dan interaksi dasar, bukan audit seluruh rumus atau kebijakan marketplace.

## Pembaruan proteksi — 16 September 2026

Fitur diadaptasi dari `TMI_Seller_Toolkit_ID_EN 1.html` milik pengguna:

- Premi seller ON/OFF **0,3% dari harga setelah diskon**, terpisah dari HPP; perbandingan margin dan rekomendasi harga yang menghitung ulang premi.
- Biaya platform per pesanan dibagi jumlah item; operasional per item atau alokasi biaya bulanan (dibulatkan ke atas Rp0,01).
- Premi masuk setiap skenario diskon serta margin ROAS yang terhubung. Rekomendasi harga dibulatkan ke atas Rp1.
- **Contoh proteksi** menerapkan profil sumber secara eksplisit. Biaya tetap dapat diedit; angka tersimpan lama memakai proteksi OFF, item/order 1 dan operasional 0.
- Workbook asli **9 sheet** (termasuk Operasional), terpisah dari input sesi. CSV mengekspor hitungan saat ini.
- Form akses ID/EN wajib sesuai pilihan pengguna: nama, WhatsApp Indonesia, email, nama toko, dan persetujuan akses. Keterangan dan pemasaran opsional.

Form ini gerbang UX lokal, **bukan autentikasi server**. Nilai pribadi tidak dikirim atau disimpan aplikasi; hanya penanda sesi non-PII selama 12 jam di tab browser. Kalkulasi tersimpan tetap terpisah di localStorage. Tombol Keluar menghapus penanda akses, bukan hitungan tersimpan. Belum ada pendaftaran, CRM, atau pencatatan persetujuan ke TMI.

Tarif premi 0,3% adalah asumsi simulasi dari lampiran; menyalakannya tidak membeli atau mengaktifkan polis. Profil template memakai platform 8,75%, affiliate 5%, biaya/order Rp1.250 dan target 20%; bukan tarif universal atau penawaran resmi.

Verifikasi: `node --test tests/*.test.cjs` (10 tes), pemeriksaan syntax seluruh JS, alur browser form/proteksi/promo/ROAS/simpan/unduh, serta pemeriksaan overflow 11 halaman × 4 lebar × 2 bahasa. [Catatan integrasi](docs/design/protection-integration.md).


### Pembatasan nomor sementara

Form awal sekarang hanya menerima lima nomor yang ditentukan pengguna. Format `08…`, `62…`, dan `+62…` dinormalisasi; nomor lain menahan submit. Versi penanda sesi dinaikkan sehingga penanda lama tidak diterima setelah halaman memuat versi baru. Nomor yang diinput tidak ditambahkan ke penanda sesi atau dikirim ke server.

Pembatasan ini adalah filter form pada prototype statis, **bukan otorisasi server atau verifikasi kepemilikan nomor**. Daftar dan logika berada pada JavaScript klien, sehingga tidak boleh diperlakukan sebagai batas keamanan. Pengamanan akses sebenarnya memerlukan backend dan verifikasi seperti OTP.


### Mode terang / gelap

Tombol matahari/bulan di sebelah pilihan bahasa mengubah tema halaman masuk dan seluruh workspace. Pengaturan pertama mengikuti preferensi perangkat; setelah dipilih, preferensi disimpan terpisah dengan key `tmi-seller-theme`. Tema tetap bekerja bila penyimpanan browser diblokir (hanya untuk halaman yang sedang terbuka). Preferensi disinkronkan antar-tab pada alamat yang sama. Pergantian tema tidak mereset isian, data kalkulasi, bahasa, atau akses.

`theme-mode.js` menerapkan tema sebelum render; `color-modes.css` mengatur kontras, permukaan, input, tabel, pesan, dialog, dan navigasi. Override gelap hanya berlaku pada layar, bukan cetak. Kontrol mendukung ID/EN/ZH dan keyboard.
