// Blog Admin JavaScript - CRUD Operations

let currentEditId = null;
let deleteModal = null;

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    loadPosts();
    
    // Form submit handler
    document.getElementById('news-form').addEventListener('submit', handleFormSubmit);
    
    // Cancel button
    document.getElementById('cancel-btn').addEventListener('click', cancelEdit);
    
    // Admin search handler
    const adminSearchInput = document.getElementById('admin-search');
    const adminClearSearchBtn = document.getElementById('admin-clear-search');
    
    if (adminSearchInput) {
        // Pesquisa em tempo real
        adminSearchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value;
            if (searchTerm.length > 0) {
                adminClearSearchBtn.style.display = 'block';
            } else {
                adminClearSearchBtn.style.display = 'none';
            }
            searchAdminPosts(searchTerm);
        });
        
        // Limpar pesquisa
        if (adminClearSearchBtn) {
            adminClearSearchBtn.addEventListener('click', function() {
                adminSearchInput.value = '';
                adminClearSearchBtn.style.display = 'none';
                loadPosts();
            });
        }
    }
    
    // Image upload handler
    const imageFileInput = document.getElementById('news-image-file');
    if (imageFileInput) {
        imageFileInput.addEventListener('change', handleImageUpload);
    }
    
    // URL input handler
    const imageUrlInput = document.getElementById('news-image-url');
    if (imageUrlInput) {
        imageUrlInput.addEventListener('input', function() {
            const url = this.value.trim();
            if (url) {
                document.getElementById('news-image').value = url;
            } else {
                document.getElementById('news-image').value = '';
            }
        });
    }
    
    // Remove image button
    const removeImageBtn = document.getElementById('remove-image');
    if (removeImageBtn) {
        removeImageBtn.addEventListener('click', function() {
            clearImage();
        });
    }
    
    // Tab change handler - limpar apenas o campo da aba não ativa
    const uploadTab = document.getElementById('upload-tab');
    const urlTab = document.getElementById('url-tab');
    if (uploadTab) {
        uploadTab.addEventListener('shown.bs.tab', function() {
            // Limpar apenas o campo de URL quando trocar para upload
            document.getElementById('news-image-url').value = '';
        });
    }
    if (urlTab) {
        urlTab.addEventListener('shown.bs.tab', function() {
            // Limpar apenas o campo de upload quando trocar para URL
            document.getElementById('news-image-file').value = '';
            clearImagePreview();
        });
    }
});

// Função para processar upload de imagem
function handleImageUpload(e) {
    const file = e.target.files[0];
    
    if (!file) {
        clearImagePreview();
        document.getElementById('news-image').value = '';
        return;
    }
    
    // Validar tipo de arquivo
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
        showAlert('Por favor, selecione apenas arquivos PNG ou JPEG.', 'warning');
        e.target.value = '';
        return;
    }
    
    // Validar tamanho (máx 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB em bytes
    if (file.size > maxSize) {
        showAlert('A imagem deve ter no máximo 5MB.', 'warning');
        e.target.value = '';
        return;
    }
    
    // Converter para base64
    const reader = new FileReader();
    reader.onload = function(event) {
        const base64String = event.target.result;
        document.getElementById('news-image').value = base64String;
        showImagePreview(base64String);
    };
    
    reader.onerror = function() {
        showAlert('Erro ao ler o arquivo. Tente novamente.', 'warning');
        e.target.value = '';
    };
    
    reader.readAsDataURL(file);
}

// Função para exibir preview da imagem
function showImagePreview(imageSrc) {
    const previewContainer = document.getElementById('image-preview-container');
    const previewImg = document.getElementById('image-preview');
    
    if (imageSrc) {
        previewImg.src = imageSrc;
        previewContainer.style.display = 'block';
    } else {
        clearImagePreview();
    }
}

// Função para limpar preview da imagem
function clearImagePreview() {
    const previewContainer = document.getElementById('image-preview-container');
    previewContainer.style.display = 'none';
    document.getElementById('image-preview').src = '';
}

// Função para limpar imagem completamente
function clearImage() {
    document.getElementById('news-image-file').value = '';
    document.getElementById('news-image').value = '';
    clearImagePreview();
}

