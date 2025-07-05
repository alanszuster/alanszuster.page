from flask_frozen import Freezer
from app import app
import os
import shutil

app.config['FREEZER_DESTINATION'] = 'build'
freezer = Freezer(app)

@freezer.register_generator
def url_generator():
    yield 'index', {}

if __name__ == '__main__':
    if os.path.exists('build'):
        shutil.rmtree('build')

    # Generate new static files
    freezer.freeze()
