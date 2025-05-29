import logging
import os
from get_channel_history import convo_history, get_ts
from slack_sdk import WebClient


client = WebClient(token=os.environ.get("SLACK_BOT_TOKEN"))
logger = logging.getLogger(__name__)

###############################################################################
#Documentation: https://api.slack.com/methods/conversations.replies
###############################################################################



conversation_history = convo_history()
def get_replies(conversation_history, limit=100):
    """
    This function gets all the replies from the Slack messages that have them. 
    Inputs: 
        conversation_history (dict): dictionary of Slack channel messages returned by the function 
        convo_history() in get_channel_history.py 

        limit: set to 100
    
    Output: None. List of replies is printed.
    """
    replies = []
    ts_set = get_ts()

    for channel_id, messages in conversation_history.items():
        for msg in messages:
            if msg.get("ts") in ts_set:
                ts = msg["ts"]
                response = client.conversations_replies(
                    channel=channel_id, ts = msg["ts"], limit= limit
                )
                replies.extend(response.get("messages", [])[1:])
    print(replies)


if __name__ == "__main__":
    get_replies(conversation_history, limit=100)
