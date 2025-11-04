# Backend RDMG Engenharia

API REST para gerenciamento do blog e sistema administrativo da RDMG Engenharia.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação via tokens
- **bcryptjs** - Hash de senhas
- **Multer** - Upload de arquivos
- **express-validator** - Validação de dados

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- MongoDB (local ou MongoDB Atlas)
- npm ou yarn

## 🔧 Instalação

1. **Instale as dependências:**
```bash
cd backend
npm install
```

2. **Configure as variáveis de ambiente:**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/rdmg_blog
JWT_SECRET=seu_secret_jwt_aqui
JWT_EXPIRES_IN=7d
```

3. **Inicie o servidor:**
```bash
# Modo desenvolvimento (com nodemon)
npm run dev

# Modo produção
npm start
```

O servidor estará rodando em `http://localhost:3000`

## 📡 Endpoints da API

### Health Check
- `GET /api/health` - Verifica status do servidor e conexão com banco

### Autenticação
- `POST /api/auth/register` - Registra novo usuário
- `POST /api/auth/login` - Login de usuário
- `GET /api/auth/me` - Retorna informações do usuário autenticado

### Blog
- `GET /api/blog` - Lista todas as notícias (públicas)
- `GET /api/blog/:id` - Busca notícia por ID
- `POST /api/blog` - Cria nova notícia (requer autenticação)
- `PUT /api/blog/:id` - Atualiza notícia (requer autenticação)
- `DELETE /api/blog/:id` - Deleta notícia (requer autenticação)

### Parâmetros de Query (GET /api/blog)
- `search` - Busca por texto (título, descrição, conteúdo)
- `limit` - Limite de resultados (padrão: 10)
- `skip` - Paginação (padrão: 0)

## 🔐 Autenticação

As rotas protegidas requerem um token JWT no header:
```
Authorization: Bearer <token>
```

## 📝 Exemplo de Uso

### Criar usuário
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@rdmg.com",
    "password": "senha123",
    "role": "admin"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@rdmg.com",
    "password": "senha123"
  }'
```

### Criar notícia
```bash
curl -X POST http://localhost:3000/api/blog \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Título da Notícia",
    "description": "Descrição breve",
    "content": "Conteúdo completo da notícia",
    "image": "https://exemplo.com/imagem.jpg",
    "published": true
  }'
```

## 🗂️ Estrutura do Projeto

```
backend/
├── config/          # Configurações (banco de dados, etc)
├── middleware/      # Middlewares (auth, etc)
├── models/          # Modelos Mongoose (BlogPost, User)
├── routes/          # Rotas da API (blog, auth)
├── uploads/         # Arquivos enviados
├── server.js        # Arquivo principal
├── package.json     # Dependências
└── .env             # Variáveis de ambiente (não versionado)
```

## 📦 Modelos

### BlogPost
- `title` (String, obrigatório) - Título da notícia
- `description` (String, obrigatório) - Descrição/resumo
- `content` (String, obrigatório) - Conteúdo completo
- `image` (String) - URL ou base64 da imagem
- `imageType` (String) - Tipo: 'url' ou 'base64'
- `author` (String) - Autor da notícia
- `published` (Boolean) - Se está publicada
- `views` (Number) - Contador de visualizações
- `tags` (Array) - Tags da notícia
- `createdAt` (Date) - Data de criação
- `updatedAt` (Date) - Data de atualização

### User
- `username` (String, obrigatório, único) - Nome de usuário
- `email` (String, obrigatório, único) - Email
- `password` (String, obrigatório) - Senha (hash)
- `role` (String) - 'admin' ou 'editor'
- `active` (Boolean) - Se está ativo
- `createdAt` (Date) - Data de criação
- `updatedAt` (Date) - Data de atualização

## 🔒 Segurança

- Senhas são hasheadas com bcrypt
- Tokens JWT para autenticação
- Validação de dados com express-validator
- CORS configurável
- Variáveis sensíveis em `.env`

## 🐛 Troubleshooting

### Erro ao conectar MongoDB
- Verifique se o MongoDB está rodando
- Confira a URI no `.env`
- Para MongoDB Atlas, verifique as configurações de rede

### Erro de autenticação
- Verifique se o token está sendo enviado corretamente
- Confira o `JWT_SECRET` no `.env`
- Verifique se o token não expirou

## 📄 Licença

ISC

