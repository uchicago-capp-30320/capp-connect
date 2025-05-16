import os
from pathlib import Path

from dotenv import load_dotenv


load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / ".env")

SLACK_CLIENT_ID = os.environ["SLACK_CLIENT_ID"]
SLACK_CLIENT_SECRET = os.environ["SLACK_CLIENT_SECRET"]
SLACK_SIGNING_SECRET = os.environ["SLACK_SIGNING_SECRET"]
SLACK_REDIRECT_URI = os.environ["SLACK_REDIRECT_URI"]
DJANGO_SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]

print(f"DJANGO_SECRET_KEY: {DJANGO_SECRET_KEY}")
