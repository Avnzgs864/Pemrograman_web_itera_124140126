# Mini POS - Kasir & Keranjang Belanja Sederhana

## Identitas
- **Nama Lengkap** : (isi nama lengkap kamu)
- **NIM** : (isi NIM kamu)
- **Kelas Praktikum** : (isi kelas praktikum kamu)

## Deskripsi Aplikasi
Mini POS adalah aplikasi web kasir sederhana untuk kantin atau toko kampus. Kasir dapat memasukkan barang belanjaan, melihat daftar belanja dalam tabel, menghitung total otomatis lengkap dengan diskon, serta menghitung kembalian dari uang yang dibayarkan pembeli.

**Tujuan pembuatan:** mempraktikkan tiga kompetensi dasar pemrograman web, yaitu validasi input form, perhitungan kalkulator otomatis dengan JavaScript, dan manajemen keranjang belanja berbasis `localStorage`.

**Studi kasus:** kasir kantin kampus yang melayani transaksi pembelian barang harian (buku tulis, air mineral, dan sebagainya).

## Panduan Menjalankan
1. Pastikan folder proyek berisi: `index.html`, `style.css`, `script.js`, `README.md`.
2. Buka folder di **VS Code**.
3. Install ekstensi **Live Server** (jika belum ada).
4. Klik kanan `index.html`, lalu pilih **Open with Live Server**.
5. Aplikasi terbuka otomatis di browser (biasanya `http://127.0.0.1:5500`).

## Daftar Fitur
- [v] Validasi nama barang (wajib, minimal 3 karakter)
- [v] Validasi harga satuan (angka, minimal Rp 500)
- [v] Validasi qty (bilangan bulat, minimal 1)
- [v] Pesan error merah di bawah input yang salah dan barang tidak masuk keranjang
- [v] Form otomatis di-reset setelah barang berhasil ditambahkan
- [v] Subtotal otomatis (Harga Satuan × Qty)
- [v] Total belanja otomatis
- [v] Diskon 10% jika total ≥ Rp 50.000, atau dengan kode promo `HEMAT10`
- [v] Tampilan nominal diskon dan total akhir
- [v] Kalkulator uang bayar dan kembalian, dengan peringatan jika uang kurang
- [v] Tabel keranjang (No, Nama Barang, Harga Satuan, Qty, Subtotal, Aksi)
- [v] Tombol Hapus per item dengan perhitungan ulang otomatis
- [v] Penyimpanan persisten dengan `localStorage` (data tidak hilang saat refresh)
- [v] Tombol Transaksi Baru / Reset
- [v] Format Rupiah dan tampilan responsif

## Tangkapan Layar (Screenshot)
Simpan gambar di folder `screenshots/` lalu sesuaikan nama file.

| Tampilan | Gambar |
|---|---|
| Form input utama | ![Form Input](<img width="1920" height="1080" alt="Screenshot 2026-10-10 091511" src="https://github.com/user-attachments/assets/02f2d876-6873-4177-9341-f394041cd4b2" />
) |
| Validasi error muncul | ![Validasi Error](<img width="1920" height="1080" alt="Screenshot 2026-10-10 091454" src="https://github.com/user-attachments/assets/fc02029d-2ebf-4f66-ae17-ef1dbd581472" />
) |
| Hasil kalkulator & tabel keranjang | ![Hasil Perhitungan](<img width="1920" height="1080" alt="Screenshot 2026-10-10 091546" src="https://github.com/user-attachments/assets/a4559271-49cf-40f5-bdda-183838fc283f" />
) |

## Penjelasan Teknis Singkat

### 1. Penanganan Validasi Input
Saat form disubmit, `e.preventDefault()` mencegah reload halaman. Fungsi `validasiForm()` memeriksa setiap input dan memakai `trim()` untuk membuang spasi. Nama diperiksa panjangnya, harga diperiksa `isNaN()` dan nilai minimalnya, qty diperiksa `Number.isInteger()` dan nilai minimalnya. Jika ada yang salah, fungsi `tampilError()` menampilkan pesan merah dan memberi kelas `invalid` pada input. Fungsi mengembalikan `false` sehingga barang tidak ditambahkan.

### 2. Algoritma Kalkulator
- **Subtotal** = `harga × qty` per baris.
- **Total belanja** dihitung dengan `reduce()` yang menjumlahkan semua subtotal.
- **Diskon** 10% diberikan jika total ≥ 50.000 atau kode promo `HEMAT10` valid (tidak ditumpuk).
- **Total akhir** = `total − diskon`.
- **Kembalian** = `uang bayar − total akhir`. Jika uang bayar lebih kecil dari total akhir, tampil pesan "Uang belum mencukupi".

Semua perhitungan dijalankan ulang oleh fungsi `render()` setiap data berubah.

### 3. Mekanisme Serialisasi localStorage
- **Simpan:** array `keranjang` diubah menjadi teks dengan `JSON.stringify()` lalu disimpan lewat `localStorage.setItem()`.
- **Muat:** saat halaman dibuka, `localStorage.getItem()` mengambil teks dan `JSON.parse()` mengubahnya kembali menjadi array.
- **Reset:** `localStorage.removeItem()` menghapus data saat transaksi baru.

Penyimpanan dipanggil setiap kali barang ditambah atau dihapus, sehingga isi keranjang tetap ada setelah halaman di-refresh.
