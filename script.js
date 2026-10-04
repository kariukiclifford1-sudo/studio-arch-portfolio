document.addEventListener('DOMContentLoaded', () => {

    const hamburger = document.querySelector('.hamburger') || document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu') || document.querySelector('.nav-links');
    const tabLinks = document.querySelectorAll('[data-tab]');
    const tabContents = document.querySelectorAll('.tab-content');

    // Keeps aria-expanded in step with the open/closed state (for screen readers)
    function syncExpanded(items, buttonSelector) {
        items.forEach(it => {
            const b = it.querySelector(buttonSelector);
            if (b) b.setAttribute('aria-expanded', it.classList.contains('active'));
        });
    }

    // Mobile Hamburger Toggle 
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
// Tab Switching System 

    const ONE_HOUR = 60 * 60 * 1000; // 1 hour in milliseconds

    // One function that shows a tab
    function showTab(targetTabId) {
        // Highlight the active link
        document.querySelectorAll('.nav-menu a, .logo-brand').forEach(nav => {
            nav.classList.toggle('active', nav.getAttribute('data-tab') === targetTabId);
        });

        // Show the active tab content
        tabContents.forEach(tab => {
            tab.classList.toggle('active', tab.id === targetTabId);
        });
    }

    // When a link is clicked
    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const targetTabId = link.getAttribute('data-tab');
            if (!targetTabId) return;

            showTab(targetTabId);

            // Put the tab in the address bar (mysite.com/#contact) so Back works and links can be shared
            if (window.location.hash !== '#' + targetTabId) {
                try { history.pushState(null, '', '#' + targetTabId); } catch (err) { /* ignore */ }
            }

            // Save the chosen tab and timestamp to localStorage
            try {
                localStorage.setItem('activeTab', targetTabId);
                localStorage.setItem('tabTimestamp', Date.now());
            } catch (err) {
                console.warn('Could not save active tab:', err);
            }

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

    // Read a tab name from the address, e.g. mysite.com/#contact
    function getTabFromHash() {
        const id = window.location.hash.slice(1);
        const el = id ? document.getElementById(id) : null;
        return el && el.classList.contains('tab-content') ? id : null;
    }

    // When the page loads: the address wins (#contact), then the saved tab (within 1 hour), else home
    const hashTab = getTabFromHash();
    if (hashTab) {
        showTab(hashTab);
    } else {
        try {
            const savedTab = localStorage.getItem('activeTab');
            const savedTime = localStorage.getItem('tabTimestamp');
            const currentTime = Date.now();

            if (savedTab && savedTime && (currentTime - savedTime < ONE_HOUR) && document.getElementById(savedTab)) {
                showTab(savedTab);
            } else {
                // Expired or none found -> clear and default to home
                localStorage.removeItem('activeTab');
                localStorage.removeItem('tabTimestamp');
                if (document.getElementById('home')) {
                    showTab('home');
                }
            }
        } catch (err) {
            console.warn('Could not read active tab:', err);
        }
    }

    // Browser Back / Forward buttons
    window.addEventListener('popstate', () => {
        const tab = getTabFromHash();
        if (tab) {
            showTab(tab);
        } else if (!window.location.hash) {
            showTab('home');
        }
        window.scrollTo({ top: 0 });
    });

    // Hero Slider 
    const heroSlides = document.querySelectorAll('.hero-slide, .slide, .carousel-item');

    if (heroSlides.length > 0) {
        let heroIndex = 0;
        const heroDots = document.querySelectorAll('.dots-container .dot');

        if (!document.querySelector('.hero-slide.active, .slide.active, .carousel-item.active')) {
            heroSlides[0].classList.add('active');
        }

        function showNextHeroSlide() {
            heroSlides[heroIndex].classList.remove('active');
            heroIndex = (heroIndex + 1) % heroSlides.length;
            heroSlides[heroIndex].classList.add('active');
            heroDots.forEach((dot, i) => dot.classList.toggle('active', i === heroIndex));
        }

        setInterval(showNextHeroSlide, 5000);
    }

    //  Work Slider 
    const slides = document.querySelectorAll('.work-slide');

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

        // Automatic change every 5 seconds
        setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 5000);
    }

    //  FAQ 
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
                    syncExpanded(faqItems, '.faq-question');
                });
            }
        });
    }

    //  Consultation Form 
    const consultationForm = document.getElementById('consultation-form');
    const notificationModal = document.getElementById('notification-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const formError = document.getElementById('form-error');

    if (consultationForm && notificationModal) {
        consultationForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(consultationForm);

            try {
                const response = await fetch("/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: new URLSearchParams(formData).toString()
                });

                if (!response.ok) {
                    throw new Error('Server answered with status ' + response.status);
                }

                if (formError) formError.hidden = true;
                notificationModal.classList.add('active');
                consultationForm.reset();

            } catch (error) {
                console.error("Form submission error:", error);
                if (formError) {
                    formError.textContent = 'Your request was not sent. Check your internet connection and try again, or message me on WhatsApp.';
                    formError.hidden = false;
                }
            }
        });

        // Close the "thank you" popup
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                notificationModal.classList.remove('active');
            });
        }
    }

    //  Value Items 
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
                    syncExpanded(valueItems, '.value-toggle-btn');
                });
            }
        });
    }

    //  Back to top button
    const backToTop = document.getElementById('back-to-top');

    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 600);
        }, { passive: true });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    //  Image zoom (lightbox)
    const zoomImages = document.querySelectorAll('.work-slide img, .about-story-img');

    if (zoomImages.length > 0) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.setAttribute('role', 'dialog');
        lightbox.setAttribute('aria-modal', 'true');
        lightbox.setAttribute('aria-label', 'Enlarged image');
        lightbox.innerHTML = '<button type="button" class="lightbox-close" aria-label="Close image">&times;</button><img alt="">';
        document.body.appendChild(lightbox);

        const lightboxImg = lightbox.querySelector('img');
        const lightboxClose = lightbox.querySelector('.lightbox-close');
        let lastFocused = null;

        function openLightbox(img) {
            lastFocused = document.activeElement;
            lightboxImg.src = img.currentSrc || img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('active');
            lightboxClose.focus();
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            if (lastFocused) lastFocused.focus();
        }

        zoomImages.forEach(img => {
            img.setAttribute('tabindex', '0');
            img.setAttribute('role', 'button');
            img.setAttribute('aria-label', 'Enlarge image: ' + img.alt);
            img.addEventListener('click', () => openLightbox(img));
            img.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(img);
                }
            });
        });

        lightbox.addEventListener('click', closeLightbox);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
        });
    }

});