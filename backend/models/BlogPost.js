const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'O título é obrigatório'],
        trim: true,
        maxlength: [200, 'O título não pode ter mais de 200 caracteres']
    },
    description: {
        type: String,
        required: [true, 'A descrição é obrigatória'],
        trim: true,
        maxlength: [500, 'A descrição não pode ter mais de 500 caracteres']
    },
    content: {
        type: String,
        required: [true, 'O conteúdo é obrigatório'],
        trim: true
    },
    image: {
        type: String,
        default: ''
    },
    imageType: {
        type: String,
        enum: ['url', 'base64'],
        default: 'url'
    },
    author: {
        type: String,
        default: 'RDMG Engenharia'
    },
    published: {
        type: Boolean,
        default: true
    },
    views: {
        type: Number,
        default: 0
    },
    tags: [{
        type: String,
        trim: true
    }]
}, {
    timestamps: true // Cria createdAt e updatedAt automaticamente
});

// Índices para melhorar performance de busca
blogPostSchema.index({ title: 'text', description: 'text', content: 'text' });
blogPostSchema.index({ published: 1, createdAt: -1 });

// Método para incrementar views
blogPostSchema.methods.incrementViews = function() {
    this.views += 1;
    return this.save();
};

module.exports = mongoose.models.BlogPost || mongoose.model('BlogPost', blogPostSchema);

