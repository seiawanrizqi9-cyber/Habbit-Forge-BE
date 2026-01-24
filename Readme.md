5. PERFORMANCE ISSUE - STREAK CALCULATION

N+1 query problem: setiap hari buat query baru ke database

Sangat tidak efisien untuk streak panjang

⚠️ MASALAH MENENGAH (MEDIUM PRIORITY)
6. VALIDASI HABIT CREATE KURANG

Bisa set lastCheckIn manual (seharusnya otomatis)

Tidak validasi: startDate tidak boleh lebih tua dari hari ini

Tidak ada batasan untuk tanggal di masa depan

7. SOFT DELETE TIDAK KONSISTEN

CheckIn repository: softDelete update dengan data kosong

Tidak ada field deletedAt di schema untuk soft delete

Query lain tidak mengecualikan data yang di-soft-delete

8. PAGINATION TANPA BATASAN

Tidak ada MAX_LIMIT untuk pagination

Bisa request limit: 1000000 → berat untuk server

9. ABSENSI VALIDASI INPUT

Beberapa endpoint tidak punya validation middleware

User input tidak selalu divalidasi dengan benar

10. TIPE RESPONSE TIDAK KONSISTEN

Beberapa endpoint return data langsung, beberapa dengan wrapper

Error message format tidak seragam

🔧 MASALAH MINOR (LOW PRIORITY)
11. TIDAK ADA TRANSACTION

Operasi multi-step (create check-in + update streak) tidak atomic

Potensi data inconsistency jika salah satu step gagal

12. TIDAK ADA CACHING

Data dashboard dihitung ulang setiap request

Streak calculation selalu hit database

13. LOGGING TERBATAS

Hanya error logging dasar

Tidak ada request logging, audit trail

14. TIDAK ADA RATE LIMITING

Bisa spam check-in endpoint

Tidak ada proteksi DDoS basic

15. ABSENSI HEALTH CHECK

Tidak ada endpoint untuk monitor server health

Sulit tahu kapan service down