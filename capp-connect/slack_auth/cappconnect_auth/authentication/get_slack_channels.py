#this code comes from: https://api.slack.com/messaging/retrieving
import logging
import os
# Import WebClient from Python SDK (github.com/slackapi/python-slack-sdk)
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError

# WebClient instantiates a client that can call API methods
# When using Bolt, you can use either `app.client` or the `client` passed to listeners.
client = WebClient(token=os.environ.get("SLACK_BOT_TOKEN"))
logger = logging.getLogger(__name__)

def retrieve_messages(): 
    '''
    This code goes through a list of channels where the bot is added and returns the 
    conversation ids to us in the form of a dictionary where the key is the channel name 
    and the value is the channel id. 
    '''
    channel_names = ["capp-connect-jobs-channel", "capp-connect-projects-channel",
    "capp-connect-general-channel", "capp-connect-events-channel"]
    conversation_id_dict ={}
    try:
        for result in client.conversations_list(types="public_channel,private_channel"):
            for channel in result["channels"]:
                if channel["name"] in channel_names:  
                    conversation_id_dict[channel["name"]] = channel["id"]

    except SlackApiError as e:
        print(f"Error: {e}")
    return conversation_id_dict

if __name__ == "__main__":
    ids = retrieve_messages()
    print(ids)
