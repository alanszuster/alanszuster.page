from flask_frozen import Freezer
from app import app
import os
import shutil

# Configure Freezer to use the build directory
app.config['FREEZER_DESTINATION'] = 'build'
freezer = Freezer(app)

@freezer.register_generator
def url_generator():
    yield 'index', {}
    yield 'about', {}
    yield 'skills', {}
    yield 'contact', {}

if __name__ == '__main__':
    # Clean previously generated files if they exist
    if os.path.exists('build'):
        shutil.rmtree('build')

    # Generate new static files
    freezer.freeze()
