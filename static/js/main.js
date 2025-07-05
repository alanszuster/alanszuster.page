document.addEventListener('DOMContentLoaded', function() {

    const hamburger = document.querySelector('.hamburger');
    const mobileNavLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            mobileNavLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Contact form has been removed in favor of direct contact information

    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

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

    if (document.querySelector('.progress-bar')) {
        animateProgressBars();
    }

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

    window.addEventListener('scroll', scrollFunction);

    if (!document.getElementById('backToTop')) {
        const backToTopBtn = document.createElement('button');
        backToTopBtn.id = 'backToTop';
        backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        backToTopBtn.title = 'Back to top';
        backToTopBtn.setAttribute('aria-label', 'Back to top');
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
