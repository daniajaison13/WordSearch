## Steps to build the project
1. Clone the WordSearch repo
2. Open the WordSearch folder from Visual Studio Code

# Frontend
The frontend is developed using Node.js, currently undergoing active testing with version 18.16. Setting it up manually is straightforward and involves the following steps.

1. Download and Install Node.js
   - Download link: [Node.js](https://nodejs.org/en) (Choose the "Recommended For Most Users" version).
   - After installation, validate by opening a terminal and typing `node -v`. You should see the version number if Node.js is installed correctly.

2. Install Required Dependencies
   - Commands are the same for Windows, MacOS, and Linux.
   - Navigate to the project folder in the terminal (e.g., `<Your Local Path>/WordSearch/`).
   - Change directory to the source -> Node.js client folder: `cd src/client`.
   - Install dependencies: `npm install`.

3. Start the Node.js Client
   - Once all dependencies are installed without errors, start the frontend Node.js client with either of the commands:
     - `npm run start:dev` for the development environment.
   - Wait for the client to start. Once all services are up, a new page will open in the default browser.

# Backend
The backend is constructed using pure Python and the popular microframework Flask. It's currently actively tested with Python 3.11, Python 3.10, and Flask 2.3.2. The manual setup process involves the following steps.

1. Download and Install Python
   - Download Link: [Python](https://www.python.org/downloads/) (Choose the newest version of either 3.11 or 3.10).

2. Install Virtual Environment (Recommended But Not Required)
   - Navigate to the project folder in the terminal (e.g., `<Your Local Path>/CSS566-Final-Project/`).
   `python -m venv env`
   `source ./env/bin/activate`

3. Install Required Packages
   - Make sure you have the `requirements.txt` file in the `src` folder.
   - Ensure your terminal is in the `src` folder and then install all required packages using `pip install -r requirements.txt`.
   Install certifi `python3 -m pip install certifi`

4. Start the Flask Server
   - Once all packages are installed and you are still in the `src` folder, start the Flask application using the provided commands based on your OS.
   - python3 app.py
   - Navigate to `http://127.0.0.1:5000/` in your browser to verify if the Flask application is running correctly.
