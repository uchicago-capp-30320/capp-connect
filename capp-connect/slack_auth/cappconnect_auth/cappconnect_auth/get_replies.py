
import logging
import os
# Import WebClient from Python SDK (github.com/slackapi/python-slack-sdk)
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError
from authentication.get_channel_history import get_ts

# WebClient instantiates a client that can call API methods
# When using Bolt, you can use either `app.client` or the `client` passed to listeners.
client = WebClient(token=os.environ.get("SLACK_BOT_TOKEN"))
logger = logging.getLogger(__name__)

def get_replies(limit=100):
    channel_id_list = ["C08QT9ZUJA0", "C08RR4NJNHK", "C08RWUE8ZKN", "C08S5MWNW3T"]
    ts_set = get_ts()

    for channel in channel_id_list:
        for ts in ts_set:
            try:
                response = client.conversations_replies(
                    channel=channel,
                    ts=ts,
                    limit=limit
                )
                print(f"Replies for channel {channel} and ts {ts}:")
                print(response["messages"])
            except SlackApiError as e:
                logger.error(f"Error fetching replies for channel {channel}, ts {ts}: {e}")

# Run the function if this file is executed
if __name__ == "__main__":
    get_replies()
