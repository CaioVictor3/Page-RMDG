const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'O nome de usuário é obrigatório'],
        unique: true,
        trim: true,
        minlength: [3, 'O nome de usuário deve ter pelo menos 3 caracteres'],
        maxlength: [30, 'O nome de usuário não pode ter mais de 30 caracteres']
    },
    email: {
        type: String,
        required: [true, 'O email é obrigatório'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Por favor, insira um email válido']
    },
    password: {
        type: String,
        required: [true, 'A senha é obrigatória'],
        minlength: [6, 'A senha deve ter pelo menos 6 caracteres'],
        select: false // Não retorna a senha por padrão nas queries
    },
    role: {
        type: String,
        enum: ['admin', 'editor'],
        default: 'editor'
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Hash da senha antes de salvar
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Método para comparar senhas
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);

