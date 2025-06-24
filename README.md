# Alan Szuster - Portfolio Website

This repository contains my personal portfolio website, built with Python and Flask.

## Overview

This portfolio website showcases my skills, projects, and experience as a Python Developer and Data Scientist.

## Features

- Responsive design
- Dark/light mode toggle
- Project showcase
- Skills & experience display
- Contact form
- CV download (CV file itself is not tracked in git for privacy reasons)

## Technologies Used

- **Backend**: Python, Flask
- **Frontend**: HTML5, CSS3, JavaScript
- **Deployment**: GitHub Pages with Frozen-Flask

## How to Run Locally

1. Clone the repository
```bash
git clone https://github.com/alanszuster/alanszuster.github.io.git
cd alanszuster.github.io
```

2. Install requirements
```bash
pip install -r requirements.txt
```

3. Run the development server
```bash
python app.py
```

4. Visit `http://localhost:5000` in your browser

## Deployment

This website is deployed to GitHub Pages. The deployment process converts the Flask app to static files using Frozen-Flask.

1. Build the static site
```bash
python freeze.py
```

2. Push to GitHub
```bash
git add .
git commit -m "Update site"
git push
```

## License

© 2025 Alan Szuster. All rights reserved.
