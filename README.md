# capp-connect
CAPP Connect Project Repo
Project members: Amber Avila, Lee-Or Bentovim, Paula Cadena, Kiran Jivnani, Gregory Mitchell, and Alison Spencer
Instructor: James Turk

This project is a work in progress. [Link to Notion](https://www.notion.so/Projects-Tasks-1d50e856f08380bdb819cc3870547466)

### Instructions to Run the Project

The below is credited to Michael Plunkett, 2024 CAPP TA

1. Download uv: [link](https://docs.astral.sh/uv/).
2. Download Node.js and npm: [link](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
3. Go into the base directory of the repository and type `make env` into the terminal.
4. Use the `make run-all` command.

### Connecting to a development server 
Before starting the process ask Lee-Or or Kiran for the following variables and
use the command echo
To connect to a server for development you need to follow these steps: 
1. In your virtual environment run: brew install ngrok
2. Then create a Ngrok account and connect it to your Github. Use this [link](https://ngrok.com/) and select 
  sign up. 
3. When prompted register yourself as a student, and select the development option 
4. Run the config command in your account. It should start with: `ngrok config add-authtoken`
5. In a new terminal window, run: ngrok http 8000
6. Send Kiran or Lee-Or the https link that you see. One of them will update the
  CAPP slack redirect link. Reminder for them to hit save.
7. cd into `capp-connect/slack_auth/cappconnect_auth/`
8. Run export SLACK_REDIRECT_URI=,[your link here]/auth/callback/slack>
9. cd one level down into cappconnect_auth
10. Go to settings.py update the ALLOWED_HOSTS variable with the first portion after https:// 
11 . Cd back one level up. Use cd ..
12. Run python manage.py runserver
13. Then go to this [link](http://127.0.0.1:8000/auth/login/slack/)

### Technical Notes
- Any new Python modules should be added via the `uv add [module]` command.
  - Example: `uv add pre-commit`
- Any new JavaScript/React.js/Node.js modules should be added via the `npm install [module]` command in the root directory.
  - Example: `npm install react`

## Standard Commands
- `make create-requirements`: Creates and/or updates the `requirements.txt` file.
- `make env`: Creates or activates a `uv` virtual environment.
- `make lint`: Runs `pre-commit`.
- `make run`: Runs the `main` function in the `project` folder.
- `make test`: Runs test cases in the `tests` directory.


