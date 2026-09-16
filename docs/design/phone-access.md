# Daftar akses nomor sementara — 16 September 2026

Permintaan: hanya empat nomor yang diberikan pengguna dapat melanjutkan form awal. Nomor dicocokkan persis setelah normalisasi awalan 0/62/+62 dan pemisah spasi/tanda kurung/hubung. Form menampilkan error inline, memfokuskan kolom nomor, dan tidak membuat penanda sesi bila nomor tidak cocok. Pemeriksaan yang sama digunakan saat grant penanda sesi. Marketing tetap opsional.

Penanda v1 tidak berlaku lagi pada kode baru. Penanda v2 menyimpan metadata sesi yang sama tanpa data pribadi. Halaman yang masih memuat kode lama perlu direfresh; ini bukan pencabutan akses pada server.

Batasan: filter klien untuk prototype yang sudah ada, bukan autentikasi atau verifikasi pemilik nomor. Daftar akses dapat diperiksa lewat file JavaScript. Tidak ada OTP, API, atau penyimpanan nomor isian.

Verifikasi: 14 tes Node lulus. Empat nomor × empat format diuji, termasuk nomor pendek dari daftar. Nomor lain, perubahan satu digit, tambahan digit, karakter asing, nilai kosong dan penanda lama ditolak. Browser menunjukkan error ID/EN/ZH untuk nomor tak terdaftar; nomor terdaftar format +62 dengan spasi berhasil membuka home.
