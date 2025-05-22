import os
from slack_bolt import App
from slack_bolt.adapter.socket_mode import SocketModeHandler

#documentation so i don't forget: https://api.slack.com/tutorials/tracks/hello-world-bolt
#https://docs.slack.dev/reference/events
#https://tools.slack.dev/bolt-python/concepts/event-listening
# for changing msg: https://api.slack.com/events/message/message_changed



# No signing_secret — not needed for Socket Mode!
app = App(
    token=os.environ["SLACK_BOT_TOKEN"],
    signing_secret=None, #just had to disbale in env!!! remmeber this!!!
    installation_store=None,
    authorize=None,
)

@app.message()
def get_msg(message, say):
    type = message["type"]
    channel = message["channel"]
    user = message["user"]
    text = message["text"]
    ts = message["ts"]
    edited = message.get("edited") #using .get just in case this is None. rest follow documentation. 
    print("type:", type, "user:", user, "tect:", text, "channel:",channel, "ts:",ts, "if edited:",edited)
   
   
    

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


@app.event("message") #https://api.slack.com/events/message/message_changed
def record_changed_messages(body,logger):
    event = body["event"]
    if event["subtype"] == "message_changed": 
        channel = event["channel"]
        hidden = event["hidden"]
        ts = event["ts"]
        message = event.get("message", {})
        edited = message.get("edited", {})
        print("Edited text, time of edit, user who edited:", event["message"]["text"], event["message"]["edited"])

 
    
    


#     {
# 	"type": "message",
# 	"subtype": "message_changed",
# 	"hidden": true,
# 	"channel": "C123ABC456",
# 	"ts": "1358878755.000001",
# 	"message": {
# 		"type": "message",
# 		"user": "U123ABC456",
# 		"text": "Hello, world!",
# 		"ts": "1355517523.000005",
# 		"edited": {
# 			"user": "U123ABC456",
# 			"ts": "1358878755.000001"
# 		}
# 	}
# }

    
 



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
