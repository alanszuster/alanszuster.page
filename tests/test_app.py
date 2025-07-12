import pytest
import sys
import os

# Add the parent directory to the path to import app
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app


@pytest.fixture
def client():
    """Create a test client for the Flask application."""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


def test_index_route(client):
    """Test that the index route returns 200 and contains expected content."""
    response = client.get('/')
    assert response.status_code == 200
    assert b'Alan Szuster' in response.data
    assert b'Site Reliability Engineer' in response.data


def test_index_route_contains_current_year(client):
    """Test that the index route contains the current year."""
    from datetime import datetime
    current_year = str(datetime.now().year)

    response = client.get('/')
    assert response.status_code == 200
    assert current_year.encode() in response.data


def test_static_files_accessible(client):
    """Test that static files are accessible."""
    # Test CSS file
    response = client.get('/static/css/main.css')
    assert response.status_code == 200

    # Test JS file
    response = client.get('/static/js/main.js')
    assert response.status_code == 200


def test_404_handling(client):
    """Test that 404 errors are handled appropriately."""
    response = client.get('/nonexistent-page')
    assert response.status_code == 404
