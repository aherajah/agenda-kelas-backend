const express_routes = require('express');
const router = express_routes.Router();
const Guru = require('../models/Guru');

// @route   GET /api/guru
// @desc    Mengambil semua data guru
// @access  Public
router.get('/', async (req, res) => {
    try {
        const guru = await Guru.find().select('-password'); // Ambil semua data kecuali password
        res.json(guru);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/guru
// @desc    Menambah guru baru
// @access  Public (Nantinya bisa diubah jadi Private untuk Admin)
router.post('/', async (req, res) => {
    const { nama_lengkap, email, password } = req.body;

    try {
        // Cek apakah email sudah terdaftar
        let guru = await Guru.findOne({ email });
        if (guru) {
            return res.status(400).json({ msg: 'Guru dengan email ini sudah ada' });
        }

        // Buat instance guru baru
        guru = new Guru({
            nama_lengkap,
            email,
            password
        });

        // Simpan ke database (password akan di-hash oleh pre-save hook di model)
        await guru.save();
        
        // Kirim kembali data guru tanpa password
        const guruData = guru.toObject();
        delete guruData.password;

        res.status(201).json(guruData);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/guru/:id
// @desc    Mengubah data guru berdasarkan ID
// @access  Public
router.put('/:id', async (req, res) => {
    const { nama_lengkap, email } = req.body;
    
    // Buat objek field yang akan diupdate
    const guruFields = {};
    if (nama_lengkap) guruFields.nama_lengkap = nama_lengkap;
    if (email) guruFields.email = email;

    try {
        let guru = await Guru.findById(req.params.id);

        if (!guru) return res.status(404).json({ msg: 'Guru tidak ditemukan' });

        guru = await Guru.findByIdAndUpdate(
            req.params.id,
            { $set: guruFields },
            { new: true } // Mengembalikan dokumen yang sudah diupdate
        ).select('-password');

        res.json(guru);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   DELETE /api/guru/:id
// @desc    Menghapus guru berdasarkan ID
// @access  Public
router.delete('/:id', async (req, res) => {
    try {
        let guru = await Guru.findById(req.params.id);

        if (!guru) return res.status(404).json({ msg: 'Guru tidak ditemukan' });

        await Guru.findByIdAndRemove(req.params.id);

        res.json({ msg: 'Guru berhasil dihapus' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
