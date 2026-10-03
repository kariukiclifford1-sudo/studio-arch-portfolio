document.addEventListener('DOMContentLoaded', () => {

    const hamburger = document.querySelector('.hamburger') || document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu') || document.querySelector('.nav-links');
    const tabLinks = document.querySelectorAll('[data-tab]');
    const tabContents = document.querySelectorAll('.tab-content');

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

    // When the page loads: restore saved tab if within 1 hour, else default to home
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

    // Hero Slider 
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
                });
            }
        });
    }

    //  Consultation Form 
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
                });
            }
        });
    }

});