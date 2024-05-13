'''
This file is used to test the Flask environment and the server.
'''

from flask import Flask, render_template, request

from app import app


# Test environment configuration
@app.route('/')
def hello_world():
    return '''
        <h1>Flask is running correctly!</h1>
        <h1>You've reached the backend server of the project!</h1>
        ''', 200


# Test get request
@app.route('/testget', methods=['GET'])
def test_get():
    return 'Response from GET request'


@app.route('/login', methods=['GET', 'POST'])
def login():
    data = request.get_json()
    print(data)
    return data
