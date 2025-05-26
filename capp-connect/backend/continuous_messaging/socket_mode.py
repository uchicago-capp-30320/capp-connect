import json
import os

from openai import OpenAI
from slack_bolt import App
from slack_bolt.adapter.socket_mode import SocketModeHandler
import requests
from requests import RequestException

API_SLACK_SYNC_URL = os.environ["API_SLACK_SYNC_URL"]
API_AUTH_TOKEN = os.environ["API_AUTH_TOKEN"]

HEADERS = {
    "Authorization": f"Token {API_AUTH_TOKEN}",
    "Content-Type": "application/json"
}

def sync_with_api(method, data): #from Paula! 
    """Helper function to sync with Django API"""
    try:
        response = requests.request(
            method,
            API_SLACK_SYNC_URL,
            json=data,
            headers=HEADERS
        )
        response.raise_for_status()
        return True
    except RequestException as e:
        print(f"API {method} error: {str(e)}")
        return False


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
        "tutorial",
        "startup",
        "full-time",
        "part-time",
        "internship",
        "fellowship",
        "salary",
        "electives",
        "alumni",
        "curriculum",
        "tutorial",
        "interview preparation",
        "job board",
        "hackathon",
        "networking",
        "resume",
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
    channel = message["channel"]
    post_type = None
    if channel == 'C08QT9ZUJA0':
        post_type = "General"
    elif channel == 'C08RR4NJNHK': 
        post_type = 'Project'
    elif channel ==  'C08RWUE8ZKN':
        post_type = "Job"
    elif channel == 'C08S5MWNW3T':
        post_type = "Event"
    
    try: 
        message_for_db = {
            # "type": message["type"],
            "post_type": post_type,
            "user_id": message["user"], #in theirs it is slack_user_id
            "client_msg_id": message["client_msg_id"],
            "description": message["text"],
            "tags": message_tag,
            "ts": message["ts"], #they are going to replace with when it came into DB 
            # "event_ts": message["event_ts"],
            "edited": message.get("edited"),
        }
        print(message_for_db)
        if not sync_with_api('POST', message_for_db):
            print(f"Failed to create post for message {message['ts']}")
    
    except KeyError as e:
        print(f"Missing key in message: {str(e)}")
    


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
    channel = event["channel"]
    post_type = None
    if channel == 'C08QT9ZUJA0':
        post_type = "General"
    elif channel == 'C08RR4NJNHK': 
        post_type = 'Project'
    elif channel ==  'C08RWUE8ZKN':
        post_type = "Job"
    elif channel == 'C08S5MWNW3T':
        post_type = "Event"
    

    message_data = event.get("message", {})
    message_tag = create_tag(
        message_data.get("text", "")
    )  # gpt plug in is here for edited tags!

    try:

        if event["subtype"] == "message_changed":
            changed_message = {
                "post_type": post_type,
                # "hidden": event["hidden"],
                # "ts": event["ts"],
                "client_msg_id": message_data.get("client_msg_id"),
                # "message": event.get("message", {}),
                # "edited": message_data.get("edited", {}),
                "description": message_data.get("text", ""),
                "tags": message_tag,
            }
            print(changed_message)

            if not sync_with_api('PUT', changed_message):
                print(f"Failed to update post {event["ts"]} in {channel}")

        elif (
            event["subtype"] == "message_deleted"
        ):  # https://api.slack.com/events/message/message_deleted
            deleted_message = {
                "post_type": post_type,
                # "ts": event["ts"],
                "ts": event["deleted_ts"], #reminder this is the deleted ts which matches. 
            }
            print(deleted_message)
        
            if not sync_with_api('DELETE', deleted_message):
                print(f"Failed to delete post {event["deleted_ts"]} in {channel}")

    except KeyError as e:
        print(f"Missing key in event: {str(e)}")

if __name__ == "__main__":
    print("Starting Slack Socket Mode listener...")
SocketModeHandler(app, os.environ["SLACK_APP_TOKEN"]).start()
