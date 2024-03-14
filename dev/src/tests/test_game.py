import pytest
from flask import json
from app import app
from app.models import User, Game, GameHistory
from datetime import datetime


@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


def test_game_get_todays_reward_game(client):
    response = client.get('/api/v1/game/dailypuzzle')
    assert response.status_code == 404  # Expected 'No reward game found'


def test_game_get_random_game(client):
    level = 1
    response = client.get(f'/api/v1/game/normalpuzzle/{level}')
    assert response.status_code == 404  # Expected 'No game found'


def test_game_get_game_key_by_id(client):
    game_id = 'random_id'
    response = client.get(f'/api/v1/game/key/{game_id}')
    assert response.status_code == 404  # Expected 'No game found'


def test_game_finish_game(client):
    game_history_id = 'random_id'
    data = {
        'time_elapsed': 1000,
        'attempts': 5
    }
    response = client.post(f'/api/v1/game/finish/{game_history_id}', data=json.dumps(data), content_type='application/json')
    assert response.status_code == 404  # Expected 'Game history not found'


# ... Add more tests for other endpoints
