'''
This file contains all endpoints for user auth and registration.
'''

from flask import Flask, render_template, request, make_response, jsonify
from flask_jwt_extended import (
    create_access_token, create_refresh_token, jwt_required, get_jwt_identity, unset_jwt_cookies,
    get_jwt)
from datetime import datetime
import json

from app import app, API_URL_PREFIX
from app.models import User, GameHistory


@app.route(API_URL_PREFIX + '/status', methods=['GET'])
@jwt_required(optional=True)
def api_status():
    '''
    API status endpoint, return OK if the API is running.
    If the user is logged in, return the user identity as well.
    '''
    # get the user identity
    user_identity = get_jwt_identity()

    # if the user is logged in, return the user identity
    if user_identity:
        return make_response(
            jsonify(dict(status='OK', user=user_identity)),
            200
        )
    
    # if the user is not logged in, return OK
    return make_response(
        jsonify(dict(status='OK')),
        200
    )


@app.route(API_URL_PREFIX + '/auth/login', methods=['POST'])
def auth_login():
    '''
    Create access token for the user.
    '''
    username = request.json.get('username', None)
    password = request.json.get('password', None)

    # validate request
    if not username or not password:
        return make_response(
            jsonify(dict(error='Username and password are required')),
            400
        )
    
    # validate user
    user = User()
    validated, error = user.validate(username, password)
    if not validated:
        return make_response(
            jsonify(dict(error=error)),
            401
        )

    # create the access token
    access_token = create_access_token(identity=username)

    return make_response(
        jsonify(dict(access_token=access_token)),
        200
    )


@app.route(API_URL_PREFIX + '/auth/logout', methods=['POST'])
def auth_logout():
    '''
    Logout the user.
    '''
    res = jsonify({'message': 'Sign out successful'})
    unset_jwt_cookies(res)
    return make_response(
        res,
        200
    )


@app.route(API_URL_PREFIX + '/auth/register', methods=['POST'])
def auth_register():
    '''
    Register a new user.
    '''
    username = request.json.get('username', None)
    password = request.json.get('password', None)

    # validate request
    if not username or not password:
        return make_response(
            jsonify(dict(error='Username and password are required')),
            400
        )
    
    # register user
    user = User()
    registered, error = user.create(username, password)
    
    if not registered:
        return make_response(
            jsonify(dict(error=error)),
            400
        )
    
    return make_response(
        jsonify(dict(message='User registered successfully')),
        200
    )


@app.route(API_URL_PREFIX + '/auth/deleteaccount', methods=['DELETE'])
@jwt_required()
def auth_delete_account():
    '''
    Delete the user account.

    Since this function is jwt_required, the user must be logged in.
    Therefore, we don't need to validate the user identity.
    '''
    # get the user identity
    user_identity = get_jwt_identity()

    # delete the user
    user = User()
    deleted, error = user.remove_user(user_identity)

    if not deleted:
        return make_response(
            jsonify(dict(error=error)),
            422
        )
    
    return make_response(
        jsonify(dict(message='User deleted successfully')),
        200
    )


@app.route(API_URL_PREFIX + '/auth/user/profile', methods=['GET'])
@jwt_required()
def auth_user_profile():
    '''
    Return the user profile.
    '''
    # get the user identity
    user_identity = get_jwt_identity()
    if not user_identity:
        return make_response(
            jsonify(dict(error='Invalid user identity')),
            401
        )

    user = User()
    user_profile = user.get_profile(user_identity)

    return make_response(
        jsonify(user_profile),
        200
    )


@app.route(API_URL_PREFIX + '/auth/user/gamehistory', methods=['GET'])
@jwt_required()
def auth_user_game_history():
    '''
    Get the user game history.
    '''
    # get the user identity
    user_identity = get_jwt_identity()
    if not user_identity:
        return make_response(
            jsonify(dict(error='Invalid user identity')),
            401
        )
    
    # get user id
    user = User()
    user_id = user.get_id(user_identity)

    # get game history related to the user
    history = GameHistory()
    game_history = history.get_game_history_of_user(user_id)

    return make_response(
        jsonify(game_history),
        200
    )


'''
Belower are helper functions, above are API endpoints.
'''


@app.after_request
def refresh_expiring_jwts(response):
    '''
    Automatically refresh the access token when it is about to expire.
    '''
    try:
        # get the expiration timestamp
        exp_timestamp = get_jwt()['exp']
        # print(get_jwt())
        # print(get_jwt_identity())
        now = datetime.now()
        target_timestamp = datetime.timestamp(
            now + app.config['JWT_REFRESH_DELTA'])

        # if the access token is about to expire, refresh it
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) == dict:
                data['access_token'] = access_token
                response.data = json.dumps(data)

    except (RuntimeError, KeyError):
        pass

    finally:
        return response
