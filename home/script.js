// Smooth Scrolling for Navigation Links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Skip if it's just "#"
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Highlight active section in navigation (rAF-coalesced)
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const header = document.querySelector('header');
    let ticking = false;

    function onScrollUpdate() {
        // Toggle header shadow class
        if (header) {
            if (window.scrollY > 100) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        }

        // Figure out current section
        let currentSection = '';
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom > 100) {
                currentSection = section.getAttribute('id');
            }
        });

        // Update nav link active state
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentSection}`) link.classList.add('active');
            else link.classList.remove('active');
        });
    }

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                onScrollUpdate();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScrollUpdate(); // Initial call

    // Update current year in footer
    const currentYear = new Date().getFullYear();
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = currentYear;
    }

    // Contact Form Handler
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form values
            const nome = document.getElementById('form-nome').value.trim();
            const empresa = document.getElementById('form-empresa').value.trim();
            const mensagem = document.getElementById('form-mensagem').value.trim();
            
            // Validate form
            if (!nome || !empresa || !mensagem) {
                alert('Por favor, preencha todos os campos do formulário.');
                return;
            }
            
            // Format message
            const mensagemFormatada = 
            `Olá, meu nome é ${nome} da empresa ${empresa}.
            \n${mensagem}`;
            
            // Encode message for URL
            const mensagemCodificada = encodeURIComponent(mensagemFormatada);
            
            // WhatsApp number
            const whatsappNumber = '5531986406791';
            
            // Create WhatsApp URL
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${mensagemCodificada}`;
            
            // Open WhatsApp in new tab
            window.open(whatsappUrl, '_blank');
            
            // Reset form (optional)
            contactForm.reset();
        });
    }
});

// (migrated into rAF-coalesced scroll handler above)

// Scroll Animation with Intersection Observer
document.addEventListener('DOMContentLoaded', function() {
    // Create Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                // Once animated, we can unobserve to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with scroll-animate class
    const animateElements = document.querySelectorAll('.scroll-animate');
    animateElements.forEach(element => {
        observer.observe(element);
    });

    // Animate elements on page load if they're already in viewport
    animateElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom >= 0;
        if (isInViewport) {
            setTimeout(() => {
                element.classList.add('animated');
            }, 100);
        }
    });

    // Animate tab content when tabs are switched
    const tabButtons = document.querySelectorAll('[data-bs-toggle="tab"]');
    tabButtons.forEach(button => {
        button.addEventListener('shown.bs.tab', function (e) {
            const targetId = e.target.getAttribute('data-bs-target');
            const targetPane = document.querySelector(targetId);
            if (targetPane) {
                const cardElement = targetPane.querySelector('.scroll-animate');
                if (cardElement && !cardElement.classList.contains('animated')) {
                    // Reset and animate
                    cardElement.style.opacity = '0';
                    cardElement.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        cardElement.classList.add('animated');
                    }, 50);
                }
            }
        });
    });
});

// Componente Reutilizável: SlideInOnScroll
// Animações laterais fluidas com fade-in e stagger automático
document.addEventListener('DOMContentLoaded', function() {
    
    /**
     * Componente SlideInOnScroll - Animações laterais fluidas
     * @param {Object} options - Configurações opcionais
     */
    function SlideInOnScroll(options) {
        const defaultOptions = {
            selector: '[data-slide-in]',
            containerSelector: '[data-slide-stagger]',
            threshold: 0.15,
            rootMargin: '0px 0px -8% 0px',
            staggerDelay: 100, // ms entre cada elemento
            duration: 700, // ms
            autoDetectAlternate: true // detecta pares/ímpares automaticamente
        };
        const cfg = Object.assign({}, defaultOptions, options || {});

        // Intersection Observer para detectar entrada/saída do viewport
        // Ajustado para funcionar em ambas as direções (cima/baixo)
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Sempre adiciona quando entra no viewport (qualquer direção)
                    entry.target.classList.add('is-visible');
                } else {
                    // Remove quando sai completamente do viewport
                    entry.target.classList.remove('is-visible');
                }
            });
        }, { 
            threshold: cfg.threshold, 
            rootMargin: '0px 0px -5% 0px' // Margem menor para capturar melhor entrada por ambos os lados
        });

        // Aplica stagger automático em containers
        document.querySelectorAll(cfg.containerSelector).forEach(container => {
            const children = Array.from(container.querySelectorAll(cfg.selector));
            children.forEach((el, idx) => {
                el.style.setProperty('--slide-index', idx.toString());
            });
        });

        // Detecta elementos pares/ímpares para alternar left/right
        // IMPORTANTE: Fazer antes de observar elementos
        if (cfg.autoDetectAlternate) {
            document.querySelectorAll('.row').forEach(row => {
                const cards = Array.from(row.querySelectorAll('.card'));
                cards.forEach((card, idx) => {
                    // Sempre aplica, mesmo se já tiver atributo (para garantir consistência)
                    // Pares vêm da esquerda, ímpares da direita
                    card.setAttribute('data-slide-in', idx % 2 === 0 ? 'left' : 'right');
                    card.style.setProperty('--slide-index', idx.toString());
                });
            });
        }

        // Observa todos os elementos desde o início
        // O observer principal gerencia tanto estado inicial quanto scroll contínuo
        const allElements = document.querySelectorAll(cfg.selector);
        
        // Primeiro, verifica estado inicial rapidamente
        allElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            // Verifica se está visível no viewport (com margem de 100px para capturar elementos próximos)
            const isVisible = rect.top < windowHeight + 100 && rect.bottom > -100;
            if (isVisible) {
                el.classList.add('is-visible');
            }
        });
        
        // Depois observa todos continuamente para detectar entrada/saída
        allElements.forEach(el => {
            io.observe(el);
        });

        return { 
            observe: (el) => io.observe(el),
            unobserve: (el) => io.unobserve(el)
        };
    }

    // Auto-aplica data-slide-in em cards e elementos principais
    // IMPORTANTE: Fazer ANTES de inicializar SlideInOnScroll
    const autoTargets = [
        '.card:not([data-slide-in])',
        'section[id] > .container > .row > .col-lg-12 > h2:not([data-slide-in])',
        'section[id] > .container > .row > .col-lg-12 > .display-4:not([data-slide-in])'
    ];
    
    autoTargets.forEach(sel => {
        document.querySelectorAll(sel).forEach((el) => {
            if (!el.hasAttribute('data-slide-in')) {
                // Cards usam auto-detecção, outros usam fade
                if (el.classList.contains('card')) {
                    // Deixa para o autoDetectAlternate processar
                } else {
                    el.setAttribute('data-slide-in', 'fade');
                }
            }
        });
    });

    // Marca rows como containers de stagger
    document.querySelectorAll('.row').forEach(row => {
        if (row.querySelectorAll('.card').length > 0) {
            row.setAttribute('data-slide-stagger', '');
        }
    });

    // Aguarda um frame para garantir que todos os atributos foram aplicados
    requestAnimationFrame(() => {
        // Inicializa o componente após atributos aplicados
        SlideInOnScroll();
    });
});

