# RDMG Engenharia – Landing Page

Landing page institucional da RDMG – Gestão, Engenharia e Assessoria.

## Visão geral
- **Stack**: Bootstrap 5, Tailwind (CDN), Font Awesome (CDN)
- **Arquivos principais**: `index.html`, `style.css`, `script.js`
- **Hospedagem**: Qualquer serviço de hospedagem estática (GitHub Pages, Netlify, Vercel, S3, etc.)

## Como executar localmente
1. Baixe/clique duplo em `index.html` para abrir no navegador.
2. Ou sirva a pasta com um servidor estático (recomendado para testar rotas/scroll suave):
   - Node (http-server): `npx http-server . -p 8080`

## Estrutura do projeto
- `index.html`: marcação HTML da página (header, seções, footer)
- `style.css`: estilos customizados (animações de scroll, responsividade, tabs)
- `script.js`: comportamento (scroll suave, destaque do menu, animações com IntersectionObserver)
- `assets/`: imagens e ícones (ex.: `logo.jpeg`)

## Personalização rápida
- **Logo**: troque `assets/logo.jpeg` e ajuste `height`/`max-height` em `style.css` se necessário.
- **Cores**: altere variáveis em `:root` no `style.css` (ex.: `--primary-color`).
- **Títulos/textos**: edite diretamente no `index.html`.
- **Ícones**: use classes do Font Awesome no `index.html`.
- **Links**: seção de contato já contém links para email, telefone e Google Maps.

## Responsividade e UX
- Header otimizado para toque em mobile; ícones aumentam gradualmente < 990px e não reduzem < 576px.
- A barrinha sob os ícones foi removida por preferência visual.
- Seção “Soluções Técnicas…”: tabs responsivas em duas colunas (sem rolagem horizontal), mantendo leitura confortável em todas as larguras.
- Animações de entrada coalescidas com `requestAnimationFrame` para evitar flicker em scroll.

## Acessibilidade
- Ícones acompanhados de texto (ocultado em telas menores quando necessário).
- Links possuem estados de foco/hover via Bootstrap e estilos customizados.


