from flask_frozen import Freezer
from app import app
import os
import shutil

# Configure Freezer to use the root directory
app.config['FREEZER_DESTINATION'] = '.'
freezer = Freezer(app)

@freezer.register_generator
def url_generator():
    yield 'index', {}
    yield 'about', {}
    yield 'skills', {}
    yield 'contact', {}

if __name__ == '__main__':
    # Clean previously generated files if they exist
    paths_to_clean = ['about', 'contact', 'skills', 'index.html']
    for path in paths_to_clean:
        if os.path.isdir(path):
            shutil.rmtree(path)
        elif os.path.exists(path):
            os.remove(path)

    # Generate new static files
    freezer.freeze()
