document.addEventListener('DOMContentLoaded', () => {
    // Remove no-js class
    document.documentElement.classList.remove('no-js');

    console.log('DOM loaded, initializing components...');

    const header = document.getElementById('top');
    const kpiNumbers = document.querySelectorAll('.kpi-number');
    const currentYearSpan = document.getElementById('currentYear');
    const clientLogos = document.querySelectorAll('#clients .logo-wrapper');

    // Prefers-reduced-motion check
    const motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = motionMediaQuery.matches;

    motionMediaQuery.addEventListener('change', () => {
        prefersReducedMotion = motionMediaQuery.matches;
    });

    // 1. Header Hide on Scroll Down
    if (header) {
        let lastScrollTop = 0;
        const scrollThreshold = 200; // Start hiding after scrolling 200px
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > scrollThreshold) {
                if (scrollTop > lastScrollTop) {
                    // Scrolling down - hide header
                    header.classList.add('scrolled');
                } else {
                    // Scrolling up - show header
                    header.classList.remove('scrolled');
                }
            } else {
                // At top of page - always show header
                header.classList.remove('scrolled');
            }
            
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
        });
    }

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!header.contains(e.target)) {
                mobileMenuBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
            }
        });
    }

    // 2. KPI Counter
    const animateKPI = (element, target) => {
        if (prefersReducedMotion) {
            element.textContent = target;
            const metricSpan = element.nextElementSibling;
            if (metricSpan && metricSpan.classList.contains('kpi-metric')) {
                 // Keep metric visible immediately if motion is reduced
            } else if (element.dataset.target.includes('+') || element.dataset.target.includes('%')){
                // Suffixes handled by HTML structure
            }
            return;
        }

        let start = 0;
        const duration = 2000; // 2 seconds
        const range = target - start;
        let startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            let currentValue = Math.floor(progress * range + start);
            element.textContent = currentValue;

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }
        requestAnimationFrame(step);
    };

    const kpiObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const targetVal = parseInt(el.dataset.target, 10);
                animateKPI(el, targetVal);
                kpiObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    kpiNumbers.forEach(num => {
        kpiObserver.observe(num);
    });

    // 3. Experience Section Animations
    const initializeExperienceAnimations = () => {
        const experienceSection = document.getElementById('experience');
        if (!experienceSection) return;

        // Ensure all industry cards are visible immediately
        const industryCards = document.querySelectorAll('.industry-card');
        const statItems = document.querySelectorAll('.stat-item');

        // Force visibility for all elements
        industryCards.forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
            card.style.display = 'block';
            card.style.visibility = 'visible';
        });

        statItems.forEach(stat => {
            stat.style.opacity = '1';
            stat.style.transform = 'translateY(0)';
            stat.style.display = 'block';
            stat.style.visibility = 'visible';
        });

        console.log('Experience section initialized:', {
            industryCards: industryCards.length,
            statItems: statItems.length,
            section: experienceSection
        });
    };

    // Initialize experience animations
    initializeExperienceAnimations();

    // 4. Enhanced Mobile Swiper Configuration with Fallback
    let swiperRetryCount = 0;
    const maxRetries = 5;
    
    const initializeSwiper = () => {
        const swiperContainer = document.querySelector('.swiper-container');
        
        if (!swiperContainer) {
            console.warn('Swiper container not found');
            return;
        }

        console.log('Attempting to initialize Swiper, attempt:', swiperRetryCount + 1);

        if (typeof Swiper === 'undefined') {
            swiperRetryCount++;
            if (swiperRetryCount < maxRetries) {
                console.log('Swiper library not loaded yet. Retrying in 500ms...');
                setTimeout(initializeSwiper, 500);
                return;
            } else {
                console.warn('Swiper library failed to load after', maxRetries, 'attempts. Implementing CSS fallback.');
                implementCSSFallback();
                return;
            }
        }

        try {
            console.log('Swiper library found, initializing...');
            
            const swiper = new Swiper('.swiper-container', {
                // Core settings
                direction: 'horizontal',
                loop: true,
                
                // Autoplay settings
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                },
                
                // Pagination
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                    dynamicBullets: true,
                },
                
                // Navigation (optional)
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                
                // Mobile-first responsive configuration
                slidesPerView: 1.1, // Show partial next slide on mobile
                spaceBetween: 16,
                centeredSlides: false,
                
                // Responsive breakpoints
                breakpoints: {
                    // Mobile landscape
                    480: {
                        slidesPerView: 1.2,
                        spaceBetween: 20,
                    },
                    // Tablet portrait
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 24,
                        loop: true,
                    },
                    // Desktop
                    1024: {
                        slidesPerView: 3,
                        spaceBetween: 32,
                        loop: false, // Disable loop on desktop
                    },
                },
                
                // Touch and interaction settings
                touchRatio: 1,
                touchAngle: 45,
                grabCursor: true,
                touchStartPreventDefault: false,
                
                // Performance optimizations
                updateOnWindowResize: true,
                watchOverflow: true,
                watchSlidesProgress: true,
                
                // Additional mobile enhancements
                freeMode: false,
                freeModeSticky: true,
                
                // Event callbacks for debugging
                on: {
                    init: function () {
                        console.log('✅ Swiper initialized successfully');
                    },
                    slideChange: function () {
                        console.log('Slide changed to:', this.activeIndex);
                    },
                    touchStart: function () {
                        console.log('Touch started on Swiper');
                    },
                    touchEnd: function () {
                        console.log('Touch ended on Swiper');
                    },
                    error: function (error) {
                        console.error('Swiper error:', error);
                    }
                }
            });
            
            return swiper;
            
        } catch (error) {
            console.error('Failed to initialize Swiper:', error);
            implementCSSFallback();
        }
    };

    // CSS-only fallback for mobile when Swiper fails
    const implementCSSFallback = () => {
        console.log('Implementing CSS-only mobile slider fallback...');
        const swiperContainer = document.querySelector('.swiper-container');
        const swiperWrapper = document.querySelector('.swiper-wrapper');
        const pagination = document.querySelector('.swiper-pagination');
        
        if (swiperContainer && swiperWrapper) {
            // Add CSS fallback classes
            swiperContainer.classList.add('fallback-slider');
            swiperWrapper.classList.add('fallback-wrapper');
            
            // Hide pagination if Swiper isn't working
            if (pagination) {
                pagination.style.display = 'none';
            }
            
            // Add CSS for horizontal scroll on mobile
            const style = document.createElement('style');
            style.textContent = `
                .fallback-slider {
                    overflow-x: auto;
                    -webkit-overflow-scrolling: touch;
                    scroll-snap-type: x mandatory;
                }
                .fallback-wrapper {
                    display: flex;
                    gap: 1rem;
                    padding: 0 1rem;
                }
                .fallback-wrapper .swiper-slide {
                    flex: 0 0 85%;
                    scroll-snap-align: start;
                }
                @media (min-width: 768px) {
                    .fallback-wrapper .swiper-slide {
                        flex: 0 0 45%;
                    }
                }
                @media (min-width: 1024px) {
                    .fallback-wrapper .swiper-slide {
                        flex: 0 0 30%;
                    }
                }
            `;
            document.head.appendChild(style);
            console.log('✅ CSS fallback implemented');
        }
    };

    // Initialize Swiper when DOM is ready
    initializeSwiper();

    // 4. Update Copyright Year
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // 5. Optional: Stagger fade-in for client logos
    if (clientLogos.length > 0 && !prefersReducedMotion) {
        const logoObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 150); // Stagger delay
                    logoObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        clientLogos.forEach(logo => {
            logo.classList.add('fade-in'); // Add class to prepare for animation
            logoObserver.observe(logo);
        });
    }

    // 6. Modern Card Grid Scroll Animations
    const serviceItems = document.querySelectorAll('.service-item');
    
    if (serviceItems.length > 0) {
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        };

        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add staggered delay for smoother animation
                    const delay = Array.from(serviceItems).indexOf(entry.target) * 100;
                    
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);
                    
                    cardObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        serviceItems.forEach(item => {
            cardObserver.observe(item);
        });
    }
}); 