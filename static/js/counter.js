document.addEventListener('DOMContentLoaded', function() {
    const counterDisplay = document.getElementById('counter-display');
    const counterDigits = document.getElementById('counter-digits');
    const funFactDisplay = document.getElementById('fun-fact');
    const todayVisitsDisplay = document.getElementById('today-visits');
    const visitorCounter = document.getElementById('visitor-counter');

    fetch('/api/visitor-count')
        .then(response => response.json())
        .then(data => {
            updateCounterDisplay(data);
            visitorCounter.classList.add('visible');
        })
        .catch(error => {
            console.error('Error fetching visitor count:', error);
            counterDigits.textContent = '?';
            visitorCounter.classList.add('visible');
        });

    function updateCounterDisplay(data) {
        animateCounter(data.total_visits, counterDigits);
        todayVisitsDisplay.textContent = data.today;

        if (funFactDisplay) {
            funFactDisplay.style.display = 'none';
        }
    }    function animateCounter(target, element) {
        let current = Math.floor(target * 0.7 + Math.random() * target * 0.6);
        const duration = 3000;
        const interval = 10;
        const steps = duration / interval;
        let step = 0;

        element.parentElement.classList.add('terminal-style');

        const animation = setInterval(() => {
            step++;

            const volatility = 1 - (step / steps);
            const delta = target - current;
            const adjustment = delta * (0.1 + (step / steps) * 0.3);

            current += adjustment;
            if (Math.random() < 0.5) {
                current += Math.random() * target * 0.1 * volatility;
                current -= Math.random() * target * 0.1 * volatility;
            }

            current = Math.max(0, current);
            element.textContent = Math.floor(current).toLocaleString();

            if (step >= steps) {
                element.textContent = target.toLocaleString();
                clearInterval(animation);

                setTimeout(() => {
                    element.parentElement.classList.remove('terminal-style');
                    element.parentElement.classList.add('counter-complete');
                }, 500);
            }
        }, interval);
    }
});
