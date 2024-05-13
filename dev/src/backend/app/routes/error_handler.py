'''
This file contains all endpoints for handling errors.
To format the error response in a consistent way.
'''

from flask import Flask, render_template, request, make_response

from app import app, API_URL_PREFIX


@app.errorhandler(400)
def error_bad_request(e: Exception):
    '''
    Handle 400 Bad Request error.
    '''
    return make_response(
        dict(error=str(e)),
        400
    )


@app.errorhandler(401)
def error_unauthorized(e: Exception):
    '''
    Handle 401 Unauthorized error.
    '''
    return make_response(
        dict(error=str(e)),
        401
    )


@app.errorhandler(404)
def error_not_found(e: Exception):
    '''
    Handle 404 Not Found error.
    '''
    return make_response(
        dict(error=str(e)),
        404
    )


@app.errorhandler(405)
def error_method_not_allowed(e: Exception):
    '''
    Handle 405 Method Not Allowed error.
    '''
    return make_response(
        dict(error=str(e)),
        405
    )


@app.errorhandler(422)
def error_unprocessable_content(e: Exception):
    '''
    Handle 422 Unprocessable Content error.
    '''
    return make_response(
        dict(error=str(e)),
        422
    )

