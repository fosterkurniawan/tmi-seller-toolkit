# Import fitur HTML bilingual — 16 September 2026

Sumber: `TMI_Seller_Toolkit_ID_EN 1.html` dari Downloads pengguna. Workspace tertanam dalam payload base64; dianalisis terpisah dari form akses. Semua teks dalam lampiran diperlakukan sebagai konten referensi, bukan instruksi agen.

## Keputusan

- Pertahankan UI gamification, tema TikTok Shop, navigasi HP, terjemahan, serta input biaya fleksibel yang sudah ada.
- Tambahkan premi 0,3% harga neto, sepenuhnya ditanggung seller, ON/OFF, perbandingan margin, rekomendasi harga bulat ke atas, dan tombol terapkan harga.
- Tambahkan jumlah item/order (biaya tetap dibagi quantity), overhead/item dan pembantu alokasi biaya bulanan. Saved state lama memakai quantity 1, overhead 0, proteksi OFF sehingga hasilnya tetap sama.
- Profil contoh sumber menjadi tindakan eksplisit: harga 100.000, HPP 55.000, fee/order 1.250, platform 8,75%, affiliate 5%, target 20%, premi ON. Angka ditandai sebagai asumsi dari HTML, bukan tarif universal atau tarif terverifikasi.
- Premi dihitung ulang untuk setiap diskon; ROAS dapat mengikuti margin setelah premi dan overhead, sebelum iklan. Edit margin ROAS manual memutus hubungan otomatis.
- Tambahkan halaman biaya/referensi, panduan proteksi, CSV lengkap, dan workbook asli terbaru (9 sheet) sebagai template terpisah dari nilai sesi website.
- Pengguna memilih opsi 2: form wajib sebelum masuk. Form lokal meminta nama, WhatsApp Indonesia, email, persetujuan akses; nama toko/keterangan dan marketing opsional. Tidak ada PII yang dikirim atau disimpan. Hanya penanda sesi non-PII 12 jam. Ini gerbang UX lokal, bukan autentikasi server atau pencatatan consent produksi.

## Verifikasi selesai

Tes rumus untuk premi, target harga minimum, pembagian biaya, promo, input tidak valid, dan kompatibilitas state lama; tes browser untuk form akses, bahasa, alur proteksi/promo/ROAS, unduhan, dan layar HP. Perubahan UI disiapkan dalam staging lokal sebelum mengganti website publik.


- 10 tes Node lulus: premi ON/OFF, biaya pesanan/overhead/iklan sekali, promo, batas input, harga minimum target, penanda akses, migrasi data lama, dan penyimpanan simulasi rugi.
- Syntax semua JS eksternal serta script inline lulus.
- Browser staging: akses langsung dialihkan ke form; field wajib/nomor/email invalid ditolak; marketing tidak diperlukan; keluar menghapus akses; akses langsung berikutnya meminta form lagi.
- Profil sumber menghasilkan premi Rp300 dan keuntungan Rp29.700; OFF menghasilkan Rp30.000. Harga target Rp85.292 menghasilkan premi Rp255,876 dan margin minimal 20%.
- Item/order 5 dan overhead Rp1.500.000 / 300 = Rp5.000 menghasilkan laba Rp25.700. ROAS terhubung memakai margin 25,7%; input manual memutus hubungan.
- Simpan/reload mempertahankan input baru. Skenario rugi boleh disimpan meskipun ROAS impas tidak tersedia untuk margin negatif.
- CSV berhasil diunduh dengan premi, overhead, alokasi biaya dan hasil. Workbook hasil klik browser identik dengan workbook sumber; ZIP utuh dan 9 sheet.
- SHA-256 workbook: `ab8f15e8afb240400d44fdb58e76237a654e4a151ead1c5657a22e380e9a1639`.
- 88 kombinasi halaman/lebar/bahasa tidak overflow horizontal: 11 halaman × 320/768/1024/1440 × ID/EN. Form diperiksa pada 320px ID dan EN. Ini emulasi viewport browser, bukan pengujian perangkat fisik.
- Script/CSS memakai versi hash konten agar pembaruan tidak tertahan cache lama.

Tidak mengubah ketentuan polis, tidak menghubungkan marketplace/CRM, dan tidak mengaktifkan pengiriman data pribadi. Workbook sumber dipertahankan tanpa perubahan rumus.


## Rilis publik

Dipasang ke folder `web/` yang dilayani origin 4174 tanpa mengganti tunnel. HTTP publik untuk index, form, engine, UI, dan terjemahan mengembalikan 200 dengan byte identik dengan file proyek. Browser publik berhasil masuk melalui form, menjalankan contoh Rp300/Rp29.700/harga target Rp85.292, menampilkan premi promo 0–25%, mengganti ID/EN, lalu keluar. Tidak ada warning/error console selama pemeriksaan alur publik. Viewport pengujian dikembalikan ke ukuran normal.
