"""
This file holds all the Django settings for the authorization process for Capp
Connect.
Relevant information/to do::
- All secret keys are currently imported to the environment
- When dev is over we need to change DEBUG to False
- Need to change to server.
- Add DB here!
"""

from pathlib import Path

from slack_auth.config import DB_PASSWORD, DJANGO_SECRET_KEY
from slack_auth.config import SLACK_CLIENT_ID as _SLACK_CLIENT_ID
from slack_auth.config import SLACK_CLIENT_SECRET as _SLACK_CLIENT_SECRET
from slack_auth.config import SLACK_REDIRECT_URI as _SLACK_REDIRECT_URI


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# See https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/
SECRET_KEY = DJANGO_SECRET_KEY

DEBUG = True

ALLOWED_HOSTS = [
    "capp-connect.unnamed.computer",
    "localhost",
    "127.0.0.1",
]

# Application definition
INSTALLED_APPS = [
    "allauth",
    "allauth.account",
    "allauth.socialaccount",  # kj added the top 3 for allauth
    "allauth.socialaccount.providers.slack",  # added slack in...#2
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
    "allauth.account.middleware.AccountMiddleware",  # kj added
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
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "capp_connect",
        "USER": "capp_connect",
        "PASSWORD": DB_PASSWORD,
        "HOST": "turing.unnamed.computer",
        "PORT": "5432",
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

# adding authentication backend here:
AUTHENTICATION_BACKENDS = ["django.contrib.auth.backends.ModelBackend"]

# adding the social account-ours = Slack!
SOCIALACCOUNT_PROVIDERS = {"slack": {"SCOPE": ["openid", "email", "profile"]}}

ACCOUNT_SIGNUP_FIELDS = []
ACCOUNT_EMAIL_VERIFICATION = "none"
SOCIALACCOUNT_QUERY_EMAIL = True
SOCIALACCOUNT_AUTO_SIGNUP = True
SITE_ID = 1

CSRF_TRUSTED_ORIGINS = [
    "https://capp-connect.unnamed.computer",
    "https://capp-connect.unnamed.computer:8010",
]
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

LOGIN_REDIRECT_URL = "/"
LOGOUT_REDIRECT_URL = "/"

SLACK_CLIENT_ID = _SLACK_CLIENT_ID  # noqa: F401
SLACK_CLIENT_SECRET = _SLACK_CLIENT_SECRET  # noqa: F401
SLACK_REDIRECT_URI = _SLACK_REDIRECT_URI  # noqa: F401

# Using our custom version
SOCIALACCOUNT_ADAPTER = "authentication.adapters.SlackSocialAccountAdapter"
