document.addEventListener('DOMContentLoaded', function() {
    const counterElement = document.getElementById('counter-digits');
    const todayElement = document.getElementById('today-visits');
    const visitorCounter = document.getElementById('visitor-counter');

    if (!counterElement || !todayElement) return;

    // Ustawienie klucza dla naszej strony (alanszuster.github.io)
    const NAMESPACE_KEY = 'alanszuster-portfolio';
    const TOTAL_KEY = 'total-visits';
    const TODAY_KEY = 'today-' + new Date().toISOString().split('T')[0];

    // Funkcja pobierająca wartość licznika
    async function getCount(key) {
        try {
            const response = await fetch(`https://api.countapi.xyz/get/${NAMESPACE_KEY}/${key}`);
            const data = await response.json();
            return data.value || 0;
        } catch (error) {
            console.error('Error fetching counter:', error);
            return 0;
        }
    }

    // Funkcja zwiększająca licznik
    async function incrementCount(key) {
        try {
            const response = await fetch(`https://api.countapi.xyz/hit/${NAMESPACE_KEY}/${key}`);
            const data = await response.json();
            return data.value;
        } catch (error) {
            console.error('Error incrementing counter:', error);
            return 0;
        }
    }

    // Sprawdzenie, czy już odwiedziliśmy stronę w tej sesji
    const sessionKey = 'visitedThisSession';
    const hasVisitedThisSession = sessionStorage.getItem(sessionKey);

    // Pobierz i zaktualizuj liczniki
    (async function updateCounters() {
        // Pobierz całkowity licznik
        let totalCount = 0;

        // Jeśli to nowa sesja, zwiększ liczniki
        if (!hasVisitedThisSession) {
            totalCount = await incrementCount(TOTAL_KEY);
            await incrementCount(TODAY_KEY);
            sessionStorage.setItem(sessionKey, 'true');
        } else {
            totalCount = await getCount(TOTAL_KEY);
        }

        // Pobierz licznik dzisiejszych odwiedzin
        const todayCount = await getCount(TODAY_KEY);

        // Aktualizuj wyświetlane liczniki
        if (counterElement) {
            counterElement.textContent = totalCount.toLocaleString();
            // Animacja licznika całkowitego
            animateValue(counterElement, totalCount > 0 ? totalCount - 1 : 0, totalCount, 1000);
        }

        if (todayElement) {
            todayElement.textContent = todayCount.toLocaleString();
        }

        // Pokaż licznik
        if (visitorCounter) {
            visitorCounter.classList.add('visible');
        }
    })();
});

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