// Função para carregar todas as notícias
function loadPosts(postsToShow = null) {
    const allPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    const posts = postsToShow || allPosts;
    const postsList = document.getElementById('posts-list');
    const noPosts = document.getElementById('no-posts-admin');
    const noSearchResults = document.getElementById('no-search-results-admin');
    
    if (allPosts.length === 0) {
        postsList.innerHTML = '';
        noPosts.style.display = 'block';
        noSearchResults.style.display = 'none';
        return;
    }
    
    if (posts.length === 0) {
        postsList.innerHTML = '';
        noPosts.style.display = 'none';
        noSearchResults.style.display = 'block';
        return;
    }
    
    noPosts.style.display = 'none';
    noSearchResults.style.display = 'none';
    postsList.innerHTML = '';
    
    // Ordenar por data (mais recente primeiro)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    posts.forEach((post, index) => {
        const postItem = createPostItem(post, index);
        postsList.appendChild(postItem);
    });
}

// Função para pesquisar notícias no admin
function searchAdminPosts(searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
        loadPosts();
        return;
    }
    
    const term = searchTerm.toLowerCase().trim();
    const allPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    const filteredPosts = allPosts.filter(post => {
        const title = post.title.toLowerCase();
        const description = post.description.toLowerCase();
        const content = post.content.toLowerCase();
        return title.includes(term) || description.includes(term) || content.includes(term);
    });
    
    loadPosts(filteredPosts);
}

// Função para criar item na lista
function createPostItem(post, index) {
    const div = document.createElement('div');
    div.className = 'post-item';
    div.style.animationDelay = `${index * 0.1}s`;
    
    // Header com título e ações
    const header = document.createElement('div');
    header.className = 'post-item-header';
    
    const title = document.createElement('h5');
    title.className = 'post-item-title';
    title.textContent = post.title;
    
    const actions = document.createElement('div');
    actions.className = 'post-item-actions';
    
    const editBtn = document.createElement('button');
    editBtn.className = 'btn btn-action btn-edit';
    editBtn.innerHTML = '<i class="fas fa-edit me-1"></i>Editar';
    editBtn.onclick = () => editPost(post.id);
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-action btn-delete';
    deleteBtn.innerHTML = '<i class="fas fa-trash me-1"></i>Excluir';
    deleteBtn.onclick = () => confirmDelete(post.id);
    
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    header.appendChild(title);
    header.appendChild(actions);
    
    // Imagem preview
    if (post.image) {
        const imgDiv = document.createElement('div');
        imgDiv.className = 'post-item-image-preview';
        const img = document.createElement('img');
        img.src = post.image;
        img.alt = post.title;
        img.onerror = function() {
            this.style.display = 'none';
            imgDiv.innerHTML = '<i class="fas fa-image"></i>';
        };
        imgDiv.appendChild(img);
        div.appendChild(imgDiv);
    }
    
    // Descrição
    const description = document.createElement('p');
    description.className = 'post-item-description';
    description.textContent = post.description;
    
    // Footer com data
    const footer = document.createElement('div');
    footer.className = 'post-item-footer';
    
    const date = document.createElement('span');
    date.className = 'post-item-date';
    date.innerHTML = `<i class="fas fa-calendar-alt me-1"></i>${formatDate(post.date)}`;
    
    footer.appendChild(date);
    
    // Montar item
    div.appendChild(header);
    div.appendChild(description);
    div.appendChild(footer);
    
    return div;
}

// Função para formatar data
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Sao_Paulo'
    };
    return date.toLocaleDateString('pt-BR', options);
}

// Função para lidar com submit do formulário
function handleFormSubmit(e) {
    e.preventDefault();
    
    const title = document.getElementById('news-title').value.trim();
    const description = document.getElementById('news-description').value.trim();
    const image = document.getElementById('news-image').value.trim();
    const content = document.getElementById('news-content').value.trim();
    
    if (!title || !description || !content) {
        showAlert('Por favor, preencha todos os campos obrigatórios.', 'warning');
        return;
    }
    
    const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    
    if (currentEditId) {
        // Editar notícia existente
        const index = posts.findIndex(p => p.id === currentEditId);
        if (index !== -1) {
            posts[index] = {
                ...posts[index],
                title,
                description,
                image,
                content,
                date: new Date().toISOString() // Atualizar data de modificação
            };
            showAlert('Notícia atualizada com sucesso!', 'success');
        }
    } else {
        // Criar nova notícia
        const newPost = {
            id: Date.now().toString(),
            title,
            description,
            image,
            content,
            date: new Date().toISOString()
        };
        posts.push(newPost);
        showAlert('Notícia cadastrada com sucesso!', 'success');
    }
    
    localStorage.setItem('blogPosts', JSON.stringify(posts));
    resetForm();
    loadPosts();
}

