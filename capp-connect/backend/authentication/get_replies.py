import logging
import os

from get_channel_history import convo_history

# Import WebClient from Python SDK (github.com/slackapi/python-slack-sdk)
from slack_sdk import WebClient


# WebClient instantiates a client that can call API methods
# When using Bolt, you can use either `app.client` or the `client` passed to listeners.
client = WebClient(token=os.environ.get("SLACK_BOT_TOKEN"))
logger = logging.getLogger(__name__)

conversation_history = convo_history()


def get_replies(conversation_history, limit=100):
    for channel_id, messages in conversation_history.items():
        for msg in messages:
            if msg.get("reply_count", 0) > 0:
                ts = msg["ts"]
                response = client.conversations_replies(
                    channel=channel_id, ts=ts, limit=limit
                )
                for reply in response.get("messages", [])[1:]:
                    print(reply)


if __name__ == "__main__":
    get_replies(conversation_history, limit=100)
