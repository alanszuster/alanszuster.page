import os
import json
from datetime import datetime
from pathlib import Path
from firebase_admin import credentials, firestore, initialize_app

# Ścieżka do pliku konfiguracyjnego Firebase
FIREBASE_CONFIG_FILE = Path('firebase-config.json')

# Inicjalizacja Firebase (tylko raz)
firebase_app = None
db = None

def init_firebase():
    global firebase_app, db
    if firebase_app is None:
        try:
            # Sprawdź, czy mamy zmienne środowiskowe (dla CI/CD) lub lokalny plik
            if os.environ.get('FIREBASE_CONFIG'):
                # W środowisku CI używamy zmiennych środowiskowych
                firebase_config = json.loads(os.environ.get('FIREBASE_CONFIG'))
                cred = credentials.Certificate(firebase_config)
            elif FIREBASE_CONFIG_FILE.exists():
                # Lokalnie używamy pliku konfiguracyjnego
                cred = credentials.Certificate(str(FIREBASE_CONFIG_FILE))
            else:
                print("Brak konfiguracji Firebase. Licznik odwiedzin nie będzie działał.")
                return False

            firebase_app = initialize_app(cred)
            db = firestore.client()
            return True
        except Exception as e:
            print(f"Błąd inicjalizacji Firebase: {e}")
            return False
    return True

def get_visitor_data():
    """Pobiera dane o odwiedzinach z Firebase"""
    if not init_firebase() or not db:
        # W przypadku braku dostępu do Firebase, zwracamy dane domyślne
        return {
            "total_visits": 0,
            "visits_by_date": {},
            "visits_by_hour": {str(i): 0 for i in range(24)},
            "user_agents": {},
            "last_updated": datetime.now().isoformat()
        }

    try:
        doc_ref = db.collection('stats').document('visitors')
        doc = doc_ref.get()

        if doc.exists:
            return doc.to_dict()
        else:
            # Jeśli dokument nie istnieje, tworzymy domyślny
            default_data = {
                "total_visits": 0,
                "visits_by_date": {},
                "visits_by_hour": {str(i): 0 for i in range(24)},
                "user_agents": {},
                "last_updated": datetime.now().isoformat()
            }
            doc_ref.set(default_data)
            return default_data
    except Exception as e:
        print(f"Błąd odczytu danych z Firebase: {e}")
        # W przypadku błędu zwracamy dane domyślne
        return {
            "total_visits": 0,
            "visits_by_date": {},
            "visits_by_hour": {str(i): 0 for i in range(24)},
            "user_agents": {},
            "last_updated": datetime.now().isoformat()
        }

def save_visitor_data(data):
    """Zapisuje dane o odwiedzinach do Firebase"""
    if not init_firebase() or not db:
        # Jeśli Firebase nie jest dostępny, zapisujemy do pliku lokalnego jako backup
        ensure_data_dir()
        with open('static/data/visitors_backup.json', 'w') as f:
            json.dump(data, f, indent=2)
        return

    try:
        data["last_updated"] = datetime.now().isoformat()
        db.collection('stats').document('visitors').set(data)
    except Exception as e:
        print(f"Błąd zapisu danych do Firebase: {e}")
        # W przypadku błędu zapisujemy dane do pliku lokalnego jako backup
        ensure_data_dir()
        with open('static/data/visitors_backup.json', 'w') as f:
            json.dump(data, f, indent=2)

def ensure_data_dir():
    data_dir = Path('static/data')
    if not data_dir.exists():
        data_dir.mkdir(parents=True, exist_ok=True)

def increment_counter(request):
    """Zwiększa licznik odwiedzin"""
    data = get_visitor_data()

    data["total_visits"] += 1

    today = datetime.now().strftime('%Y-%m-%d')
    if today not in data.get("visits_by_date", {}):
        if "visits_by_date" not in data:
            data["visits_by_date"] = {}
        data["visits_by_date"][today] = 0
    data["visits_by_date"][today] += 1

    hour = datetime.now().strftime('%H')
    if "visits_by_hour" not in data:
        data["visits_by_hour"] = {str(i): 0 for i in range(24)}
    if hour not in data["visits_by_hour"]:
        data["visits_by_hour"][hour] = 0
    data["visits_by_hour"][hour] += 1

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

    if "user_agents" not in data:
        data["user_agents"] = {}
    if browser not in data["user_agents"]:
        data["user_agents"][browser] = 0
    data["user_agents"][browser] += 1

    save_visitor_data(data)
    return data

def get_visitor_stats():
    """Pobiera statystyki odwiedzin"""
    data = get_visitor_data()
    total_visits = data.get("total_visits", 0)

    result = {
        "total_visits": total_visits,
        "today": data.get("visits_by_date", {}).get(datetime.now().strftime('%Y-%m-%d'), 0),
        "last_updated": data.get("last_updated", datetime.now().isoformat())
    }

    return result
