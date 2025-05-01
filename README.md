# capp-connect
CAPP Connect Project Repo
Project members: Amber Avila, Lee-Or Bentovim, Paula Cadena, Kiran Jivnani, Gregory Mitchell, and Alison Spencer
Instructor: James Turk

This project is a work in progress. [Link to Notion](https://www.notion.so/Projects-Tasks-1d50e856f08380bdb819cc3870547466)

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
- `make env`: Creates or activates a `uv` virtual environment.
- `make lint`: Runs `pre-commit`.
- `make run`: Runs the `main` function in the `project` folder.
- `make test`: Runs test cases in the `tests` directory.
