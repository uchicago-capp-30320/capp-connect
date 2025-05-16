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

### Connecting to the server:
 **You should only have to do this process once**
1. Connect to the server using the command: `ssh -p 2222 capp-connect@turing.unnamed.computer`
2. Create a new uv virtual environment (See Standard Commands for command if needed)
4. Run the command `uv pip install django`
5. Run the command `uv pip install PyJWT`
6. cd to the root of our project
7. Run `export SLACK_CLIENT_ID=<[slack_client_id]>` Ask Kiran or Lee-Or to securely share
8. Run `export SLACK_CLIENT_SECRET=<[slack_client_secret]>` Ask Kiran or Lee-Or to securely share
9. Run `export SLACK_SIGNING_SECRET=<[slack_signing_secret]>` Ask Kiran or Lee-Or to securely share
10. Run `export SLACK_REDIRECT_URI= <[url here]>` Ask Kiran or Lee-Or to securely share
11. Cd back one level up. Use cd ..
12. Run `python manage.py runserver 0.0.0.0:8010` (may be python3 on your machine)
13. Then go to this [link](https://capp-connect.unnamed.computer/auth/login/slack/)


### Connecting to a ngrock development server
Before starting the process ask Lee-Or or Kiran for the following variables and
use the command echo
To connect to a server for development you need to follow these steps:

**Before First use**
1. In your virtual environment run: brew install ngrok
2. Then create a Ngrok account and connect it to your Github. Use this [link](https://ngrok.com/) and select
  sign up.
3. When prompted register yourself as a student, and select the development option
4. Run the config command in your account. It should start with: `ngrok config add-authtoken`
5. uv pip install django
6. uv pip install PyJWT (we're working on streamlining all of this)


**Every time**
1. In a new terminal window, run: `ngrok http 8000`
2. Send Kiran or Lee-Or the https link that you see. One of them will update the
  CAPP slack redirect link. Reminder for them to hit save.
3. Go to a new terminal window and cd to the root of our project
4. Run `export SLACK_CLIENT_ID=<[slack_client_id]>` we will share securely
5. Run `export SLACK_CLIENT_SECRET=<[slack_client_secret]>` we will share securely
6. Run `export SLACK_SIGNING_SECRET=<[slack_signing_secret]>` we will share securely
7. Run export SLACK_REDIRECT_URI=<[your link here]/auth/callback/slack>
8. cd into `capp_connect/slack_auth/cappconnect_auth/cappconnect_auth`
10. Go to settings.py update the ALLOWED_HOSTS variable with the first portion after https://
11. Cd back one level up. Use `cd ..`
12. Run `python manage.py runserver` (may be python3 on your machine)
13. Then go to this [link](http://127.0.0.1:8000/auth/login/slack/)

### Technical Notes
- Any new Python modules should be added via the `uv add [module]` command.
  - Example: `uv add pre-commit`
- Any new JavaScript/React.js/Node.js modules should be added via the `npm install [module]` command in the root directory.
  - Example: `npm install react`

## Standard Commands
- `make create-requirements`: Creates and/or updates the `requirements.txt` file.
- `make install`: Installs all packages needed in `requirements.txt`
- `make env`: Creates or activates a `uv` virtual environment. Also installs the npm dependencies for the project.
- `make lint`: Runs `pre-commit`.
- `make frontend`: Runs the frontend React Native project with Expo Go.
- `make run-all`: Runs the `main` function in the `project` folder in parallel with starting the node.js development server for the frontend app.
- `make test`: Runs test cases in the `tests` directory.
