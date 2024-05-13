'''
This file contains MongoDB model - Leaderboard class.
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
from app.models import Game, GameHistory, User


class Leaderboard:
    def __init__(self):
        self._collection = app.database['leaderboard']

    def create(self, game_id: str):
        '''
        Create a leaderboard with the given game_id.

        Args:
            game_id (str): game id of the game that the leaderboard belongs to

        Returns:
            bool: True if the leaderboard is created successfully, False otherwise
        '''
        # create the leaderboard
        leaderboard = {
            'game_id': bson.ObjectId(game_id),  # game id
            'game_name': Game().get_game_name(game_id),  # game name for convenience
            'last_updated': datetime.now(),  # last updated time
            'leaderboard': [],  # leaderboard
        }

        # insert the leaderboard
        try:
            self._collection.insert_one(leaderboard)
            return True
        except:
            return False

    def init(self):
        '''
        Initialize the leaderboard collection.

        This function should be called 
        1. when the server starts
        2. when a new game is created


        We currently have 2 game modes: normal game and today's reward game.
        Everyday we create a new today's reward game, and normal game has
        3 levels, each level has multiple games.

        For each game above, we have a leaderboard for it.
        The game is distinguished by the game_id.

        When initializing the leaderboard collection, we check if each
        game has a leaderboard, if not, we create one.
        '''
        # get all games
        game = Game()
        all_games = game.get_all_games()

        total_game_cnt = 0
        total_current_leaderboard_cnt = self._collection.count_documents({})
        new_leaderboard_created_cnt = 0

        for each_game in all_games:
            total_game_cnt += 1
            
            # get the game id
            game_id = str(each_game['_id'])

            # check if the game has a leaderboard
            if not self.get_leaderboard_by_game_id(game_id):
                # if the game does not have a leaderboard, create one
                self.create(game_id)
                new_leaderboard_created_cnt += 1

        print('Leaderboard collection initialized.')
        print(f'Total game count: {total_game_cnt}')
        print(f'Total current leaderboard count: {total_current_leaderboard_cnt}')
        print(f'New leaderboard created count: {new_leaderboard_created_cnt}')

    def insert_score(self, game_history_id: str, anonymous: bool = False):
        '''
        Insert a record into one leaderboard record by given game history id.
        For each game, we only keep the top N scores.

        Args:
            game_history_id (str): game history id of the game history that the score belongs to

        Returns:
            bool: True if the score is inserted successfully, False otherwise
            error (str): error message if there is any
        '''
        TOP_N = 50  # only keep the top 50 scores

        game_history = GameHistory()
        game_history_record = game_history.get(game_history_id)

        # validate
        if not game_history_record:
            return False, 'Game history record does not exist.'
        
        # check if the game history record is already in the leaderboard
        exist = self._collection.find_one({
            'game_id': game_history_record['game_id'],
            'leaderboard': {'$elemMatch': {'game_history_id': bson.ObjectId(game_history_id)}}
        })
        if exist:
            return False, 'Game history record already exists in the leaderboard.'
        
        # construct the leaderboard record to be inserted

        # get some information from the game history record
        username = None
        if game_history_record['user_id']:
            user = User()
            username = user.get_username(game_history_record['user_id'])

        leaderboard_record = {
            # the essential part
            'game_history_id': bson.ObjectId(game_history_id), 
            'anonymous': anonymous,  # whether the user wants to be anonymous

            # below are some extra information for convenience
            # so we don't need to query the game history collection again
            'username': username,
            'score': game_history_record['score']
        }

        # get the leaderboard
        leaderboard = self._collection.find_one({'game_id': bson.ObjectId(game_history_record['game_id'])})
        leaderboard_id = leaderboard['_id']

        # check if the current score is lower than the lowest score in the leaderboard
        # if so, we don't need to insert the record into the leaderboard
        if len(leaderboard['leaderboard']) >= TOP_N:
            lowest_score = leaderboard['leaderboard'][-1]['score']
            if leaderboard_record['score'] < lowest_score:
                return False, 'Score is not high enough to be inserted into the leaderboard.'

        # insert the record into the leaderboard and sort the leaderboard
        # also check if the leaderboard contains more than TOP_N records, if so, remove the last one
        # update the last updated time as well
        try:
            self._collection.update_one(
                {'_id': leaderboard_id},
                {
                    '$push':{
                        'leaderboard': {
                            '$each': [leaderboard_record],
                            '$sort': {'score': -1},
                            '$slice': TOP_N
                        }
                    },
                    '$set': {
                        'last_updated': datetime.now()
                    }
                }
            )
            return True, None
        except Exception as e:
            return False, 'Failed to insert score into leaderboard.'



    '''
    Getter functions
    '''
    def get_leaderboard_by_game_id(self, game_id: str):
        '''
        Get the leaderboard by the given game id
        and mask the username if the user wants to be anonymous.

        Args:
            game_id (str): game id of the game that the leaderboard belongs to

        Returns:
            leaderboard (dict): leaderboard of the given game id if the leaderboard exists, None otherwise
        '''
        # get the leaderboard from MongoDB
        # exclude id and game history id
        leaderboard = self._collection.find_one(
            {'game_id': bson.ObjectId(game_id)},
            {'_id': 0, 'leaderboard':{'game_history_id': 0}}
        )

        # convert the ObjectId to string, and remove the username if the user wants to be anonymous
        if leaderboard:
            leaderboard['game_id'] = str(leaderboard['game_id'])
            leaderboard['last_updated'] = leaderboard['last_updated'].strftime('%Y-%m-%d %H:%M:%S')

            for each_record in leaderboard['leaderboard']:
                # add rank
                each_record['rank'] = leaderboard['leaderboard'].index(each_record) + 1

                if each_record['anonymous']:
                    each_record['username'] = 'Anonymous'
                del each_record['anonymous']

        return leaderboard






if __name__ == '__main__':
    lb = Leaderboard()
    print(lb.get_leaderboard_by_game_id('646be65072bc5379c568bd4d'))

