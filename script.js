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

