import os
from pathlib import Path

from dotenv import load_dotenv


load_dotenv(dotenv_path=Path(__file__).resolve().parent / ".env")

SLACK_CLIENT_ID = os.environ["SLACK_CLIENT_ID"]
SLACK_CLIENT_SECRET = os.environ["SLACK_CLIENT_SECRET"]
SLACK_SIGNING_SECRET = os.environ["SLACK_SIGNING_SECRET"]
SLACK_REDIRECT_URI = os.environ["SLACK_REDIRECT_URI"]
DJANGO_SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]
SLACK_APP_TOKEN = os.environ["SLACK_APP_TOKEN"]
DB_PASSWORD = os.environ["DB_PASSWORD"]
