import json
import os
import requests
from openai import OpenAI
from requests import RequestException
from slack_bolt import App
from slack_bolt.adapter.socket_mode import SocketModeHandler
from dotenv import load_dotenv
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))


################################################################################
#The following documentation was used for the continuous ingestion: 
    # https://api.slack.com/tutorials/tracks/hello-world-bolt
    # https://docs.slack.dev/reference/events
    # https://tools.slack.dev/bolt-python/concepts/event-listening
    # for changing msg: https://api.slack.com/events/message/message_changed
    # for deleting msg: https://api.slack.com/events/message/message_deleted
################################################################################

API_SLACK_SYNC_URL = os.getenv("API_SLACK_SYNC_URL")
API_AUTH_TOKEN = os.getenv("API_AUTH_TOKEN")

HEADERS = {
    "Authorization": f"Token {API_AUTH_TOKEN}",
    "Content-Type": "application/json",
}

def sync_with_api(method, data):  
    """
    This is a helper used to send data from your Slack app to your Django backend API.
    It calls the API at the API_SLACK_SYNC_URL and sends data as JSON using HEADERS.
    If the request is successful, it returns True. If the request fails, it catches
    the exception, prints the error message, status code, response content, and the
    data that caused the error, then returns False.
    Inputs: 
        method (string): HTTP method 
        data (dict): Dictionary that gets sent as the JSON body of the request

    Output (bool): True if successful, False otherwise. 
    """
    try:
        response = requests.request(
            method, API_SLACK_SYNC_URL, json=data, headers=HEADERS
        )
        response.raise_for_status()
        return True
    except RequestException as e:
        print(f"API {method} error: {str(e)}")
        if e.response is not None:
            print("Status code:", e.response.status_code)
            print("Response content:", e.response.text)
            print("Payload that caused error:", data)
        return False


app = App(
    token=os.getenv("SLACK_BOT_TOKEN"),
    signing_secret=None,  # just had to disbale in env!!! remmeber this!!!
    installation_store=None,
    authorize=None,
)



client = OpenAI(api_key=os.getenv("OPEN_API_KEY")) #please export your OPEN_API_KEY before running this file


def create_tag(text):
    """
    This function utilizes the ChatGPT Open API to read our incoming slack messages and
    add the appropriate tags from our existing tag list.
    Input: 
        text (string): (comes from the function get_msg() which gets text from 
        incoming slack messages in real time)
    Output(list): 
        tag_list (string): list of at most 5 tags. This can also be an empty list.
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
    You are a STRICT tagging assistant. Based on the message below, return a 
    JSON array (maximum 5 items) of relevant tags from the provided list.

    Strict Rules:
    - Only return tags that are clearly and directly relevant to the core meaning of the message.
    - DO NOT return tags unless the message explicitly discusses or clearly implies the subject.
    - DO NOT infer meaning from vague, sarcastic, or generic phrases.
    - DO NOT guess. If there is uncertainty, return an empty list.
    - You must select tags ONLY from the provided list. If a term is not in the 
        list, do not include it, even if it looks relevant. Do not invent or paraphrase tags.
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
            real_tag_list = []
            for tag in tag_list:
                if tag in full_tag_list:
                    real_tag_list.append(
                        tag
                    )  # added this manual check because chat WONT stop hallucinating even though temp = 0.
            return real_tag_list
        else:
            return []

    except Exception:
        return []  


@app.message()
def get_msg(message):
    """
    This function extracts relevant fields from the incoming Slack message payload
    and formats them for database insertion. It also uses the GPT tagging assistant to
    generate a list of 0-5 tags based on the message content.

    Inputs:
        - message (dict): The incoming Slack message event. 
        - say (optional): This is a function that lets you respond by sending message
                back on the channel. We do NOT use this functionality but it can 
                be added back in for future iterations.
    Output:
        -  None. The output is printed and passed to the API via sync_with_api()
    """
    message_tag = create_tag(message["text"])
    channel = message["channel"]
    post_type = None
    if channel == "C08QT9ZUJA0":
        post_type = "General"
    elif channel == "C08RR4NJNHK":
        post_type = "Project"
    elif channel == "C08RWUE8ZKN":
        post_type = "Job"
    elif channel == "C08S5MWNW3T":
        post_type = "Event"

    try:
        message_for_db = {
            "title": f"{post_type} from Slack",
            "start_time": "2025-05-26T16:30:50+00:00",
            "post_type": post_type,
            "slack_user_id": message["user"],  
            "client_msg_id": message["client_msg_id"],
            "description": message["text"],
            "tags": message_tag,
            "slack_ts": message["ts"],  
            "edited": message.get("edited"),
        }
        print("Prepared message for DB:", message_for_db)
        if not sync_with_api("POST", message_for_db):
            print(f"Failed to create post for message {message['slack_ts']}")
    except KeyError as e:
        print(f"Missing key in message: {str(e)}")


@app.event("message")  
def record_changed_messages(body):
    """
    This function tracks edits or deletions to Slack messages in real time.

    It listens for Slack events of type "message" and filters for subtypes
    like "message_changed" or "message_deleted". Depending on the subtype,
    it gets relevant fields from the event dictionary to insert
    into our database.

    Inputs:
        - body: The full event payload sent from Slack.
        - logger (OPTIONAL): Slack's built-in logger. We do not use this but in any 
            future iteration of the project it can be added back in! 

    Output:
        - None. The output is printed and passed to the API via sync_with_api()

    """
    event = body["event"]
    channel = event["channel"]
    post_type = None
    if channel == "C08QT9ZUJA0":
        post_type = "General"
    elif channel == "C08RR4NJNHK":
        post_type = "Project"
    elif channel == "C08RWUE8ZKN":
        post_type = "Job"
    elif channel == "C08S5MWNW3T":
        post_type = "Event"

    message_data = event.get("message", {})
    message_tag = create_tag(
    message_data.get("text", "")
    )  # gpt plug in is here for edited tags!

    try:
        if event["subtype"] == "message_changed":
            slack_ts = message_data["ts"]
            changed_message = {
                "post_type": post_type,
                "client_msg_id": message_data.get("client_msg_id"),
                "description": message_data.get("text", ""),
                "tags": message_tag,
                "slack_ts": slack_ts,
            }
            print("Edited message:", changed_message)
            if not sync_with_api("PUT", changed_message):
                print(f"Failed to update post {slack_ts} in {channel}")

        elif (event["subtype"] == "message_deleted"):  
            deleted_message = {
                "post_type": post_type,
                "slack_ts": event[
                    "deleted_ts"
                ],  # reminder this is the deleted ts which matches.
            }
            print("Deleted:", deleted_message)

            if not sync_with_api("DELETE", deleted_message):
                print(
                    f"Failed to delete post {event['deleted_ts']} in {channel}"
                )

    except KeyError as e:
        print(f"Missing key in event: {str(e)}")


if __name__ == "__main__":
    print("Starting Slack Socket Mode listener...")
    SocketModeHandler(app, os.getenv("SLACK_APP_TOKEN")).start()