// Função para editar notícia
function editPost(id) {
    const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    const post = posts.find(p => p.id === id);
    
    if (!post) return;
    
    currentEditId = id;
    document.getElementById('edit-id').value = id;
    document.getElementById('news-title').value = post.title;
    document.getElementById('news-description').value = post.description;
    document.getElementById('news-content').value = post.content;
    
    // Detectar se é base64 ou URL
    const image = post.image || '';
    if (image) {
        // Verificar se é base64 (começa com data:image)
        if (image.startsWith('data:image')) {
            // É base64 - mostrar na aba de upload
            const uploadTab = document.getElementById('upload-tab');
            if (uploadTab) {
                const bsTab = new bootstrap.Tab(uploadTab);
                bsTab.show();
            }
            document.getElementById('news-image').value = image;
            showImagePreview(image);
        } else {
            // É URL - mostrar na aba de URL
            const urlTab = document.getElementById('url-tab');
            if (urlTab) {
                const bsTab = new bootstrap.Tab(urlTab);
                bsTab.show();
            }
            document.getElementById('news-image-url').value = image;
            document.getElementById('news-image').value = image;
        }
    } else {
        // Sem imagem - limpar tudo
        clearImage();
        const uploadTab = document.getElementById('upload-tab');
        if (uploadTab) {
            const bsTab = new bootstrap.Tab(uploadTab);
            bsTab.show();
        }
    }
    
    // Atualizar UI
    document.getElementById('form-title').innerHTML = '<i class="fas fa-edit me-2"></i>Editar Notícia';
    document.getElementById('submit-btn').innerHTML = '<i class="fas fa-save me-2"></i>Atualizar Notícia';
    document.getElementById('cancel-btn').style.display = 'block';
    
    // Scroll para o formulário
    document.querySelector('.admin-form-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Função para cancelar edição
function cancelEdit() {
    resetForm();
}

// Função para resetar formulário
function resetForm() {
    currentEditId = null;
    document.getElementById('news-form').reset();
    document.getElementById('edit-id').value = '';
    document.getElementById('news-image').value = '';
    clearImagePreview();
    // Voltar para aba de upload
    const uploadTab = document.getElementById('upload-tab');
    if (uploadTab) {
        const bsTab = new bootstrap.Tab(uploadTab);
        bsTab.show();
    }
    document.getElementById('form-title').innerHTML = '<i class="fas fa-plus-circle me-2"></i>Nova Notícia';
    document.getElementById('submit-btn').innerHTML = '<i class="fas fa-save me-2"></i>Salvar Notícia';
    document.getElementById('cancel-btn').style.display = 'none';
}

// Função para confirmar exclusão
function confirmDelete(id) {
    const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    const post = posts.find(p => p.id === id);
    
    if (!post) return;
    
    // Armazenar ID para exclusão
    document.getElementById('confirm-delete').onclick = function() {
        deletePost(id);
        deleteModal.hide();
    };
    
    deleteModal.show();
}

// Função para excluir notícia
function deletePost(id) {
    const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    const filteredPosts = posts.filter(p => p.id !== id);
    
    localStorage.setItem('blogPosts', JSON.stringify(filteredPosts));
    showAlert('Notícia excluída com sucesso!', 'success');
    loadPosts();
    
    // Se estava editando a notícia excluída, resetar formulário
    if (currentEditId === id) {
        resetForm();
    }
}

// Função para exibir alerta
function showAlert(message, type) {
    // Remover alertas anteriores
    const existingAlert = document.querySelector('.alert-auto-dismiss');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show alert-auto-dismiss position-fixed top-0 start-50 translate-middle-x mt-3`;
    alert.style.zIndex = '9999';
    alert.style.minWidth = '300px';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alert);
    
    // Auto-dismiss após 3 segundos
    setTimeout(() => {
        if (alert.parentNode) {
            alert.classList.remove('show');
            setTimeout(() => alert.remove(), 300);
        }
    }, 3000);
}

