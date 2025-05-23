import json
import os

from openai import OpenAI
from slack_bolt import App
from slack_bolt.adapter.socket_mode import SocketModeHandler


# documentation so i don't forget: https://api.slack.com/tutorials/tracks/hello-world-bolt
# https://docs.slack.dev/reference/events
# https://tools.slack.dev/bolt-python/concepts/event-listening
# for changing msg: https://api.slack.com/events/message/message_changed


app = App(
    token=os.environ["SLACK_BOT_TOKEN"],
    signing_secret=None,  # just had to disbale in env!!! remmeber this!!!
    installation_store=None,
    authorize=None,
)


# lets add chat gpt integration for tagging here:

client = OpenAI(api_key=os.environ["KIRAN_OPEN_API_KEY"])


def create_tag(text):
    """
    This function utilizes the ChatGPT Open API to read our incoming slack messages and
    add the appropriate tags from our existing tag list.
    Input: text (comes from the function get_msg() which gets text from incoming
    slack messages in real time)
    Output: tag_list
    """
    full_tag_list = [
        "climate policy",
        "education policy",
        "crime policy",
        "housing policy",
        "urban policy",
        "energy policy",
        "health policy",
        "economic policy",
        "gender policy",
        "environmental policy",
        "water policy",
        "agricultural policy",
        "conservation policy",
        "science and technology policy",
        "transportation policy",
        "international development",
        "government",
        "political data",
        "social justice",
        "transparency",
        "bias",
        "civic engagement",
        "accessibility",
        "AI ethics",
        "data privacy",
        "civic tech",
        "Python",
        "R",
        "Stata",
        "JavaScript",
        "Java",
        "C",
        "C++",
        "C#",
        "Go",
        "Rust",
        "Ruby",
        "Swift",
        "Kotlin",
        "Scala",
        "Perl",
        "Haskell",
        "Shell",
        "Bash",
        "PowerShell",
        "Visual Basic",
        "Assembly",
        "MATLAB",
        "Julia",
        "SQL",
        "machine learning",
        "artificial intelligence",
        "natural language processing",
        "data science",
        "data engineering",
        "software engineering",
        "software development",
        "data architecture",
        "analytics",
        "statistics",
        "GIS",
        "big data",
        "impact evaluation",
        "algorithms",
        "project management",
        "product management",
        "UI/UX",
        "cloud computing",
        "distributed systems",
        "deep learning",
        "computer vision",
        "causal inference",
        "data visualization",
        "backend development",
        "frontend development",
        "mobile development",
        "full-stack development",
        "systems programming",
        "API design",
        "quality assurance",
        "cybersecurity",
        "Django",
        "Flask",
        "React",
        "Vue.js",
        "Next.js",
        "Node.js",
        "Spring Boot",
        ".NET",
        "TensorFlow",
        "PyTorch",
        "Hadoop",
        "Spark",
        "agile",
        "human-centered design",
        "coursework",
        "tutorial",
        "startup",
        "full-time",
        "part-time",
        "internship",
        "fellowship",
    ]

    prompt = f"""
    You are a strict tagging assistant. Based on the message below, return a JSON array (maximum 5 items) of relevant tags from the provided list.

    Strict Rules:
    - Only return tags that are clearly and directly relevant to the core meaning of the message.
    - DO NOT return tags unless the message explicitly discusses or clearly implies the subject.
    - DO NOT infer meaning from vague, sarcastic, or generic phrases.
    - DO NOT guess. If there is uncertainty, return an empty list.
    - You must select tags ONLY from the provided list. If a term is not in the list, do not include it — even if it looks relevant. Do not invent or paraphrase tags.
    - Match even if the tag appears in lowercase or embedded in a longer phrase.
    - Return valid JSON only. Do not include any explanation or text before or after the array.

    Text:
    \"\"\"{text}\"\"\"

    Tag list:
    {full_tag_list}

    Return your response in this format:
    ["tag1", "tag2"]
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4-turbo",
            temperature=0.0,
            messages=[{"role": "user", "content": prompt}],
        )
        content = response.choices[0].message.content.strip()
        tag_list = json.loads(content)
        if isinstance(tag_list, list):
            return tag_list
        return []  # for when there are no relevant tags

    except Exception:
        return []  # i dont want error - just give me empty tag list. If we had more time, we would have better error handling...


@app.message()
def get_msg(message, say):
    """
    This function allows you to get messages posted on slack channels in real time.
    Inputs:
        - message: The incoming Slack message event. This is in the form of a dictionary.
        - say: This is a function that lets you respond by sending message
                back on the channel. We do NOT use this functionality!
    Output (printed):
        - Select fields in the message dictionary that we need to translate over to our DB.
    """
    """filtered_message = {
        "type": message["type"],
        "channel": message["channel"],
        "user": message["user"],
        "text": message["text"],
        "ts": message["ts"],
        "event_ts": message["event_ts"],
        "edited": message.get("edited"),
    }"""
    # print (filtered_message)
    message_tag = create_tag(message["text"])

    message_for_db = {
        "type": message["type"],
        "channel": message["channel"],
        "user": message["user"],
        "text": message["text"],
        "tag": message_tag,
        "ts": message["ts"],
        "event_ts": message["event_ts"],
        "edited": message.get("edited"),
    }
    print(message_for_db)


@app.event("message")  # https://api.slack.com/events/message/message_changed
def record_changed_messages(body, logger):
    """
    This function tracks edits or deletions to Slack messages in real time.

    It listens for Slack events of type "message" and filters for subtypes
    like "message_changed" or "message_deleted". Depending on the subtype,
    it gets relevant fields from the event dictionary to later insert
    into our DB.

    Inputs:
        - body: The full event payload sent from Slack.
        - logger: Slack's built-in logger. We do NOT use this!!!

    Output (printed):
        - For edited and deleted messages: prints a dict.

    """
    event = body["event"]
    message_data = event.get("message", {})
    message_tag = create_tag(
        message_data.get("text", "")
    )  # gpt plug in is here for edited tags!

    if event["subtype"] == "message_changed":
        changed_message = {
            "channel": event["channel"],
            "hidden": event["hidden"],
            "ts": event["ts"],
            "message": event.get("message", {}),
            "edited": message_data.get("edited", {}),
            "text": message_data.get("text", ""),
            "tag": message_tag,
        }
        print(changed_message)

    elif (
        event["subtype"] == "message_deleted"
    ):  # https://api.slack.com/events/message/message_deleted
        deleted_message = {
            "channel": event["channel"],
            "ts": event["ts"],
            "deleted_ts": event["deleted_ts"],
        }
        print(deleted_message)


if __name__ == "__main__":
    print("Starting Slack Socket Mode listener...")
SocketModeHandler(app, os.environ["SLACK_APP_TOKEN"]).start()
