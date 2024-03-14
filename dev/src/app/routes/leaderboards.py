'''
This file contains all endpoints for leaderboards.
'''
from flask import Flask, render_template, request, make_response, jsonify
from flask_jwt_extended import (
    create_access_token, create_refresh_token, jwt_required, get_jwt_identity, unset_jwt_cookies,
    get_jwt)

from app import app, API_URL_PREFIX
from app.models import User, GameHistory, Game, Leaderboard

@app.route(API_URL_PREFIX + '/leaderboard/sharescore/<game_history_id>', methods=['POST'])
@jwt_required(optional=True)
def leaderboard_share_score(game_history_id: str):
    '''
    When a game is finished and a score is calculated scuuessfully,
    we give users an option to share their score to the leaderboard.
    They can either share anonymously or share with their username.

    If the user is logged in, they can either share anonymously 
    or share with their username.
    If the user is not logged in, they can only share anonymously.

    ---

    `game_history_id` is provided in the URL path.

    `share_anonymously` is a boolean value in the request body.
    '''
    # validate and convert game_history_id to string
    if game_history_id:
        try:
            game_history_id = str(game_history_id)
        except Exception as e:
            return make_response(
                jsonify(dict(error='Game history id must be a string')),
                400
            )
    else:
        return make_response(
            jsonify(dict(error='Game history id is required in the path: /game/finish/<game_history_id>')),
            400
        )
    
    # validate if the game history exists
    game_history = GameHistory()
    game_history_data = game_history.get(game_history_id)
    print(f"Test: {game_history_data}")
    if not game_history_data:
        return make_response(
            jsonify(dict(error='Game history not found')),
            404
        )
    
    # validate if the game is finished
    if not game_history_data['finished']:
        return make_response(
            jsonify(dict(error='Game is not finished yet')),
            400
        )
    
    # get and validate the share_anonymously value
    share_anonymously = request.json.get('share_anonymously', None)
    if share_anonymously is None:
        return make_response(
            jsonify(dict(error='share_anonymously is required in the request body')),
            400
        )
    if not isinstance(share_anonymously, bool):
        return make_response(
            jsonify(dict(error='share_anonymously must be a boolean value')),
            400
        )
    print("before")
    # insert the record into the leaderboard
    leaderboard = Leaderboard()
    status, msg = leaderboard.insert_score(game_history_id, anonymous=share_anonymously)
    print("after")
    if status:
        return make_response(
            jsonify(dict(status=True)),
            201
        )
    else:
        return make_response(
            jsonify(dict(error=msg)),
            422
        )
    

@app.route(API_URL_PREFIX + '/leaderboard/get/<game_id>', methods=['GET'])
@jwt_required(optional=True)
def leaderboard_get_leaderboard(game_id):
    '''
    Get the leaderboard data by given game id.
    
    `game_id` is provided in the URL path.
    '''
    # validate and convert game_id to string
    if game_id:
        try:
            game_id = str(game_id)
        except Exception as e:
            return make_response(
                jsonify(dict(error='Game id must be a string')),
                400
            )
    else:
        return make_response(
            jsonify(dict(error='Game id is required in the path: /leaderboard/get/<game_id>')),
            400
        )
    
    # validate if the leaderboard exists
    try:
        leaderboard = Leaderboard()
        leaderboard_data = leaderboard.get_leaderboard_by_game_id(game_id)
    except Exception as e:
        return make_response(
            jsonify(dict(error=str(e))),
            404
        )

    if not leaderboard_data:
        return make_response(
            jsonify(dict(error='Leaderboard not found')),
            404
        )
    
    return make_response(
        jsonify(dict(leaderboard_data)),
        200
    )


@app.route(API_URL_PREFIX + '/leaderboard/landingpage', methods=['GET'])
@jwt_required(optional=True)
def leaderboard_landing_page():
    '''
    The `leaderboard_get_leaderboard()` function require a `game_id`
    to get the leaderboard of a specific game.

    However, when users land on the landing page, they don't have a game id.
    So in this function, we get a leaderboard data for landing page.

    Currently, we return the leaderboard of today's reward game.
    '''
    # get today's reward game id
    game = Game()
    todays_reward_game = game.get_todays_reward_game()
    if not todays_reward_game:
        return make_response(
            jsonify(dict(error='Today\'s reward game not found')),
            404
        )
    
    todays_reward_game_id = todays_reward_game['_id']

    # use the game id to get the leaderboard
    return leaderboard_get_leaderboard(todays_reward_game_id)

