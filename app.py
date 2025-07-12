import os
from flask import Flask, render_template, url_for
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('onepage.html', year=datetime.now().year)

# For Vercel serverless functions
app = app

if __name__ == '__main__':
    app.run(debug=True)
