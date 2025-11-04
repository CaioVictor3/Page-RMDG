// Blog Public JavaScript

let allPosts = [];
let currentPost = null;

// Função para carregar e exibir notícias
function loadBlogPosts(postsToShow = null) {
    const postsContainer = document.getElementById('blog-cards-container');
    const noPostsMessage = document.getElementById('no-posts-message');
    const noSearchResults = document.getElementById('no-search-results');
    
    // Carregar notícias do localStorage
    const posts = postsToShow || JSON.parse(localStorage.getItem('blogPosts') || '[]');
    allPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    
    // Ordenar por data (mais recente primeiro)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (allPosts.length === 0) {
        postsContainer.style.display = 'none';
        noPostsMessage.style.display = 'block';
        noSearchResults.style.display = 'none';
        return;
    }
    
    if (posts.length === 0) {
        postsContainer.style.display = 'none';
        noPostsMessage.style.display = 'none';
        noSearchResults.style.display = 'block';
        return;
    }
    
    postsContainer.style.display = 'flex';
    noPostsMessage.style.display = 'none';
    noSearchResults.style.display = 'none';
    postsContainer.innerHTML = '';
    
    // Criar cards para cada notícia
    posts.forEach((post, index) => {
        const card = createBlogCard(post, index);
        postsContainer.appendChild(card);
    });
    
    // Animar cards
    setTimeout(() => {
        document.querySelectorAll('.blog-card').forEach(card => {
            card.classList.add('visible');
        });
    }, 100);
}

// Função para criar um card de notícia
function createBlogCard(post, index) {
    const col = document.createElement('div');
    col.className = 'col-lg-4 col-md-6';
    
    const card = document.createElement('div');
    card.className = 'blog-card';
    card.setAttribute('data-slide-in', index % 2 === 0 ? 'left' : 'right');
    
    // Imagem
    const imageDiv = document.createElement('div');
    imageDiv.className = 'blog-card-image';
    if (post.image) {
        const img = document.createElement('img');
        img.src = post.image;
        img.alt = post.title;
        img.onerror = function() {
            this.style.display = 'none';
            imageDiv.innerHTML = '<i class="fas fa-newspaper"></i>';
        };
        imageDiv.appendChild(img);
    } else {
        imageDiv.innerHTML = '<i class="fas fa-newspaper"></i>';
    }
    
    // Body
    const body = document.createElement('div');
    body.className = 'blog-card-body';
    
    const title = document.createElement('h3');
    title.className = 'blog-card-title';
    title.textContent = post.title;
    
    const description = document.createElement('p');
    description.className = 'blog-card-description';
    description.textContent = post.description;
    
    body.appendChild(title);
    body.appendChild(description);
    
    // Footer
    const footer = document.createElement('div');
    footer.className = 'blog-card-footer';
    
    const date = document.createElement('span');
    date.className = 'blog-card-date';
    date.innerHTML = `<i class="fas fa-calendar-alt me-1"></i>${formatDate(post.date)}`;
    
    const readMore = document.createElement('a');
    readMore.className = 'blog-card-read-more';
    readMore.href = '#';
    readMore.innerHTML = 'Ler mais <i class="fas fa-arrow-right ms-1"></i>';
    readMore.onclick = (e) => {
        e.preventDefault();
        showNewsModal(post);
    };
    
    footer.appendChild(date);
    footer.appendChild(readMore);
    
    // Montar card
    card.appendChild(imageDiv);
    card.appendChild(body);
    card.appendChild(footer);
    
    // Adicionar evento de clique no card inteiro
    card.addEventListener('click', (e) => {
        if (e.target.tagName !== 'A') {
            showNewsModal(post);
        }
    });
    
    col.appendChild(card);
    
    return col;
}

// Função para formatar data
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        timeZone: 'America/Sao_Paulo'
    };
    return date.toLocaleDateString('pt-BR', options);
}

// Função para exibir notícia completa no modal
function showNewsModal(post) {
    currentPost = post;
    const modal = new bootstrap.Modal(document.getElementById('newsModal'));
    const modalTitle = document.getElementById('newsModalLabel');
    const modalImage = document.getElementById('modal-image');
    const modalTitleContent = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalContent = document.getElementById('modal-content');
    
    modalTitle.textContent = post.title;
    modalTitleContent.textContent = post.title;
    modalDescription.textContent = post.description;
    modalContent.textContent = post.content;
    
    if (post.image) {
        modalImage.src = post.image;
        modalImage.alt = post.title;
        modalImage.style.display = 'block';
        modalImage.onerror = function() {
            this.style.display = 'none';
        };
    } else {
        modalImage.style.display = 'none';
    }
    
    modal.show();
}

// Função para pesquisar notícias
function searchPosts(searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
        loadBlogPosts();
        return;
    }
    
    const term = searchTerm.toLowerCase().trim();
    const filteredPosts = allPosts.filter(post => {
        const title = post.title.toLowerCase();
        const description = post.description.toLowerCase();
        const content = post.content.toLowerCase();
        return title.includes(term) || description.includes(term) || content.includes(term);
    });
    
    loadBlogPosts(filteredPosts);
}

// Função para compartilhar notícia
function shareNews(platform) {
    if (!currentPost) return;
    
    const title = encodeURIComponent(currentPost.title);
    const description = encodeURIComponent(currentPost.description);
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`${currentPost.title}\n\n${currentPost.description}`);
    
    let shareUrl = '';
    
    switch(platform) {
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${text} ${url}`;
            window.open(shareUrl, '_blank');
            break;
            
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            window.open(shareUrl, '_blank', 'width=600,height=400');
            break;
            
        case 'instagram':
            // Instagram não permite compartilhamento direto via URL
            // Copiar para área de transferência
            const instagramText = `${currentPost.title}\n\n${currentPost.description}\n\n${window.location.href}`;
            if (navigator.clipboard) {
                navigator.clipboard.writeText(instagramText).then(() => {
                    alert('Texto copiado! Cole no Instagram.');
                });
            } else {
                // Fallback para navegadores mais antigos
                const textArea = document.createElement('textarea');
                textArea.value = instagramText;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                alert('Texto copiado! Cole no Instagram.');
            }
            break;
            
        case 'email':
            const subject = encodeURIComponent(currentPost.title);
            const body = encodeURIComponent(`${currentPost.description}\n\n${currentPost.content}\n\nFonte: ${window.location.href}`);
            shareUrl = `mailto:?subject=${subject}&body=${body}`;
            window.location.href = shareUrl;
            break;
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    loadBlogPosts();
    
    // Campo de pesquisa
    const searchInput = document.getElementById('blog-search');
    const clearSearchBtn = document.getElementById('clear-search');
    
    if (searchInput) {
        // Pesquisa em tempo real
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value;
            if (searchTerm.length > 0) {
                clearSearchBtn.style.display = 'block';
            } else {
                clearSearchBtn.style.display = 'none';
            }
            searchPosts(searchTerm);
        });
        
        // Limpar pesquisa
        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', function() {
                searchInput.value = '';
                clearSearchBtn.style.display = 'none';
                loadBlogPosts();
            });
        }
    }
    
    // Inicializar botões de compartilhamento usando event delegation
    // Isso garante que os botões funcionem mesmo quando o modal é recriado
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-share')) {
            const btn = e.target.closest('.btn-share');
            const platform = btn.getAttribute('data-platform');
            if (platform && currentPost) {
                shareNews(platform);
            }
        }
    });
    
    // Animar cards quando entrarem no viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    setTimeout(() => {
        document.querySelectorAll('.blog-card').forEach(card => {
            observer.observe(card);
        });
    }, 100);
});

