# Profiles Endpoints Documentation  

## **Profiles**  

### **Get All Profiles**  
**GET** `/ccserver/profiles/`  
Returns a list of all user profiles.  

**Response:**  
```json
[
  {
    "user": "username",
    "country": "USA",
    "tags": ["tag1"],
    "job_title": "Developer",
    ...
  }
]
```  

---

### **Get/Update/Delete a Profile**  
**GET, PUT, DELETE** `/ccserver/profile/<str:username>/`  
Retrieve, update, or delete a profile by username.  

**PUT Request Body (Partial Update):**  
```json
{
  "slack_username": "new_slack",
  "tags": ["new_tag"]
}
```  

**Response (GET):**  
```json
{
  "user": "username",
  "slack_username": "user_slack",
  "tags": ["tag1"],
  "bio": "About me...",
  ...
}
```  

**Response (DELETE):**  
`204 No Content`  

---

### **Get All Usernames**  
**GET** `/ccserver/names/`  
Returns a list of all usernames.  

**Response:**  
```json
["user1", "user2", ...]
```  