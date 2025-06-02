// Advanced Interactive Features for Wings of Brotherhood
document.addEventListener('DOMContentLoaded', function() {
    
        // Select the custom cursor trail element from the DOM
    const cursorTrail = document.querySelector('.cursor-trail');
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', (e) => { // Update cursor position on mouse move
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() { // Smoothly animate the cursor trail
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        cursorTrail.style.left = cursorX - 10 + 'px';
        cursorTrail.style.top = cursorY - 10 + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Custom Cursor Trail Effect
    const scrollingBirds = document.getElementById('scrollingBirds');
    let lastScrollY = window.scrollY;
    let scrollDirection = 'down';
    let birdsVisible = false;
    let birdPosition = -150; // Starting position (off-screen left)
    
    function updateScrollingBirds() { // Update bird position based on scroll
        const currentScrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = currentScrollY / maxScroll;
        
        // Determine scroll direction
        if (currentScrollY > lastScrollY) {
            scrollDirection = 'down';
        } else if (currentScrollY < lastScrollY) {
            scrollDirection = 'up';
        }
        lastScrollY = currentScrollY;
        
        // Show birds when scrolling
        if (Math.abs(currentScrollY - lastScrollY) > 5 || currentScrollY > 100) {
            if (!birdsVisible) {
                scrollingBirds.classList.add('visible');
                birdsVisible = true;
            }
            
            // Calculate bird position based on scroll progress and direction
            if (scrollDirection === 'down') {
                // Birds fly from left to right
                birdPosition = -150 + (scrollProgress * (window.innerWidth + 300));
                scrollingBirds.style.transform = `translateX(${birdPosition}px) scaleX(1)`;
            } else {
                // Birds fly from right to left (reversed)
                birdPosition = (window.innerWidth + 150) - (scrollProgress * (window.innerWidth + 300));
                scrollingBirds.style.transform = `translateX(${birdPosition}px) scaleX(-1)`;
            }
            
            // Hide birds when they reach the edge
            if (birdPosition > window.innerWidth + 150 || birdPosition < -150) {
                setTimeout(() => {
                    if (birdsVisible) {
                        scrollingBirds.classList.remove('visible');
                        birdsVisible = false;
                    }
                }, 1000);
            }
        }
    }
    
    // Throttled scroll handler for birds
    let birdAnimationFrame;
    window.addEventListener('scroll', function() {
        if (birdAnimationFrame) {
            cancelAnimationFrame(birdAnimationFrame);
        }
        birdAnimationFrame = requestAnimationFrame(updateScrollingBirds);
    });

    // Interactive Play Button
    const playButton = document.getElementById('playButton');
    const mainVideo = document.getElementById('mainVideo');
    
playButton.addEventListener('click', function () {
  playButton.style.opacity = '0';
  playButton.style.transform = 'translate(-50%, -50%) scale(0.8)';

  setTimeout(() => { // Delay to allow the button animation to complete
    playButton.style.display = 'none';
    mainVideo.classList.remove('hidden-video');
    mainVideo.classList.add('visible-video');
  }, 300);
});



    // Animated Counter for Stats
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        updateCounter();
    }

    // Trigger counter animation on scroll
    const statNumbers = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const statsObserver = new IntersectionObserver((entries) => { // Observe when stats come into view
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    statNumbers.forEach(stat => { // Initialize stats observer
        statsObserver.observe(stat);
    });

    // Advanced Smooth Scrolling with Easing
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) { // Smooth scroll to target section
                const startPosition = window.pageYOffset;
                const targetPosition = targetSection.offsetTop - 100;
                const distance = targetPosition - startPosition;
                const duration = 1500;
                let start = null;

                function smoothScroll(timestamp) { // Animation function
                    if (!start) start = timestamp;
                    const progress = timestamp - start;
                    const percentage = Math.min(progress / duration, 1);
                    
                    // Easing function
                    const easeInOutCubic = percentage < 0.5 
                        ? 4 * percentage * percentage * percentage 
                        : (percentage - 1) * (2 * percentage - 2) * (2 * percentage - 2) + 1;
                    
                    window.scrollTo(0, startPosition + distance * easeInOutCubic);
                    
                    if (progress < duration) { // Continue animation until duration is reached
                        requestAnimationFrame(smoothScroll);
                    }
                }
                requestAnimationFrame(smoothScroll);
            }
        });
    });

    // Timeline Animation on Scroll
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 200);
            }
        });
    }, { threshold: 0.3 });

    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });

    // 3D Card Flip Interaction Enhancement
    const characterCards = document.querySelectorAll('.character-card');
    
    characterCards.forEach(card => { // Add click interaction for card flip
        let isFlipped = false;
        
        card.addEventListener('click', function() {
            if (!isFlipped) {
                this.style.transform = 'rotateY(180deg)';
                isFlipped = true;
            } else {
                this.style.transform = 'rotateY(0deg)';
                isFlipped = false;
            }
        });

        // Add subtle 3D hover effect
        card.addEventListener('mousemove', function(e) {
            if (!isFlipped) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`; //  Apply 3D transform based on mouse position
            }
        });

        card.addEventListener('mouseleave', function() { // Reset transform on mouse leave
            if (!isFlipped) {
                this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            }
        });
    });

    // Interactive Experience Items
    const experienceItems = document.querySelectorAll('.experience-item');
    
    experienceItems.forEach(item => { // Add hover effect to experience items
        item.addEventListener('mouseenter', function() {
            const visual = this.querySelector('.visual-content');
            visual.style.transform = 'scale(1.2) rotateZ(10deg)';
            visual.style.filter = 'drop-shadow(0 0 30px currentColor)';
        });

        item.addEventListener('mouseleave', function() { // Reset visual on mouse leave
            const visual = this.querySelector('.visual-content');
            visual.style.transform = 'scale(1) rotateZ(0deg)';
            visual.style.filter = 'drop-shadow(0 0 20px currentColor)';
        });

        // Click interaction
        item.addEventListener('click', function() {
            this.style.animation = 'pulse 0.6s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 600);
        });
    });

    // Parallax Effects
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-particles');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });

        // Navbar dynamic background
        const navbar = document.querySelector('.navbar');
        if (scrolled > 100) {
            navbar.style.background = 'rgba(0, 0, 0, 0.9)';
            navbar.style.backdropFilter = 'blur(30px)';
        } else {
            navbar.style.background = 'rgba(0, 0, 0, 0.1)';
            navbar.style.backdropFilter = 'blur(20px)';
        }
    });

    // Dynamic Text Effects
    const titleWords = document.querySelectorAll('.title-word');
    
    titleWords.forEach((word, index) => {
        word.addEventListener('mouseenter', function() {
            this.style.animationDuration = '1s';
            this.style.transform = 'rotateX(15deg) rotateY(15deg) scale(1.1)';
        });

        word.addEventListener('mouseleave', function() {
            this.style.animationDuration = '6s';
            this.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
        });
    });

    // Interactive Reviews
    const reviewBubbles = document.querySelectorAll('.review-bubble');
    
    reviewBubbles.forEach((bubble, index) => { // Add hover effect to review bubbles
        bubble.addEventListener('click', function() {
            // Create floating stars effect
            for (let i = 0; i < 5; i++) {
                const star = document.createElement('div');
                star.innerHTML = '⭐'; // Use star emoji for visual effect
                star.style.position = 'absolute';
                star.style.left = Math.random() * 100 + '%';
                star.style.top = Math.random() * 100 + '%';
                star.style.fontSize = '2rem';
                star.style.pointerEvents = 'none';
                star.style.animation = 'starFloat 2s ease-out forwards';
                star.style.zIndex = '1000';
                
                this.appendChild(star);
                
                setTimeout(() => {
                    star.remove();
                }, 2000);
            }
        });
    });

    // Easter Egg: Konami Code
    let konamiCode = [];
    const konamiSequence = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'KeyB', 'KeyA'
    ];

    document.addEventListener('keydown', function(e) { // Listen for Konami Code key presses
        konamiCode.push(e.code);
        
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
            // Special effect
            document.body.style.filter = 'hue-rotate(180deg)';
            setTimeout(() => {
                document.body.style.filter = '';
            }, 3000);
            konamiCode = [];
        }
    });

    // Sound Effects (Web Audio API) - Enhanced for dramatic effect
    let audioContext;
    
    function initAudio() { // Initialize the audio context if not already done
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }
    
    function playTone(frequency, duration, type = 'sine') { // Play a tone with specified frequency, duration, and wave type
        initAudio();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        const filterNode = audioContext.createBiquadFilter();
        
        oscillator.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        filterNode.type = 'lowpass';
        filterNode.frequency.value = frequency * 2;
        
        gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + duration);
    }
    
    // Enhanced sound effects
    function playBirdSound() {
        playTone(800, 0.1, 'triangle');
        setTimeout(() => playTone(1000, 0.1, 'triangle'), 100);
    }
    
    function playClickSound() { // Play a click sound with a square wave
        playTone(440, 0.15, 'square');
    }
    
    function playHoverSound() { // Play a hover sound with a sawtooth wave
        playTone(220, 0.08, 'sine');
    }

    // Add sound to interactions
    characterCards.forEach(card => {
        card.addEventListener('click', () => playTone(440, 0.2));
    });

    experienceItems.forEach(item => {
        item.addEventListener('mouseenter', () => playTone(330, 0.1));
    });

    // Performance Optimization: Throttle scroll events
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Apply throttling to scroll events
    window.addEventListener('scroll', throttle(function() {
        // Additional scroll-based animations can be added here
    }, 16)); // ~60fps

});

// CSS Keyframes added dynamically
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    @keyframes sparkleFloat {
        0% {
            transform: translateY(0) scale(1) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(-80px) scale(0) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    @keyframes shimmerSweep {
        0% {
            transform: translateX(-100%) skew(-15deg);
        }
        100% {
            transform: translateX(200%) skew(-15deg);
        }
    }
    
    .shimmer-effect {
        position: relative;
        overflow: hidden;
    }
    
    .shimmer-effect::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        animation: shimmerSweep 2s infinite;
        pointer-events: none;
    }
`;
document.head.appendChild(dynamicStyles); // Append dynamic styles to the document head