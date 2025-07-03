const mongoose_guru = require('mongoose');
const bcrypt = require('bcryptjs');

const GuruSchema = new mongoose_guru.Schema({
    nama_lengkap: {
        type: String,
        required: [true, 'Nama lengkap wajib diisi'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email wajib diisi'],
        unique: true, // Setiap guru harus punya email yang berbeda
        match: [/.+\@.+\..+/, 'Silakan masukkan email yang valid']
    },
    password: {
        type: String,
        required: [true, 'Password wajib diisi'],
        minlength: 8
    },
    // Kita bisa menambahkan field lain di sini nanti, misal: mata pelajaran yang diajar
}, { timestamps: true }); // Otomatis menambah field createdAt dan updatedAt

// Hash password sebelum disimpan ke database
GuruSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose_guru.model('Guru', GuruSchema);