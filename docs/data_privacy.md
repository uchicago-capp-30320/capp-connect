**CappConnect General Data Notice:** 


All user and messaging data in CappConnect is stored in a secure PostgreSQL database on a remote server. At no point in time will any team member on CappConnect share this information with any other apps or third parties. If this data is breached in any way, all users will be notified promptly. 

***\*\*\*** If this app were to be translated into a full-time project, it would be done in collaboration with the MSCAPP administration. All subsequent changes to the application would be handled by members of the current CappConnect team, administration, or potentially future MSCAPP students. **\*\*\**** 

**Specifications on how we store user information:** 

CappConnect stores user information through two processes: 

- The user authentication process whereby a user logs into the CappConnect application via their existing Slack account.   
- Profile information: whereby a user fills out their profile in their CappConnect account. 

User information via the authorization process:   
Please note that all the information gained through the Slack authorization process is automatic. This means that with the permissions we have set, the authorization process will always return: 

Out of this information, we only store the following in our database: 

* **First name:** The user's first name allows us to identify them within our app. It is also shown to other CAPP users when they post something either via Slack or directly in our app. We do not anticipate any other future use for this information.   
* **Last name:** The user's last name allows us to identify them within our app. It is also shown to other CAPP users when they post something either via Slack or directly in our app. We do not anticipate any other future use for this information.   
* **Username:** The username allows us to identify them within our app. We do not anticipate any other future use for this information.   
* **Email:** The user’s email address allows us to identify them within our app. It is information inherently provided to Slack. We do not anticipate any other future use for this information.   
* **Whether or not the user is staff**: This is a boolean field that tells us if a user is staff or not. We want this information to be recorded because staff have increased permissions compared to regular users. For example, only staff can post on our resources page.   
* **User\_id:** The user\_id is used for identification purposes. We do not anticipate any other future use for this information.   
* **Password:** This is a securely hashed password (secret key between Slack and our app). This is not user information. We do not anticipate any other future use for this information.   
* **Date\_joined:** This reflects the date they first authenticated and joined the app. We do not anticipate any other future use for this information.   
* **Is\_active:** If a user is deleted, they are no longer “active”.  This field is a boolean. 


User information via the profile process: 

* **Id**: This information is already in our database via the Slack authorization process. We store this information for user identification purposes. We do not anticipate any other future use for this information.   
* **Slack username**: This is the user’s Slack display name.  
* **LinkedIn URL (optional)**: Users in the CAPP Connect application can choose to input their LinkedIn URL in their profile so other users can connect with them on that platform. We do not anticipate any other future use for this information.   
* **Github URL (optional):** Users in the CappConnect application can choose to input their GitHub URL in their profile as a means of displaying past and current projects. We do not anticipate any other future use for this information.   
* **Personal site URL (optional)**: Users in the CAPP Connect application can choose to input their personal site in their profile as a means of displaying past and current projects and as a way to connect with other users. We do not anticipate any other future use for this information.  
* **Country (optional):** Users can choose to display location information with other users. This can be used to coordinate future meet-ups such as project sessions, career chats, etc. We do not anticipate any other future use for this information.  
* **State (optional):** Users can choose to display location information with other users. This can be used to coordinate future meet-ups such as project sessions, career chats, etc. We do not anticipate any other future use for this information.  
* **City (optional):** Users can choose to display location information with other users. This can be used to coordinate future meet-ups such as project sessions, career chats, etc. We do not anticipate any other future use for this information.  
* **Phone number (optional):** Users can choose to display contact information as a means to connect with other users. We do not anticipate any other future use for this information.  
* Profile photo (via URL): This is the display photo on the user’s Slack profile.  
* **Employment status (required):** This shows the user’s employment status.   
* **Job (optional):** Users can choose to display where they work and their job title. This can help them with networking and/or finding users in similar fields. We do not anticipate any other future use for this information.  
  


User messaging data:   
Any message, post, or event that the user sends via Slack or directly to our app is stored in our database. We can also store edited messages, and we would retain the timestamp of the message if it is deleted.   
Message, post, and event data include: 

* A title: If the message, post, or event was originally posted on Slack, then this title indicates which channel on Slack the message came from. If the message was created in the app, the title can be whatever the user chooses.   
* Post type: Post type indicates the channel that the messages, posts, or events were originally posted on in Slack.   
* Slack\_user\_id: The slack\_user\_id is a unique identifier for each user posting from Slack.   
* Client\_msg\_id: Another unique identifier for each user.   
* Description: This is the main text posted in either Slack or the app when creating a message, post, or event.   
* Tags: This is a list of tags that are assigned to each post, whether it was posted in Slack or made in the app.   
* Edited: This is a field that shows if a message, event, or post in Slack was edited.   
* Start time: For messages and posts, this shows when the message/post was posted. Ideally, this should not have been a necessary field for messages and posts, but this is a bug we have not been able to resolve. For events, the start time should indicate the start time of the event.   
* Slack\_ts: This is a timestamp indicating when the message, event, or post was posted to the Slack channel.

- 

  