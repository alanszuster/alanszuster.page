import os
import requests
from flask import Flask, render_template, url_for, request, jsonify
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)

# Configuration for AI Calambury API
AI_API_URL = os.getenv('AI_API_URL', 'http://localhost:5000')  # Default to localhost for development

@app.route('/')
def index():
    return render_template('onepage.html', year=datetime.now().year)

@app.route('/api/ai/predict', methods=['POST'])
def ai_predict():
    """Proxy endpoint for AI prediction to handle CORS and API routing"""
    try:
        # Forward the request to the AI microservice
        response = requests.post(
            f"{AI_API_URL}/predict",
            json=request.json,
            headers={'Content-Type': 'application/json'},
            timeout=30
        )

        return jsonify(response.json()), response.status_code

    except requests.exceptions.RequestException as e:
        return jsonify({
            'error': f'Failed to connect to AI service: {str(e)}',
            'predictions': []
        }), 503

@app.route('/api/ai/random-word')
def ai_random_word():
    """Proxy endpoint for getting random word"""
    try:
        response = requests.get(
            f"{AI_API_URL}/get_random_word",
            timeout=10
        )

        return jsonify(response.json()), response.status_code

    except requests.exceptions.RequestException as e:
        return jsonify({
            'error': f'Failed to connect to AI service: {str(e)}',
            'word': None
        }), 503

@app.route('/api/ai/health')
def ai_health():
    """Check AI service health"""
    try:
        response = requests.get(
            f"{AI_API_URL}/health",
            timeout=5
        )

        return jsonify(response.json()), response.status_code

    except requests.exceptions.RequestException as e:
        return jsonify({
            'status': 'unhealthy',
            'error': f'AI service unavailable: {str(e)}'
        }), 503

app = app

if __name__ == '__main__':
    app.run(debug=True)
