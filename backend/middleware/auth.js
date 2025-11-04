const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        // Extrai token do header Authorization
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Token de autenticação não fornecido'
            });
        }
        
        // Verifica token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'rdmg_secret_key');
        
        // Busca usuário
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Usuário não encontrado'
            });
        }
        
        if (!user.active) {
            return res.status(401).json({
                success: false,
                error: 'Usuário desativado'
            });
        }
        
        // Adiciona usuário ao request
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                error: 'Token inválido'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                error: 'Token expirado'
            });
        }
        
        res.status(500).json({
            success: false,
            error: 'Erro ao verificar autenticação'
        });
    }
};

module.exports = auth;

