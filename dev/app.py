from flask import Flask, render_template
import random
import string

app = Flask(__name__)

GRID_SIZE = 10
WORDS = ["run", "hide", "seek"]

def generate_empty_grid():
    return [['' for _ in range(GRID_SIZE)] for _ in range(GRID_SIZE)]

def place_word(grid, word):
    directions = [(0, 1), (1, 0), (1, 1)]  # horizontal, vertical, diagonal
    word_length = len(word)
    direction = random.choice(directions)
    row, col = random.randint(0, GRID_SIZE - 1), random.randint(0, GRID_SIZE - 1)

    for _ in range(100):  # Try at most 100 times to find a suitable position
        if all(0 <= row + direction[0]*i < GRID_SIZE and 0 <= col + direction[1]*i < GRID_SIZE and
               (grid[row + direction[0]*i][col + direction[1]*i] == '' or grid[row + direction[0]*i][col + direction[1]*i] == word[i])
               for i in range(word_length)):
            for i in range(word_length):
                grid[row + direction[0]*i][col + direction[1]*i] = word[i]
            return True
        else:
            row, col = random.randint(0, GRID_SIZE - 1), random.randint(0, GRID_SIZE - 1)

    return False

def fill_grid_with_random_letters(grid):
    letters = string.ascii_uppercase
    for i in range(GRID_SIZE):
        for j in range(GRID_SIZE):
            if grid[i][j] == '':
                grid[i][j] = random.choice(letters)
    return grid

def generate_word_search_grid():
    grid = generate_empty_grid()
    for word in WORDS:
        placed = place_word(grid, word.upper())
        if not placed:
            print(f"Unable to place the word '{word}' on the grid.")
    filled_grid = fill_grid_with_random_letters(grid)
    return filled_grid

@app.route('/')
def generate_wordsearch():
    grid = generate_word_search_grid()
    return render_template('index.html', grid=grid)

if __name__ == '__main__':
    app.run(debug=True)
