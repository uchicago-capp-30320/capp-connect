# capp-connect
CAPP Connect Project Repo
Project members: Alison Spencer, Paula Cadena, 

### Instructions to Run the Project

The below is credited to Michael Plunkett, 2024 CAPP TA

1. Download uv: [link](https://docs.astral.sh/uv/).
2. Go into the base directory of the repository and type `make env` into the terminal.
3. Use the `make run` command.

### Technical Notes
- Any new modules should be added via the `uv add [module]` command.
  - Example: `uv add pre-commit`

## Standard Commands
- `make create-requirements`: Creates and/or updates the `requirements.txt` file.
- `make env`: Creates or activates a `uv` virtual environment.
- `make lint`: Runs `pre-commit`.
- `make run`: Runs the `main` function in the `project` folder.
- `make test`: Runs test cases in the `tests` directory.
