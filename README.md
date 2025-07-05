# Alan Szuster - Personal Website

This is my personal website showcasing my work as a Site Reliability Engineer (SRE). The site highlights my expertise in cloud infrastructure, system automation, monitoring, and development skills, with AI/ML projects as side endeavors. The site is built using Flask and Flask-Frozen to generate static files, and is hosted on GitHub Pages.

**Website**: [https://alanszuster.github.io/](https://alanszuster.github.io/)

## Features

- **One-page Design**: Modern single-page layout with smooth scrolling between sections
- **Dark Theme**: Sleek dark theme with neon accents and subtle glow effects
- **Responsive Design**: Works on all devices from mobile to desktop
- **Visitor Analytics**: Integration with Google Analytics
- **Beautiful UI**: Modern, clean interface with smooth animations and transitions

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5
- **Backend**: Python, Flask, Flask-Frozen
- **Deployment**: GitHub Pages
- **Analytics**: Google Analytics (GA4)

## Google Analytics Configuration

To set up the visitor counter with Google Analytics:

1. Create a Google Analytics account at https://analytics.google.com/
2. Create a new property and get your measurement ID (format: G-XXXXXXXXXX)
3. Replace the placeholder `G-MEASUREMENT_ID` in `templates/base.html` with your actual measurement ID
4. The visitor counter will now track using Google Analytics data

Note: The counter on the page uses localStorage to provide immediate visual feedback, while actual analytics data is collected by Google Analytics.

## Author

**Alan Szuster**
SRE, ML/AI Engineer

## License

© 2025 Alan Szuster. All rights reserved.
