from slack_bolt import App
from slack_bolt.oauth.oauth_settings import OAuthSettings
from slack_bolt.oauth.internals import FileInstallationStore
import os
import logging
logging.basicConfig(level=logging.DEBUG)

print("Current working directory:", os.getcwd())
INSTALL_STORE_PATH = "/home/capp-connect/capp-connect/capp-connect/slack_auth/cappconnect_auth/slack_install"
print("Using FileInstallationStore at:", INSTALL_STORE_PATH)

installation_store = FileInstallationStore(base_dir=INSTALL_STORE_PATH)
oauth_settings = OAuthSettings(
    client_id=os.environ["SLACK_CLIENT_ID"],
    client_secret=os.environ["SLACK_CLIENT_SECRET"],
    scopes=["channels:history", "app_mentions:read", "chat:write"],
    installation_store=installation_store,
    redirect_uri=os.environ["SLACK_REDIRECT_URI"],
)

app = App(
    signing_secret=os.environ["SLACK_SIGNING_SECRET"],
    oauth_settings=oauth_settings,
)


@app.event("message")
def get_events(event): 
    print("we are here")
    print(event)
    #KJ TO UNCOMMENT THIS ONCE WE CONNECT TO DB!!!
    # from models import Event
    # Event.objects.create(
    # type = event.get("type"),
    # channel = event.get("channel"),
    # user = event.get("user"),
    # text = event.get("text"),
    # ts = event.get("ts"),
    # edited = event.get("edited"),
    # is_starred=event.get("is_starred", False),
    # pinned_to = event.get("pinned_to"),
    # reactions= event.get("reactions")
    # )

@app.middleware  # just for debugging
def log_request(logger, body, next):
    logger.debug(body)
    return next()

if __name__ == "__main__":
    from slack_bolt.adapter.socket_mode import SocketModeHandler
    print("Bolt running")
    SocketModeHandler(app, os.environ["SLACK_APP_TOKEN"]).start()
