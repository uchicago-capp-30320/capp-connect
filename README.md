# capp-connect
CAPP Connect Project Repo
Project members: Amber Avila, Lee-Or Bentovim, Paula Cadena, Kiran Jivnani, Gregory Mitchell, and Alison Spencer
Instructor: James Turk

This project is a work in progress. [Link to Notion](https://www.notion.so/Projects-Tasks-1d50e856f08380bdb819cc3870547466)

### Instructions to Run the Project

The below is credited to @michplunkett, 2024 CAPP TA

1. Download uv: [link](https://docs.astral.sh/uv/).
2. Download Node.js and npm: [link](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
3. Go into the base directory of the repository and type `make env` into the terminal.
4. Use the `make run` command.

### Connecting to the server to test auth:
1. Connect to the server using the command: `ssh -p 2222 capp-connect@turing.unnamed.computer`
2. Create a new uv virtual environment: `source .venv/bin/activate`
3. cd to `capp-connect/backend`
4. Run `python manage.py runserver 0.0.0.0:8010` (may be python3 on your machine)
5. Then go to this [link](https://capp-connect.unnamed.computer/auth/login/slack/)


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
- `make frontend-dev`: Runs a Node development server to serve the frontend React Native project with Expo Go.
- `make frontend-build`: Compiles the React code into static files currently located in frontend/static/.
- `make run`: Compiles React Native frontend app into static files and then runs the Django backend server, serving those static files and exposing endpoints.
- `make test`: Runs test cases in the `tests` directory.
