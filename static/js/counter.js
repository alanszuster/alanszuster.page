document.addEventListener('DOMContentLoaded', function() {
    const counterDigits = document.getElementById('counter-digits');
    const todayVisitsDisplay = document.getElementById('today-visits');
    const visitorCounter = document.getElementById('visitor-counter');

    updateVisitorCounter();

    setInterval(updateVisitorCounter, 30000);
  function updateVisitorCounter() {

        fetch('/api/visitor-count')
            .then(response => response.json())
            .then(data => {
                fadeTransition(counterDigits, data.total_visits.toLocaleString());
                fadeTransition(todayVisitsDisplay, data.today.toLocaleString());

                visitorCounter.classList.add('visible');
            })
            .catch(error => {
                console.error('Error fetching visitor count:', error);
                visitorCounter.classList.add('visible');
            });
    }

    function fadeTransition(element, newValue) {
        if (element.textContent === newValue) return;

        element.style.opacity = 0;

        setTimeout(() => {
            element.textContent = newValue;
            element.style.opacity = 1;
        }, 300);
    }
});
