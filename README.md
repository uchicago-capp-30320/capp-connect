# capp-connect
CAPP Connect Project Repo
Project members: Amber Avila, Lee-Or Bentovim, Paula Cadena, Kiran Jivnani, Gregory Mitchell, and Alison Spencer
Instructor: James Turk

This project seeks to serve current, former, and future MS-CAPP students at the University of Chicago by creating a more user-friendly and cohesive space for collaboration on projects, sharing of events, and searching for future job opportunities. It continues to be a work in progress, and we would love your support.

### Instructions to Start Working in the project


1. Clone the project with ssh: `git clone git@github.com:uchicago-capp-30320/capp-connect.git`
2. Download uv: [link](https://docs.astral.sh/uv/).
3. Download Node.js and npm: [link](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
4. Go into the base directory of the repository and type `make env` into the terminal.
5. `cd` into `capp-connect/frontend` and run `npm install`
6. `cd` into `capp-connect/backend` and create a `.env` file with the keys found in `.env.example`

### Connecting to the server to run the app:
1. Connect to the server using the command: `ssh -p 2222 capp-connect@turing.unnamed.computer`
2. `cd` one layer into the capp-connect root
3. Create a new uv virtual environment: `source .venv/bin/activate`
4. Run ```cd capp-connect/frontend && \
		npx expo export --platform web --output-dir static && \
		if [ -d ../backend/ccserver/static ]; then rm -r ../backend/ccserver/static; fi && \
		mv static ../backend/ccserver/```
5. `cd` back to the root `cd ../..`
6. Run `python capp-connect/backend/manage.py runserver 0.0.0.0:8010`
7. Then go to this [link](https://capp-connect.unnamed.computer/auth/login/slack/) to login and start using the app


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
