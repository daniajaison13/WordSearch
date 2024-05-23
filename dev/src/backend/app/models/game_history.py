'''
This file contains MongoDB model - Game_History class.
'''
from datetime import datetime
import bson
from werkzeug.security import generate_password_hash, check_password_hash
import os
import sys

# TEST USE: to insert app into sys.path
this_path = os.path.abspath(os.path.join(
    os.path.dirname(os.path.realpath(__file__)), os.pardir, os.pardir))
sys.path.insert(0, this_path)
from app import app
from app.models import Game


class GameHistory:
    def __init__(self):
        self._collection = app.database['game_history']

    def create(
            self,
            user_id: str,
            game_id: str,
            start_time: datetime = None
    ):
        '''
        Create a game history with the given user_id, game_id, and start_time
        when user starts a game.

        Args:
            user_id (str): user id of the user who starts the game
            game_id (str): game id of the game that the user starts
            start_time (datetime): the time when the game data is requested

        Returns:
            inserted_id (str): inserted id of the game history if the game history is created successfully, None otherwise
        '''
        # create the game history in MongoDB
        game_history = {
            'user_id': bson.ObjectId(user_id) if user_id else None,  # user id
            'game_id': bson.ObjectId(game_id),  # game id
            'finished': False,  # whether the game is finished
            'valid_time_elapsed': False,  # whether the time_elapsed is valid
            'start_time': start_time if start_time else datetime.now(),  # the time when the game data is requested
            'end_time': None,  # the time when the game-finish request is received
            'attempts': 0,  # number of tries
            'score': 0,  # score
        }

        # insert the game history into MongoDB and get the inserted id
        try:
            inserted_id = self._collection.insert_one(game_history).inserted_id

            # if the game history is created successfully
            if inserted_id:
                return str(inserted_id)
            else:
                return None
        except Exception as e:
            print(e)
            return None
        
    def _calculate_score(self, time_elapsed: int, attempts: int, level: int):
        '''
        Private method to calculate the score by the given time_elapsed and attempts.

        Args:
            time_elapsed (int): time elapsed of the game in ms
            attempts (int): number of tries of the game
            level (int): level of the game

        Returns:
            int: score of the game
        '''
        base_score = 2000
        time_elapsed_penalty = 0.005 # penalty per ms
        attempts_penalty = 10 # penalty per attemp

        if level == 1:
            level_multiplier = 1
        elif level == 2:
            level_multiplier = 1.5
        elif level == 3:
            level_multiplier = 2

        # print(time_elapsed * time_elapsed_penalty)

        score = (base_score - time_elapsed * time_elapsed_penalty - attempts * attempts_penalty) * level_multiplier
        # to prevent negative score
        return max(0, score)
        

    def finish(
        self, 
        game_history_id: str,
        time_elapsed: str,
        attempts: int,
        end_time: datetime = None,
    ):
        '''
        Finished a game with the given game_history_id.

        - finished will be set to True
        - end_time will be set to the current time
        - attempts will be stored
        - time_elapsed will be validated by the game server
        - if time_elapsed is valid, score will be calculated and stored

        Score calculation see `self._calculate_score` method.

        ---

        Incomplete implementation warning:
        ---
        Should check if the game is finished with
        attempts > total number of words to find in this puzzle.

        If the attempts is smaller than the total number of words to find in this puzzle,
        the user is cheating.

        But for now, we will just calculate the score with the given attempts.
        Because we need to generate data for testing and we fon't
        have time to implement the rest algorithm.

        ---

        Args:
            game_history_id (str): game history id of the game to finish
            time_elapsed (str): time elapsed of the game to finish in ms
            attempts (int): number of tries of the game to finish
            end_time (datetime): the time when the game-finish request is received

        Returns:
            bool: True if the game is finished successfully, False otherwise
            score (int): score of the game if the game is finished successfully
            error_msg (str): error message if the game is not finished successfully
        '''
        # validate the given game_history_id
        game_history = self._collection.find_one({'_id': bson.ObjectId(game_history_id)})
        if not game_history:
            return False, 0, 'Invalid game history id'
        
        # validate if the game is already finished
        if game_history['finished']:
            return False, 0, 'Game is already finished'
        
        # validate the given time_elapsed
        valid_time_elapsed = False
        start_time = game_history['start_time']

        # convert the given time_elapsed to int
        try:
            time_elapsed = int(time_elapsed)
        except:
            return False, 0, 'Invalid time elapsed format'

        # compare the given time_elapsed with the actual time_elapsed
        if not end_time: end_time = datetime.now()
        # if the difference is less than 10 second, the given time_elapsed is valid
        actual_time_elapsed = (end_time - start_time).total_seconds() * 1000
        # print(actual_time_elapsed)
        if abs(time_elapsed - actual_time_elapsed) < 10000:
            valid_time_elapsed = True

        # calculate the score if the given time_elapsed is valid
        if valid_time_elapsed:
            # get the level of the game
            game = Game()
            level = game.get_game_level(game_history['game_id'])

            score = self._calculate_score(time_elapsed, attempts, level)

        # update the game history in MongoDB
        try:
            self._collection.update_one(
                {'_id': bson.ObjectId(game_history_id)},
                {
                    '$set': {
                        'finished': True,
                        'valid_time_elapsed': valid_time_elapsed,
                        'end_time': end_time,
                        'attempts': attempts,
                        'score': score if valid_time_elapsed else 0
                    }
                }
            )

            # if the game history is updated successfully
            return True, score if valid_time_elapsed else 0, None if valid_time_elapsed else 'Invalid time elapsed (cheating) detected'
        except Exception as e:
            return False, 0, str(e)
        
    def get_game_history_of_user(self, user_id: str):
        '''
        Get all the game histories of the given user.

        Args:
            user_id (str): user id of the user

        Returns:
            list: list of game histories of the user
        '''
        game_history = list(self._collection.find({'user_id': bson.ObjectId(user_id)}, {'user_id': 0}))
        finished_game_history = []  # List to store finished game histories

        if game_history:
            game = Game()

            for gh in game_history:
                # convert the ObjectId to str
                gh['game_history_id'] = str(gh['_id'])
                del gh['_id']

                gh['game_id'] = str(gh['game_id'])

                # get the game name of each game
                gh['game_name'] = game.get_game_name(gh['game_id'])

                # convert the start_time and end_time to str
                gh['start_time'] = gh['start_time'].strftime('%Y-%m-%d %H:%M:%S')
                gh['end_time'] = gh['end_time'].strftime('%Y-%m-%d %H:%M:%S') if gh['end_time'] else None

                # Add to finished_game_history if finished is True
                if gh.get('finished'):
                    finished_game_history.append(gh)

        return finished_game_history

    
    def validate(self, game_history_id: str):
        '''
        Validate if the game history exists.

        Args:
            game_history_id (str): game history id of the game history to validate

        Returns:
            bool: True if the game history exists, False otherwise
        '''
        if not self._collection.find_one({'_id': bson.ObjectId(game_history_id)}):
            return False
        return True
    
    def get(self, game_history_id: str):
        '''
        Get a game history by the given game_history_id.

        Args:
            game_history_id (str): game history id of the game history to get

        Returns:
            dict: game history of the given game_history_id,
            None if the game history does not exist
        '''
        game_history = self._collection.find_one({'_id': bson.ObjectId(game_history_id)})
        if game_history:
            # # convert the ObjectId to str
            # game_history['_id'] = str(game_history['_id'])

            # # if user_id is not None, convert the ObjectId to str
            # if game_history['user_id']:
            #     game_history['user_id'] = str(game_history['user_id'])

            # # convert the game_id to str
            # game_history['game_id'] = str(game_history['game_id'])

            return game_history
        
        return None
    
    def clean_unfinished_game_histories(self):
        '''
        Clean all the unfinished game histories that
        are created more than 2 hours ago.
        '''
        # get all the unfinished game histories
        game_histories = list(self._collection.find({'finished': False}))

        # get the current time
        current_time = datetime.now()

        # iterate through all the unfinished game histories
        count = 0
        for game_history in game_histories:
            # if the game history is created more than 2 hours ago
            if (current_time - game_history['start_time']).total_seconds() > 7200:
                # delete the game history
                self._collection.delete_one({'_id': game_history['_id']})
                count += 1

        print(f'{count} unfinished game histories are cleaned up')
        

            



if __name__ == '__main__':
    history = GameHistory()
    history.clean_unfinished_game_histories()



    
