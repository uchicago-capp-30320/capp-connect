# Helpful link from Michael if we want to build this further
# Here is some general information on Makefile's so that you can grow this out:
# https://www.gnu.org/software/make/manual/html_node/Introduction.html
default: create-requirements lint

.PHONY: env
env:
	uv venv
# Install JavaScript dependencies (uses package.json and package-lock.json)
	cd capp-connect/frontend && npm install

.PHONY: lint
lint:
	uv run pre-commit run --all-files

.PHONY: create-requirements
create-requirements:
	uv pip compile --generate-hashes pyproject.toml > requirements.txt

.PHONY: test
test:
	uv run pytest -vs tests/

.PHONY: test-and-fail
test-and-fail:
	uv run pytest -vsx tests/

# one proposed way of running this in parallel
# https://stackoverflow.com/questions/48047276/makefile-for-running-django-backend-and-react-frontend
.PHONY: backend
backend:
# uv run python -m capp-connect
	cd capp-connect/backend && uv run python manage.py runserver 8080

.PHONY: frontend
frontend:
	cd capp-connect/frontend && npx expo start --tunnel

.PHONY: run-all
run-all:
	make backend & make frontend

.PHONY: install
install:
	uv pip install -r requirements.txt
