import sqlite3
import os
from datetime import datetime
from pathlib import Path

# Upewnij się, że katalog data istnieje
DATA_DIR = Path('data')
if not DATA_DIR.exists():
    DATA_DIR.mkdir(parents=True, exist_ok=True)

# Ścieżka do bazy danych SQLite
DB_PATH = DATA_DIR / 'visitors.db'

def init_db():
    """Inicjalizacja bazy danych, jeśli nie istnieje"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Tabela dla całkowitej liczby odwiedzin
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS total_visits (
        id INTEGER PRIMARY KEY,
        count INTEGER DEFAULT 0,
        last_updated TEXT
    )
    ''')

    # Tabela dla odwiedzin według daty
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS visits_by_date (
        date TEXT PRIMARY KEY,
        count INTEGER DEFAULT 0
    )
    ''')

    # Tabela dla odwiedzin według godziny
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS visits_by_hour (
        hour INTEGER PRIMARY KEY,
        count INTEGER DEFAULT 0
    )
    ''')

    # Tabela dla przeglądarek użytkowników
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS user_agents (
        browser TEXT PRIMARY KEY,
        count INTEGER DEFAULT 0
    )
    ''')

    # Sprawdź, czy tabela total_visits ma już rekord
    cursor.execute('SELECT count FROM total_visits WHERE id = 1')
    if not cursor.fetchone():
        cursor.execute('INSERT INTO total_visits (id, count, last_updated) VALUES (1, 0, ?)',
                      (datetime.now().isoformat(),))

    # Inicjalizacja godzin, jeśli nie istnieją
    for hour in range(24):
        cursor.execute('INSERT OR IGNORE INTO visits_by_hour (hour, count) VALUES (?, 0)', (hour,))

    conn.commit()
    conn.close()

def increment_counter(request):
    """Zwiększa liczniki odwiedzin na podstawie żądania"""
    init_db()

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Aktualizacja całkowitej liczby odwiedzin
    cursor.execute('UPDATE total_visits SET count = count + 1, last_updated = ? WHERE id = 1',
                  (datetime.now().isoformat(),))

    # Aktualizacja liczby odwiedzin dla bieżącego dnia
    today = datetime.now().strftime('%Y-%m-%d')
    cursor.execute('INSERT OR IGNORE INTO visits_by_date (date, count) VALUES (?, 0)', (today,))
    cursor.execute('UPDATE visits_by_date SET count = count + 1 WHERE date = ?', (today,))

    # Aktualizacja liczby odwiedzin dla bieżącej godziny
    hour = int(datetime.now().strftime('%H'))
    cursor.execute('UPDATE visits_by_hour SET count = count + 1 WHERE hour = ?', (hour,))

    # Aktualizacja statystyk przeglądarek
    user_agent = request.user_agent.string
    browser = "Unknown"

    if "Chrome" in user_agent and "Chromium" not in user_agent:
        browser = "Chrome"
    elif "Firefox" in user_agent:
        browser = "Firefox"
    elif "Safari" in user_agent and "Chrome" not in user_agent:
        browser = "Safari"
    elif "Edge" in user_agent:
        browser = "Edge"
    elif "MSIE" in user_agent or "Trident" in user_agent:
        browser = "Internet Explorer"

    cursor.execute('INSERT OR IGNORE INTO user_agents (browser, count) VALUES (?, 0)', (browser,))
    cursor.execute('UPDATE user_agents SET count = count + 1 WHERE browser = ?', (browser,))

    # Pobierz aktualizowane dane
    cursor.execute('SELECT count FROM total_visits WHERE id = 1')
    total_visits = cursor.fetchone()[0]

    cursor.execute('SELECT count FROM visits_by_date WHERE date = ?', (today,))
    today_visits = cursor.fetchone()[0]

    conn.commit()
    conn.close()

    return {
        "total_visits": total_visits,
        "today_visits": today_visits,
        "last_updated": datetime.now().isoformat()
    }

def get_visitor_stats():
    """Zwraca statystyki odwiedzin"""
    init_db()

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Pobierz całkowitą liczbę odwiedzin
    cursor.execute('SELECT count, last_updated FROM total_visits WHERE id = 1')
    result = cursor.fetchone()
    total_visits = result[0] if result else 0
    last_updated = result[1] if result else datetime.now().isoformat()

    # Pobierz dzisiejsze odwiedziny
    today = datetime.now().strftime('%Y-%m-%d')
    cursor.execute('SELECT count FROM visits_by_date WHERE date = ?', (today,))
    result = cursor.fetchone()
    today_visits = result[0] if result else 0

    conn.close()

    return {
        "total_visits": total_visits,
        "today": today_visits,
        "last_updated": last_updated
    }
