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
2. cd one layer in (this is the root of the non-server), then run `uv venv` followed by `source .venv/bin/activate`. You should be at the same level as the README for the entire duration of this process
3. `git checkout main` and `git pull` to ensure you have the most updated version of everything
4. Run the command `uv pip install -r requirements.txt`
5. You should no longer need to run `uv pip install django` and `uv pip install PyJWT` let Lee-Or know if that is still true
6. If this is your first time using the server, `nano .env` and fill in the values as seen in `.env.example`. Ask Kiran and Lee-Or for the secrets. Note: This may prove unneccessary, but keeping in for now
7. Run `python capp_connect/slack_auth/cappconnect_auth/manage.py runserver 0.0.0.0:8010` (may be python3 on your machine)
8. Then go to this [link](https://capp-connect.unnamed.computer/auth/login/slack/)

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
