# RDMG Engenharia – Site Institucional

Site institucional completo da RDMG – Gestão, Engenharia e Assessoria, incluindo landing page, blog e sistema administrativo.

## 📋 Visão Geral

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Frameworks**: Bootstrap 5, Tailwind CSS (CDN), Font Awesome
- **Backend**: Node.js + Express.js + MongoDB
- **Estrutura**: Organizada em módulos (home, blog, admin, backend)

## 🗂️ Estrutura do Projeto

```
Page-RMDG/
├── assets/              # Recursos estáticos (logo, imagens)
│   └── logo.jpeg
├── home/                 # Página inicial do site
│   ├── index.html
│   ├── style.css
│   └── script.js
├── blog/                 # Blog público
│   ├── index.html
│   ├── blog.css
│   └── blog.js
├── admin/                # Painel administrativo
│   ├── admin.html
│   ├── admin.css
│   └── admin.js
└── backend/              # API REST Node.js
    ├── config/           # Configurações (banco de dados)
    ├── middleware/       # Middlewares (autenticação)
    ├── models/           # Modelos Mongoose (BlogPost, User)
    ├── routes/           # Rotas da API (blog, auth)
    ├── uploads/          # Arquivos enviados
    ├── server.js         # Servidor principal
    ├── package.json      # Dependências Node.js
    └── README.md         # Documentação do backend
```

## 🚀 Como Executar

### Frontend (Página Inicial)

1. **Opção 1 - Abrir diretamente:**
   - Abra `home/index.html` no navegador

2. **Opção 2 - Servidor local (recomendado):**
   ```bash
   # Com Node.js (http-server)
   npx http-server . -p 8080
   
   # Ou com Python
   python -m http.server 8080
   ```
   - Acesse: `http://localhost:8080/home/index.html`

### Blog

- Acesse: `blog/index.html` (público)
- Link também disponível no menu do site

### Admin

- Acesse: `admin/admin.html` (requer autenticação futura via backend)

### Backend

1. **Instale as dependências:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure as variáveis de ambiente:**
   ```bash
   # Copie o arquivo de exemplo e edite
   # Configure MONGODB_URI, JWT_SECRET, etc.
   ```

3. **Inicie o servidor:**
   ```bash
   # Modo desenvolvimento
   npm run dev
   
   # Modo produção
   npm start
   ```

   - API estará disponível em: `http://localhost:3000`
   - Health check: `http://localhost:3000/api/health`

## 📱 Funcionalidades

### Página Inicial (`home/`)
- Hero section com animações
- Seções: Nossa Atuação, Serviços, Público-Alvo
- Formulário de contato
- Animações de scroll suaves
- Design responsivo e moderno

### Blog (`blog/`)
- Visualização pública de notícias
- Busca de notícias
- Modal para leitura completa
- Compartilhamento (WhatsApp, Instagram, Facebook, Email)
- Design responsivo

### Admin (`admin/`)
- CRUD completo de notícias
- Upload de imagens (PNG/JPEG) ou URL
- Preview em tempo real
- Busca de notícias
- Interface compacta e otimizada

### Backend (`backend/`)
- API REST para blog
- Autenticação JWT
- Integração com MongoDB
- Upload de arquivos
- Validação de dados

## 🎨 Personalização

### Cores e Estilos
- Edite variáveis CSS em `home/style.css`:
  ```css
  :root {
      --primary-color: #0d6efd;
      --secondary-color: #6c757d;
      /* ... */
  }
  ```

### Conteúdo
- **Página inicial**: Edite `home/index.html`
- **Logo**: Substitua `assets/logo.jpeg`
- **Textos**: Edite diretamente nos arquivos HTML

### Configuração do Backend
- Veja `backend/README.md` para documentação completa
- Configure variáveis em `backend/.env`

## 🔧 Tecnologias Utilizadas

### Frontend
- HTML5
- CSS3 (Custom Properties, Animations, Grid, Flexbox)
- JavaScript (ES6+, Intersection Observer API)
- Bootstrap 5
- Tailwind CSS (CDN)
- Font Awesome

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- Multer
- express-validator

## 📝 Notas de Desenvolvimento

### Responsividade
- Header otimizado para mobile (ícones aumentam gradualmente < 990px)
- Tabs "Soluções Técnicas" sempre em duas colunas
- Animações otimizadas com `requestAnimationFrame`

### Performance
- Animações coalescidas para evitar flicker
- Intersection Observer para animações de scroll
- Lazy loading de imagens (implementar se necessário)

### Segurança
- Senhas hasheadas (backend)
- Tokens JWT para autenticação
- Validação de dados (frontend e backend)
- CORS configurável

## 📄 Licença

ISC

## 👥 Contato

- **Email**: LUCASF2003S@GMAIL.COM
- **Telefone**: (31) 9659-6783
- **Endereço**: R. São Paulo, 365, PAVMTO/KIT 2 - Centro, Governador Valadares - MG

---

**Desenvolvido para RDMG Engenharia** 🚀
