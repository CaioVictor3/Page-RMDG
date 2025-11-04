const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

// Gera token JWT
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET || 'rdmg_secret_key', {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
};

// POST /api/auth/register - Registra novo usuário (apenas para desenvolvimento)
router.post('/register',
    [
        body('username').trim().isLength({ min: 3 }).withMessage('O nome de usuário deve ter pelo menos 3 caracteres'),
        body('email').isEmail().withMessage('Email inválido'),
        body('password').isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres')
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
            
            const { username, email, password, role } = req.body;
            
            // Verifica se usuário já existe
            const existingUser = await User.findOne({
                $or: [{ email }, { username }]
            });
            
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    error: 'Usuário ou email já existe'
                });
            }
            
            // Cria novo usuário
            const user = new User({
                username,
                email,
                password,
                role: role || 'editor'
            });
            
            await user.save();
            
            // Gera token
            const token = generateToken(user._id);
            
            res.status(201).json({
                success: true,
                message: 'Usuário criado com sucesso',
                data: {
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        role: user.role
                    },
                    token
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
);

// POST /api/auth/login - Login de usuário
router.post('/login',
    [
        body('email').isEmail().withMessage('Email inválido'),
        body('password').notEmpty().withMessage('A senha é obrigatória')
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
            
            const { email, password } = req.body;
            
            // Busca usuário com senha
            const user = await User.findOne({ email }).select('+password');
            
            if (!user) {
                return res.status(401).json({
                    success: false,
                    error: 'Credenciais inválidas'
                });
            }
            
            if (!user.active) {
                return res.status(401).json({
                    success: false,
                    error: 'Usuário desativado'
                });
            }
            
            // Verifica senha
            const isPasswordValid = await user.comparePassword(password);
            
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    error: 'Credenciais inválidas'
                });
            }
            
            // Gera token
            const token = generateToken(user._id);
            
            res.json({
                success: true,
                message: 'Login realizado com sucesso',
                data: {
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        role: user.role
                    },
                    token
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
);

// GET /api/auth/me - Retorna informações do usuário autenticado
router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Token não fornecido'
            });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'rdmg_secret_key');
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user || !user.active) {
            return res.status(401).json({
                success: false,
                error: 'Usuário não encontrado ou inativo'
            });
        }
        
        res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            }
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            error: 'Token inválido'
        });
    }
});

module.exports = router;

