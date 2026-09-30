document.addEventListener('DOMContentLoaded', () => {

    const hamburger = document.querySelector('.hamburger') || document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu') || document.querySelector('.nav-links');
    const tabLinks = document.querySelectorAll('[data-tab]');
    const tabContents = document.querySelectorAll('.tab-content');

    // ===== Mobile Hamburger Toggle =====
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            const isActive = hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isActive);
        });

        // Close menu when clicking any link inside mobile menu
        const mobileLinks = navMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ===== Tab Switching System =====
    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const targetTabId = link.getAttribute('data-tab');
            if (!targetTabId) return;

            // Highlight active link
            document.querySelectorAll('.nav-menu a, .logo-brand').forEach(nav => {
                if (nav.getAttribute('data-tab') === targetTabId) {
                    nav.classList.add('active');
                } else {
                    nav.classList.remove('active');
                }
            });

            // Display active tab content
            tabContents.forEach(tab => {
                if (tab.id === targetTabId) {
                    tab.classList.add('active');
                } else {
                    tab.classList.remove('active');
                }
            });

            // Close mobile drawer if open
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (hamburger) {
                    hamburger.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                }
            }

            // Smooth scroll back to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // ===== Hero Slider =====
    const heroSlides = document.querySelectorAll('.hero-slide, .slide, .carousel-item');

    if (heroSlides.length > 0) {
        let heroIndex = 0;

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

    // ===== Work Slider =====
    const slides = document.querySelectorAll('.work-slide');
    const prevBtn = document.getElementById('workPrevBtn');
    const nextBtn = document.getElementById('workNextBtn');

    if (slides.length > 0) {
        let currentIndex = 0;

        function goToSlide(index) {
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

        // Manual controls (if buttons exist)
        if (nextBtn && prevBtn) {
            nextBtn.addEventListener('click', () => {
                goToSlide(currentIndex + 1);
            });

            prevBtn.addEventListener('click', () => {
                goToSlide(currentIndex - 1);
            });
        }

        // Automatic change every 5 seconds
        setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 5000);
    }

    // ===== FAQ =====
    const faqItems = document.querySelectorAll('.faq-item');

    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const questionBtn = item.querySelector('.faq-question');

            if (questionBtn) {
                questionBtn.addEventListener('click', () => {
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                        }
                    });
                    item.classList.toggle('active');
                });
            }
        });
    }

    // ===== Consultation Form =====
    const consultationForm = document.getElementById('consultation-form');
    const notificationModal = document.getElementById('notification-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');

    if (consultationForm && notificationModal) {
        consultationForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(consultationForm);

            try {
                await fetch("/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: new URLSearchParams(formData).toString()
                });

                notificationModal.classList.add('active');
                consultationForm.reset();

            } catch (error) {
                console.error("Form submission error:", error);
                alert("There was a problem submitting your request. Please try again.");
            }
        });

        // Close the "thank you" popup
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                notificationModal.classList.remove('active');
            });
        }
    }   // <-- this closing bracket was missing before

    // ===== Value Items =====
    const valueItems = document.querySelectorAll('.value-item');

    if (valueItems.length > 0) {
        valueItems.forEach(item => {
            const toggleBtn = item.querySelector('.value-toggle-btn');

            if (toggleBtn) {
                toggleBtn.addEventListener('click', () => {
                    // Close other open values when opening a new one
                    valueItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                        }
                    });

                    // Open or close the clicked one
                    item.classList.toggle('active');
                });
            }
        });
    }

    // ===== Accessibility Menu =====
    const a11yToggleBtn = document.getElementById('a11y-toggle-bt');
    const a11yMenu = document.getElementById('a11y-men');
    const fontSizeBtn = document.getElementById('font-size-bt');
    const contrastBtn = document.getElementById('contrast-bt');

    if (a11yToggleBtn && a11yMenu) {
        a11yToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            a11yMenu.classList.toggle('hidden');
        });

        a11yMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        document.addEventListener('click', () => {
            if (!a11yMenu.classList.contains('hidden')) {
                a11yMenu.classList.add('hidden');
            }
        });

        // Load saved settings
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
                localStorage.setItem('a11y-large-text', document.body.classList.contains('large-text'));
            });
        }

        if (contrastBtn) {
            contrastBtn.addEventListener('click', (e) => {
                e.preventDefault();
                document.body.classList.toggle('high-contrast');
                localStorage.setItem('a11y-high-contrast', document.body.classList.contains('high-contrast'));
            });
        }
    }

});