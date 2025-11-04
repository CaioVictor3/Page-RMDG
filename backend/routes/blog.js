const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

// GET /api/blog - Lista todas as notícias (públicas ou todas se autenticado)
router.get('/', async (req, res) => {
    try {
        const { search, limit, skip } = req.query;
        const isAuthenticated = req.user; // Se tiver middleware auth
        
        const query = {};
        
        // Se não estiver autenticado, mostrar apenas publicadas
        if (!isAuthenticated) {
            query.published = true;
        }
        
        // Busca por texto
        if (search) {
            query.$text = { $search: search };
        }
        
        const limitNum = parseInt(limit) || 10;
        const skipNum = parseInt(skip) || 0;
        
        const posts = await BlogPost.find(query)
            .sort({ createdAt: -1 })
            .limit(limitNum)
            .skip(skipNum)
            .select('-__v');
        
        const total = await BlogPost.countDocuments(query);
        
        res.json({
            success: true,
            data: posts,
            pagination: {
                total,
                limit: limitNum,
                skip: skipNum,
                pages: Math.ceil(total / limitNum)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// GET /api/blog/:id - Busca uma notícia por ID
router.get('/:id', async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({
                success: false,
                error: 'Notícia não encontrada'
            });
        }
        
        // Incrementa views
        await post.incrementViews();
        
        res.json({
            success: true,
            data: post
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// POST /api/blog - Cria uma nova notícia (requer autenticação)
router.post('/',
    auth,
    [
        body('title').trim().notEmpty().withMessage('O título é obrigatório'),
        body('description').trim().notEmpty().withMessage('A descrição é obrigatória'),
        body('content').trim().notEmpty().withMessage('O conteúdo é obrigatório')
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }
            
            const post = new BlogPost(req.body);
            await post.save();
            
            res.status(201).json({
                success: true,
                data: post
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
);

// PUT /api/blog/:id - Atualiza uma notícia (requer autenticação)
router.put('/:id',
    auth,
    [
        body('title').optional().trim().notEmpty(),
        body('description').optional().trim().notEmpty(),
        body('content').optional().trim().notEmpty()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }
            
            const post = await BlogPost.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );
            
            if (!post) {
                return res.status(404).json({
                    success: false,
                    error: 'Notícia não encontrada'
                });
            }
            
            res.json({
                success: true,
                data: post
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
);

// DELETE /api/blog/:id - Deleta uma notícia (requer autenticação)
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await BlogPost.findByIdAndDelete(req.params.id);
        
        if (!post) {
            return res.status(404).json({
                success: false,
                error: 'Notícia não encontrada'
            });
        }
        
        res.json({
            success: true,
            message: 'Notícia deletada com sucesso'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;

