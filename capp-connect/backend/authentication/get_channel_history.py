import logging
import os

from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError


################################################################################
# Documentation:
# https://api.slack.com/methods/conversations.history
# https://api.slack.com/apis/pagination
################################################################################

client = WebClient(token=os.environ.get("SLACK_BOT_TOKEN"))
logger = logging.getLogger(__name__)


def convo_history():
    """
    This function stores the conversation history in each of our
    existing Slack channels in a dictionary.

    Input: none
    Output (dict): Dictionary where they key is the channel id and each value
    is a list of message dictionaries from that channel.

    """

    conversation_history = {}
    channel_id_list = [
        "C08QT9ZUJA0",  # this is the general channel
        "C08RR4NJNHK",  # this is the project channel
        "C08RWUE8ZKN",  # this is the jobs channel
        "C08S5MWNW3T",  # this is the events channel
    ]

    try:
        for channel_id in channel_id_list:
            result = client.conversations_history(channel=channel_id)
            conversation_history[channel_id] = result["messages"]
            logger.info(
                "{} messages found in {}".format(
                    len(conversation_history), channel_id
                )
            )

    except SlackApiError as e:
        logger.error("Error creating conversation: {}".format(e))
    return conversation_history


def get_ts():
    """
    This function calls gets timestamps of Slack messages that have threaded replies.
    It uses `convo_history()` to get the message history for each Slack channel.
    It then looks at messages that have a reply count higher than zero and it
    then collects the timestamp (ts) values of those messages in a set (using
    set so there is no repitition)

    Input: none
    Output (set): A set of timestamps representing messages that have replies.
    """
    conversation_history = convo_history()
    ts_set = set()
    for _key, item_list in conversation_history.items():
        for dict_ in item_list:
            if "reply_count" in dict_ and dict_["reply_count"] > 0:
                for k, i in dict_.items():
                    if k == "ts":
                        ts_set.add(i)
    return ts_set


if __name__ == "__main__":
    history = convo_history()
    print(history)
    ts_set = get_ts()
    print(ts_set)
