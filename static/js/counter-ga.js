document.addEventListener('DOMContentLoaded', function() {
    const counterElement = document.getElementById('counter-digits');
    const todayElement = document.getElementById('today-visits');

    if (!counterElement || !todayElement) return;

    let totalCount = parseInt(localStorage.getItem('totalVisits') || '0');
    let todayCount = parseInt(localStorage.getItem('todayVisits') || '0');
    const lastDate = localStorage.getItem('lastVisitDate');
    const today = new Date().toISOString().split('T')[0];

    if (lastDate !== today) {
        todayCount = 1;
        localStorage.setItem('lastVisitDate', today);
    } else {
        todayCount++;
    }

    totalCount++;

    localStorage.setItem('totalVisits', totalCount.toString());
    localStorage.setItem('todayVisits', todayCount.toString());

    counterElement.textContent = totalCount.toLocaleString();
    todayElement.textContent = todayCount.toLocaleString();

    // Animacja licznika
    animateValue(counterElement, totalCount - 1, totalCount, 1000);
});

/**
 * Animuje zmianę wartości liczbowej
 */
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value.toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}
