import logging
import os

from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError


client = WebClient(token=os.environ.get("SLACK_BOT_TOKEN"))
logger = logging.getLogger(__name__)

################################################################################
# Documentation:
# https://api.slack.com/messaging/retrieving
################################################################################


def retrieve_messages():
    """
    This code goes through a list of channels where the bot is added and returns the
    conversation ids to us as a dictionary.

    Input: none
    Output (dict): A dictionary where the key is the name of the Slack channel
    and the value is the channel id.
    """
    channel_names = [
        "capp-connect-jobs-channel",
        "capp-connect-projects-channel",
        "capp-connect-general-channel",
        "capp-connect-events-channel",
    ]
    conversation_id_dict = {}
    try:
        for result in client.conversations_list(
            types="public_channel,private_channel"
        ):
            for channel in result["channels"]:
                if channel["name"] in channel_names:
                    conversation_id_dict[channel["name"]] = channel["id"]

    except SlackApiError as e:
        print(f"Error: {e}")
    return conversation_id_dict


if __name__ == "__main__":
    ids = retrieve_messages()
    print(ids)
