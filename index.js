const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Untuk memuat variabel dari file .env

// Inisialisasi aplikasi Express
const app = express();
const PORT = process.env.PORT || 8080; // Koyeb akan menyediakan PORT secara otomatis

// Middleware
app.use(cors()); // Mengizinkan permintaan dari domain lain (frontend kita)
app.use(express.json()); // Mem-parsing body permintaan sebagai JSON

// Koneksi ke MongoDB Atlas
const MONGO_URI = process.env.MONGO_URI; // Ambil URI dari environment variable

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Berhasil terhubung ke MongoDB Atlas");
}).catch(err => {
    console.error("Error koneksi ke MongoDB:", err);
    process.exit(1); // Keluar jika tidak bisa terhubung ke DB
});

// Rute dasar untuk mengecek apakah server berjalan
app.get('/', (req, res) => {
    res.send('Selamat datang di API Agenda Kelas!');
});

// Menggunakan rute untuk manajemen guru
const guruRoutes = require('./routes/guru');
app.use('/api/guru', guruRoutes);


// Menjalankan server
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});