import os
from flask import Flask, render_template, url_for, redirect, send_from_directory, request, jsonify
from datetime import datetime
from dotenv import load_dotenv
from visitor_counter import increment_counter, get_visitor_stats

DEBUG = True
load_dotenv()

app = Flask(__name__)

@app.route('/')
def index():
    stats = get_visitor_stats()
    return render_template('onepage.html',
                           year=datetime.now().year,
                           visitor_stats=stats)

@app.route('/api/visitor-count')
def visitor_count():
    stats = get_visitor_stats()
    return jsonify(stats)

@app.route('/api/increment-count')
def increment_count():
    data = increment_counter(request)
    return jsonify({"success": True, "total": data["total_visits"]})

@app.before_request
def before_request():
    if not request.path.startswith('/api/') and not request.path.startswith('/static/'):
        if request.method == 'GET':
            increment_counter(request)

if __name__ == '__main__':
    app.run(debug=True)
