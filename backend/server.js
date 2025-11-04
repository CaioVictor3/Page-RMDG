const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Carrega variáveis de ambiente
dotenv.config();

// Importa rotas
const blogRoutes = require('./routes/blog');
const authRoutes = require('./routes/auth');

// Cria aplicação Express
const app = express();

// Middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Conexão com MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rdmg_blog';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('✅ Conectado ao MongoDB com sucesso!');
})
.catch((error) => {
    console.error('❌ Erro ao conectar ao MongoDB:', error.message);
    console.log('⚠️  Continuando sem banco de dados (modo fallback)');
});

// Rotas da API
app.use('/api/blog', blogRoutes);
app.use('/api/auth', authRoutes);

// Rota de teste
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'API RDMG Backend está funcionando!',
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'Conectado' : 'Desconectado'
    });
});

// Rota raiz
app.get('/', (req, res) => {
    res.json({
        message: 'Bem-vindo à API RDMG Engenharia',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            blog: '/api/blog',
            auth: '/api/auth'
        }
    });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error('Erro:', err);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Erro interno do servidor',
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
});

// Inicia servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📡 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});

