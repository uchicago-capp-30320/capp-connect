"""
This file holds all the Django settings for the authorization process for Capp
Connect.
Relevant information/to do::
- All secret keys are currently imported to the environment
- When dev is over we need to change DEBUG to False
- Need to change to server.
- Add DB here!
"""

import os
from pathlib import Path


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# See https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/
SECRET_KEY = os.environ.get(
    "DJANGO_SECRET_KEY"
)  # kj changed this. Before the key was out in the open.

DEBUG = True

ALLOWED_HOSTS = [
    "capp-connect.unnamed.computer",
]  # the server is nOT added because it is HTTP. waiting for James to see if I can use nginx

# Application definition
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "authentication",  # kj added and edited imports in views.py and urls.py
]  # source: https://www.geeksforgeeks.org/user-authentication-system-using-django/

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "cappconnect_auth.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "cappconnect_auth.wsgi.application"

# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",  # ours is postgres not sqlite which is default! needs to be changed!!!
        "NAME": BASE_DIR
        / "db.sqlite3",  # added our db here #going to add more in next iteration...rn tests passing with this.
    }
}


AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/
LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/
STATIC_URL = "static/"

# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

SLACK_CLIENT_ID = os.environ.get("SLACK_CLIENT_ID")
SLACK_REDIRECT_URI = os.environ.get("SLACK_REDIRECT_URI")
SLACK_CLIENT_SECRET = os.environ.get("SLACK_CLIENT_SECRET")
