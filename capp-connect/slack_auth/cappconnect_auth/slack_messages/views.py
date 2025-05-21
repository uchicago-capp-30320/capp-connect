from django.shortcuts import render

# Create your views here.

from django.http import HttpResponse, HttpResponseRedirect
from slack_bolt.adapter.django import SlackRequestHandler
from slack_bolt.oauth.internals import FileInstallationStore
from slack_bolt.oauth.oauth_settings import OAuthSettings
from slack_bolt import App
import os

INSTALL_STORE_PATH = "/home/capp-connect/capp-connect/capp-connect/slack_auth/cappconnect_auth/slack_install"

# Setup FileInstallationStore (make sure this path exists)
installation_store = FileInstallationStore(base_dir=INSTALL_STORE_PATH)

# Setup OAuthSettings
oauth_settings = OAuthSettings(
    client_id=os.environ["SLACK_CLIENT_ID"],
    client_secret=os.environ["SLACK_CLIENT_SECRET"],
    scopes=["channels:history", "app_mentions:read"],  # minimal scopes for reading messages
    installation_store=installation_store,
    redirect_uri=os.environ["SLACK_REDIRECT_URI"],
)

app = App(
    signing_secret=os.environ["SLACK_SIGNING_SECRET"],
    oauth_settings=oauth_settings,
)
slack_handler= SlackRequestHandler(app)

def slack_install(request):
    install_url = app.oauth_flow.installation_url(
        redirect_uri=app.oauth_settings.redirect_uri,
        state=None  # optional: you can generate & validate a CSRF-protecting state string
    )
    return HttpResponseRedirect(install_url)

def slack_oauth_redirect(request):
    print("slack install called")
    return slack_handler.handle(request)
