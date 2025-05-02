# capp-connect
CAPP Connect Project Repo

### Instructions to Run the Project

The below is credited to Michael Plunkett, 2024 CAPP TA

1. Download uv: [link](https://docs.astral.sh/uv/).
2. Download Node.js and npm: [link](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
2. Go into the base directory of the repository and type `make env` into the terminal.
3. Use the `make run-all` command.

### Technical Notes
- Any new Python modules should be added via the `uv add [module]` command.
  - Example: `uv add pre-commit`
- Any new JavaScript/React.js/Node.js modules should be added via the `npm install [module]` command in the root directory.
  - Example: `npm install react`

## Standard Commands
- `make create-requirements`: Creates and/or updates the `requirements.txt` file.
- `make env`: Creates or activates a `uv` virtual environment. Also installs the npm dependencies for the project.
- `make lint`: Runs `pre-commit`.
- `make frontend`: Runs the frontend React Native project with Expo Go.
- `make run-all`: Runs the `main` function in the `project` folder in parallel with starting the node.js development server for the frontend app.
- `make test`: Runs test cases in the `tests` directory.
