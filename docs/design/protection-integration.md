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

## Verifikasi yang direncanakan

Tes rumus untuk premi, target harga minimum, pembagian biaya, promo, input tidak valid, dan kompatibilitas state lama; tes browser untuk form akses, bahasa, alur proteksi/promo/ROAS, unduhan, dan layar HP. Perubahan UI disiapkan dalam staging lokal sebelum mengganti website publik.
