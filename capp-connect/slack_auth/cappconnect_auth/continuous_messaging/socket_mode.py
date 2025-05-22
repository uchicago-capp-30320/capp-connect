import os
from slack_bolt import App
from slack_bolt.adapter.socket_mode import SocketModeHandler

# No signing_secret — not needed for Socket Mode!
app = App(
    token=os.environ["SLACK_BOT_TOKEN"],
    signing_secret=None, #just had to disbale in env!!! remmeber this!!!
    installation_store=None,
    authorize=None,
)

@app.message()
def get_msg(message, say):
    type = message.get("type")
    channel = message.get("channel")
    subtype = message.get("subtype")
    user = message.get("user")
    text = message.get("text")
    ts = message.get("ts") 
    edited = message.get("edited")

# {
# 	"type": "message",
# 	"channel": "C123ABC456",
# 	"user": "U123ABC456",
# 	"text": "Hello, world!",
# 	"ts": "1355517523.000005",
# 	"edited": {
# 		"user": "U123ABC456",
# 		"ts": "1355517536.000001"
# 	}
# }

    print("type:", type, "user:", user, "tect:", text, "channel:",channel, "ts:",ts)

if __name__ == "__main__":
    print("Starting Slack Socket Mode listener...")
    SocketModeHandler(app, os.environ["SLACK_APP_TOKEN"]).start()

### FOR NEXT STEPS: 

#for editing msgs: 
# @app.event("message")
# def handle_message_events(body, logger):
#     logger.info(body)


#for reactions! 
# Unhandled request ({'type': 'event_callback', 'event': {'type': 'reaction_added'}})
# ---
# [Suggestion] You can handle this type of event with the following listener function:

# @app.event("reaction_added")
# def handle_reaction_added_events(body, logger):
#     logger.info(body)

#deleting : 

# Unhandled request ({'type': 'event_callback', 'event': {'type': 'message', 'subtype': 'message_deleted'}})
# ---
# [Suggestion] You can handle this type of event with the following listener function:

# @app.event("message")
# def handle_message_events(body, logger):
#     logger.info(body)
