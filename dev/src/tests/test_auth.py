import json
import time
import uuid
import logging
from flask import Flask
from app import app  # Replace "app" with the name of your application module

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def log_test_duration(test_name, start_time):
    end_time = time.time()
    duration = end_time - start_time
    logger.info(f"{test_name} duration: {duration} seconds")

def test_api_status(client):
    start_time = time.time()
    response = client.get('/api/v0/status')
    log_test_duration("test_api_status", start_time)

    assert response.status_code == 200
    assert response.get_json() == {"status": "OK"}

def test_auth_register(client):
    username = 'testuser_' + str(uuid.uuid4())
    password = 'testpassword_' + str(uuid.uuid4())

    start_time = time.time()
    response = client.post('/api/v0/auth/register', json={'username': username, 'password': password})
    log_test_duration("test_auth_register", start_time)

    assert response.status_code == 200
    assert 'User registered successfully' in response.get_json().values()

    # Return the username and password so they can be used in other tests
    return username, password

def test_auth_login(client):
    username, password = test_auth_register(client)

    start_time = time.time()
    response = client.post('/api/v0/auth/login', json={'username': username, 'password': password})
    log_test_duration("test_auth_login", start_time)

    assert response.status_code == 200
    token = response.get_json().get('access_token')
    assert token is not None

    # Return the token so it can be used in other tests
    return token


def test_auth_user_profile(client):
    token = test_auth_login(client)

    start_time = time.time()
    headers = {'Authorization': f'Bearer {token}'}
    response = client.get('/api/v0/auth/user/profile', headers=headers)  # Update this line
    log_test_duration("test_auth_user_profile", start_time)

    assert response.status_code == 200
    assert 'username' in response.get_json()



def test_auth_logout(client):
    token = test_auth_login(client)

    start_time = time.time()
    response = client.post('/api/v0/auth/logout', headers={'Authorization': f'Bearer {token}'})
    log_test_duration("test_auth_logout", start_time)

    assert response.status_code == 200
    assert 'Sign out successful' in response.get_json().values()


def test_auth_delete_account(client):
    token = test_auth_login(client)

    start_time = time.time()
    response = client.delete('/api/v0/auth/deleteaccount', headers={'Authorization': f'Bearer {token}'})
    log_test_duration("test_auth_delete_account", start_time)

    assert response.status_code == 200
    assert 'User deleted successfully' in response.get_json().values()

if __name__ == "__main__":
    # Create a Flask test client
    client = app.test_client()

    # Call the test functions and execute the tests
    test_api_status(client)
    test_auth_register(client)
    test_auth_login(client)
    test_auth_user_profile(client)
    test_auth_logout(client)
    test_auth_delete_account(client)
