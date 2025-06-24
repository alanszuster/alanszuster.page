import os
from flask import Flask, render_template, url_for, redirect, send_from_directory
from datetime import datetime
from dotenv import load_dotenv

# Configuration
DEBUG = True
load_dotenv()  # load environment variables from .env file

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html',
                           year=datetime.now().year)

@app.route('/about/')
def about():
    return render_template('about.html',
                          year=datetime.now().year)

@app.route('/skills/')
def skills():
    return render_template('skills.html',
                          year=datetime.now().year)

@app.route('/projects/')
def projects():
    return render_template('projects.html',
                          year=datetime.now().year)

@app.route('/contact/')
def contact():
    return render_template('contact.html',
                          year=datetime.now().year)

@app.route('/cv/')
def download_cv():
    """Serve CV file if exists - not committed to git"""
    cv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'CV-2025.pdf')
    if os.path.exists(cv_path):
        return send_from_directory(os.path.dirname(cv_path), 'CV-2025.pdf', as_attachment=True)
    else:
        # Return to homepage if CV not available
        return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
