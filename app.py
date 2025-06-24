import os
from flask import Flask, render_template, url_for, redirect, send_from_directory
from datetime import datetime
from dotenv import load_dotenv

DEBUG = True
load_dotenv()

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

@app.route('/contact/')
def contact():
    return render_template('contact.html',
                          year=datetime.now().year)

if __name__ == '__main__':
    app.run(debug=True)
