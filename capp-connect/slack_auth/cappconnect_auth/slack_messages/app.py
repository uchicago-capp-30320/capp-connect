from slack_bolt import App
from slack_bolt.oauth.oauth_settings import OAuthSettings
from slack_bolt.oauth.internals import FileInstallationStore
import os

installation_store = FileInstallationStore(base_dir="./slack_install")
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


