/* ========================================
   GK Prop Solutions - Premium JavaScript
   ======================================== */

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lenis (Smooth Scroll)
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            smoothWheel: true,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Connect scroll links to Lenis
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                lenis.scrollTo(this.getAttribute('href'));
            });
        });
    }

    // Initialize Components
    initPreloader();
    initNavbar();
    initHeroAnimations();
    initPropertyCards();
    initScrollAnimations();
    initCounters();
    initModal();
});

// Preloader
function initPreloader() {
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        gsap.to(preloader, {
            opacity: 0,
            duration: 1,
            ease: "power2.inOut",
            onComplete: () => preloader.style.display = 'none'
        });
    });
}

// Custom Cursor
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.custom-cursor-follower');

    if (window.matchMedia('(pointer: coarse)').matches) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        // Smooth cursor following
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects
    const interactiveElements = document.querySelectorAll('a, button, .property-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
            follower.style.transform = 'scale(1.5)';
            follower.style.borderColor = '#C6A75E';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            follower.style.transform = 'scale(1)';
            follower.style.borderColor = 'rgba(198, 167, 94, 0.5)';
        });
    });
}

// Scroll Progress
function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = progress + '%';
    });
}

// Navbar
function initNavbar() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Hero Animations
function initHeroAnimations() {
    const tl = gsap.timeline();

    tl.from('.hero-title', {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.5
    })
        .from('.hero-description', {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        }, "-=0.8")
        .from('.search-container', {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        }, "-=0.8")
        .from('.navbar', {
            y: -100,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        }, "-=1");
}

// Hero 3D logic removed for lighter theme

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Property Cards
function initPropertyCards() {
    const cards = document.querySelectorAll('.property-card');

    cards.forEach(card => {
        // 3D tilt effect
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });

        // Open modal on click
        card.addEventListener('click', () => {
            const title = card.querySelector('h3').textContent;
            const location = card.querySelector('.location').textContent;
            const price = card.querySelector('.price').textContent;
            const specs = card.querySelector('.specs').textContent;
            const image = card.querySelector('img').src;

            openModal(title, location, price, specs, image);
        });
    });
}

// 3D Property viewer logic removed

// Animated Counters
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseFloat(counter.getAttribute('data-target'));
                const isDecimal = target % 1 !== 0;
                const duration = 2000;
                const startTime = performance.now();

                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const easeProgress = 1 - Math.pow(1 - progress, 3);
                    const current = target * easeProgress;

                    counter.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    }
                }

                requestAnimationFrame(updateCounter);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

// Testimonials Carousel
function initTestimonials() {
    const track = document.querySelector('.testimonials-track');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    const totalSlides = dots.length;

    function goToSlide(index) {
        currentSlide = index;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });

    // Auto-play
    setInterval(() => {
        goToSlide((currentSlide + 1) % totalSlides);
    }, 5000);
}

// Contact Form
function initContactForm() {
    const form = document.getElementById('contactForm');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Simulate form submission
        const btn = form.querySelector('.btn-submit');
        const originalText = btn.innerHTML;

        btn.innerHTML = '<span>Sending...</span>';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = '<span>Message Sent Successfully</span>';
            btn.style.background = '#4CAF50';

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.disabled = false;
                form.reset();
            }, 2000);
        }, 1500);
    });
}

// Modal
function initModal() {
    const modal = document.getElementById('propertyModal');
    const closeBtn = modal.querySelector('.modal-close');

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

function openModal(title, location, price, specs, image) {
    const modal = document.getElementById('propertyModal');

    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalLocation').textContent = location;
    document.getElementById('modalPrice').textContent = price;
    document.getElementById('modalSpecs').textContent = specs;
    document.getElementById('modalImage').src = image;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('propertyModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Scroll Animations (GSAP ScrollTrigger)
function initScrollAnimations() {
    const sections = document.querySelectorAll('section:not(.hero)');

    sections.forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleActions: "play none none none"
            },
            y: 50,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out"
        });
    });
}

// Parallax effect for experience section
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const experienceBg = document.querySelector('.experience-bg');

    if (experienceBg) {
        experienceBg.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});