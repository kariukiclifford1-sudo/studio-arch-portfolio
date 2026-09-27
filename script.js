
document.addEventListener('DOMContentLoaded', () => {

    const hamburger = document.querySelector('.hamburger') || document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu') || document.querySelector('.nav-links');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isOpen);
        });

        // Close menu when clicking any navigation link on mobile
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    const heroSlides = document.querySelectorAll('.hero-slide, .slide, .carousel-item');
    
    if (heroSlides.length > 0) {
        let heroIndex = 0;

        // Ensure the first slide is active initially if none are set
        if (!document.querySelector('.hero-slide.active, .slide.active, .carousel-item.active')) {
            heroSlides[0].classList.add('active');
        }

        function showNextHeroSlide() {
            heroSlides[heroIndex].classList.remove('active');
            heroIndex = (heroIndex + 1) % heroSlides.length;
            heroSlides[heroIndex].classList.add('active');
        }

        setInterval(showNextHeroSlide, 5000);
    }


    const slides = document.querySelectorAll('.work-slide');
    const prevBtn = document.getElementById('workPrevBtn');
    const nextBtn = document.getElementById('workNextBtn');

    if (slides.length > 0 && prevBtn && nextBtn) {
        let currentIndex = 0;

        function goToSlide(index) {
            // Handle looping bounds
            if (index >= slides.length) {
                currentIndex = 0;
            } else if (index < 0) {
                currentIndex = slides.length - 1;
            } else {
                currentIndex = index;
            }

            slides.forEach((slide, i) => {
                if (i === currentIndex) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });
        }

        nextBtn.addEventListener('click', () => {
            goToSlide(currentIndex + 1);
        });

        prevBtn.addEventListener('click', () => {
            goToSlide(currentIndex - 1);
        });
    }


    const faqItems = document.querySelectorAll('.faq-item');

    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const questionBtn = item.querySelector('.faq-question');

            if (questionBtn) {
                questionBtn.addEventListener('click', () => {
                    // Optional: Close other open accordion items
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                        }
                    });

                    // Toggle current item
                    item.classList.toggle('active');
                });
            }
        });
    }


    const consultationForm = document.getElementById('consultation-form');
    const notificationModal = document.getElementById('notification-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');

    if (consultationForm && notificationModal) {
        consultationForm.addEventListener('submit', (e) => {
            e.preventDefault(); 

            notificationModal.classList.add('active');

            consultationForm.reset();
        });

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                notificationModal.classList.remove('active');
            });
        }

        notificationModal.addEventListener('click', (e) => {
            if (e.target === notificationModal) {
                notificationModal.classList.remove('active');
            }
        });
    }
    const a11yToggleBtn = document.getElementById('a11y-toggle-btn');
    const a11yMenu = document.getElementById('a11y-menu');
    const fontSizeBtn = document.getElementById('font-size-btn');
    const contrastBtn = document.getElementById('contrast-btn');

    if (a11yToggleBtn && a11yMenu) {
        // Toggle widget menu open/close
        a11yToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            a11yMenu.classList.toggle('hidden');
        });

        // Prevent clicks inside the menu from closing it
        a11yMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Close menu when clicking outside
        document.addEventListener('click', () => {
            if (!a11yMenu.classList.contains('hidden')) {
                a11yMenu.classList.add('hidden');
            }
        });

        if (localStorage.getItem('a11y-large-text') === 'true') {
            document.body.classList.add('large-text');
        }
        if (localStorage.getItem('a11y-high-contrast') === 'true') {
            document.body.classList.add('high-contrast');
        }

        if (fontSizeBtn) {
            fontSizeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                document.body.classList.toggle('large-text');
                const isLarge = document.body.classList.contains('large-text');
                localStorage.setItem('a11y-large-text', isLarge);
            });
        }

        if (contrastBtn) {
            contrastBtn.addEventListener('click', (e) => {
                e.preventDefault();
                document.body.classList.toggle('high-contrast');
                const isContrast = document.body.classList.contains('high-contrast');
                localStorage.setItem('a11y-high-contrast', isContrast);
            });
        }
    }
});
