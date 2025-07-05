import json
import os
from datetime import datetime
from pathlib import Path

DATA_FILE = Path('static/data/visitors.json')

def ensure_data_dir():
    data_dir = Path('static/data')
    if not data_dir.exists():
        data_dir.mkdir(parents=True, exist_ok=True)

def load_visitor_data():
    ensure_data_dir()

    if not DATA_FILE.exists():
        default_data = {
            "total_visits": 0,
            "visits_by_date": {},
            "visits_by_hour": {str(i): 0 for i in range(24)},
            "user_agents": {},
            "last_updated": datetime.now().isoformat()
        }
        save_visitor_data(default_data)
        return default_data

    with open(DATA_FILE, 'r') as f:
        return json.load(f)

def save_visitor_data(data):
    ensure_data_dir()

    data["last_updated"] = datetime.now().isoformat()
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

def increment_counter(request):
    data = load_visitor_data()

    data["total_visits"] += 1

    today = datetime.now().strftime('%Y-%m-%d')
    if today not in data["visits_by_date"]:
        data["visits_by_date"][today] = 0
    data["visits_by_date"][today] += 1

    hour = datetime.now().strftime('%H')
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

    if browser not in data["user_agents"]:
        data["user_agents"][browser] = 0
    data["user_agents"][browser] += 1

    save_visitor_data(data)
    return data

def get_visitor_stats():
    data = load_visitor_data()
    total_visits = data["total_visits"]

    result = {
        "total_visits": total_visits,
        "today": data["visits_by_date"].get(datetime.now().strftime('%Y-%m-%d'), 0),
        "last_updated": data["last_updated"]
    }

    return result
