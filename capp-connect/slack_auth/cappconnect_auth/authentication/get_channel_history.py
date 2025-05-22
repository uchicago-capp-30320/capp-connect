import logging
import os
# Import WebClient from Python SDK (github.com/slackapi/python-slack-sdk)
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError

# WebClient instantiates a client that can call API methods
# When using Bolt, you can use either `app.client` or the `client` passed to listeners.
client = WebClient(token=os.environ.get("SLACK_BOT_TOKEN"))
logger = logging.getLogger(__name__)

def convo_history():
    """
    Store the conversation history in a dict where they key is the channel id and the item is a list of dict. 
    output: dict 
    #edit this more! 
    """

 
    conversation_history = {}
    channel_id_list = ["C08QT9ZUJA0", "C08RR4NJNHK", "C08RWUE8ZKN","C08S5MWNW3T"] #for kj info the order is: general, projects, jobs, events 
    

    try:
        # Call the conversations.history method using the WebClient
        # conversations.history returns the first 100 messages by default
        # These results are paginated, see: https://api.slack.com/methods/conversations.history$pagination
        for channel_id in channel_id_list: 
            result = client.conversations_history(channel=channel_id)
            conversation_history[channel_id] = result["messages"]

        # Print results
            logger.info("{} messages found in {}".format(len(conversation_history), channel_id))


    except SlackApiError as e:
        logger.error("Error creating conversation: {}".format(e))
    return conversation_history

def get_ts():
    conversation_history = convo_history()
    ts_set = set()  
    for key, item_list in conversation_history.items():  
        for dict_ in item_list: 
            for k, i in dict_.items():
                if k == "ts":
                    ts_set.add(i)
    return ts_set


if __name__ == "__main__":
    history = convo_history()
    print(history)
    ts_set = get_ts()
    print(ts_set) #need this for get_replies.py
