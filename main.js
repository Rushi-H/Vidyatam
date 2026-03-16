document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation Scroll Effect
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');

    if (menuToggle && navLinksContainer) {
        menuToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
        });

        // Close menu when a link is clicked
        navLinksContainer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
            });
        });
    }

    // 2. Intersection Observer for Scroll Animations (Reveal Elements)
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            }
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 3. Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update active state
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                });
                if (this.classList.contains('active') === false && this.closest('.nav-links')) {
                    this.classList.add('active');
                }
            }
        });
    });

    // 4. Update Navigation Active State on Scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        const navHeight = navbar.offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - navHeight - 100)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // 5. Hero Video Background Rotation
    const heroVideos = document.querySelectorAll('.hero-video');

    if (heroVideos.length > 0) {
        let currentVideoIndex = 0;

        setInterval(() => {
            heroVideos[currentVideoIndex].classList.remove('active');
            currentVideoIndex = (currentVideoIndex + 1) % heroVideos.length;
            heroVideos[currentVideoIndex].classList.add('active');
        }, 8000);
    }

    // 6. Testimonial Slider
    const tTrack = document.getElementById('tsliderTrack');
    const tPrevBtn = document.getElementById('tPrev');
    const tNextBtn = document.getElementById('tNext');
    const tDotsContainer = document.getElementById('tDots');

    if (tTrack) {
        const tCards = tTrack.querySelectorAll('.tcard');
        let tCurrent = 0;
        let tAutoPlay;

        // Build dots
        tCards.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'tslider-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Slide ' + (i + 1));
            dot.addEventListener('click', () => goTo(i));
            tDotsContainer.appendChild(dot);
        });

        function updateDots() {
            tDotsContainer.querySelectorAll('.tslider-dot').forEach((d, i) => {
                d.classList.toggle('active', i === tCurrent);
            });
        }

        function goTo(index) {
            tCards[tCurrent].classList.remove('active');
            tCurrent = (index + tCards.length) % tCards.length;
            tTrack.style.transform = `translateX(-${tCurrent * 100}%)`;
            tCards[tCurrent].classList.add('active');
            updateDots();
        }

        // Activate first card
        tCards[0].classList.add('active');

        // Arrow buttons
        tPrevBtn.addEventListener('click', () => { goTo(tCurrent - 1); resetAutoPlay(); });
        tNextBtn.addEventListener('click', () => { goTo(tCurrent + 1); resetAutoPlay(); });

        // Auto play
        function startAutoPlay() {
            tAutoPlay = setInterval(() => goTo(tCurrent + 1), 5000);
        }
        function resetAutoPlay() {
            clearInterval(tAutoPlay);
            startAutoPlay();
        }

        startAutoPlay();
    }
});
