// Main JavaScript for portfolio website

document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Check for saved theme preference or use OS preference
    if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && prefersDarkMode)) {
        document.body.classList.add('dark-mode');
    }

    // Theme toggle button handler
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');

            // Save preference to localStorage
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Form submission handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // In a real application, you would send this data to a server
            // For demonstration purposes, we'll just log it to console
            console.log('Form submission:', { name, email, subject, message });

            // Show success message
            alert('Dziękuję za wiadomość! Odpowiem najszybciej jak to możliwe.');

            // Reset form
            contactForm.reset();
        });
    }

    // Add active class to nav links based on current page
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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

    // Add animation to skill progress bars
    const animateProgressBars = () => {
        const progressBars = document.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
            const width = bar.getAttribute('aria-valuenow') + '%';
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.transition = 'width 1s ease-in-out';
                bar.style.width = width;
            }, 200);
        });
    };

    // Check if we're on the skills page
    if (document.querySelector('.progress-bar')) {
        animateProgressBars();
    }

    // Show back-to-top button when scrolling down
    const scrollFunction = () => {
        const backToTopBtn = document.getElementById('backToTop');
        if (backToTopBtn) {
            if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
                backToTopBtn.style.display = 'block';
                backToTopBtn.style.opacity = '1';
            } else {
                backToTopBtn.style.opacity = '0';
                setTimeout(() => {
                    if (document.body.scrollTop <= 300 && document.documentElement.scrollTop <= 300) {
                        backToTopBtn.style.display = 'none';
                    }
                }, 300);
            }
        }
    };

    // Listen for scroll events
    window.addEventListener('scroll', scrollFunction);

    // Add back-to-top button if it doesn't exist
    if (!document.getElementById('backToTop')) {
        const backToTopBtn = document.createElement('button');
        backToTopBtn.id = 'backToTop';
        backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        backToTopBtn.title = 'Przewiń do góry';
        backToTopBtn.setAttribute('aria-label', 'Przewiń do góry');
        backToTopBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: var(--primary-color);
            color: white;
            border: none;
            cursor: pointer;
            display: none;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 1000;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        `;

        document.body.appendChild(backToTopBtn);

        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Initialize project tabs if present
    const projectsTab = document.getElementById('projects-tab');
    if (projectsTab) {
        const triggerTabList = projectsTab.querySelectorAll('button');
        triggerTabList.forEach(triggerEl => {
            triggerEl.addEventListener('click', function(e) {
                e.preventDefault();
                const tab = new bootstrap.Tab(triggerEl);
                tab.show();
            });
        });
    }
});
