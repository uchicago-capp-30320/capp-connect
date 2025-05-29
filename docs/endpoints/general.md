# CAPP-CONNECT REST API Documentation

## Table of Contents
1. [Profile Endpoints](#profile-endpoints)
2. [Post Endpoints](#post-endpoints)
3. [Comment Endpoints](#comment-endpoints)
4. [Resource Endpoints](#resource-endpoints)
5. [Search Endpoints](#search-endpoints)
6. [Authentication Endpoints](#authentication-endpoints)
7. [Frontend Endpoint](#frontend-endpoint)
8. [Data Models](#data-models)

---

## Profile Endpoints

### 1. Retrieve Current User's Profile
**URL**: `/api/my-profile/`
**Method**: `GET`
**Authentication**: Token Authentication
**Description**: Get the authenticated user's profile
**Response**:
```json
{
  "user": "string",
  "slack_username": "string",
  "linkedin_url": "string",
  "github_url": "string",
  "personal_site": "string",
  "country": "string",
  "state": "string",
  "city": "string",
  "phone_number": "string",
  "photo_url": "string",
  "employment_status": "string",
  "job_title": "string",
  "company": "string",
  "bio": "string",
  "tags": ["string"]
}
```

### 2. Retrieve Specific Profile
**URL**: `/api/profiles/<str:username>/`
**Method**: `GET`
**Description**: Get a user's profile by username
**URL Parameters**:
- `username`: User's username
**Response**: Same as current user profile

### 3. Update Profile
**URL**: `/api/profiles/<str:username>/`
**Method**: `PUT`
**Authentication**: Token Authentication
**Permissions**: Profile owner only
**URL Parameters**:
- `username`: User's username
**Request Body**:
```json
{
  "bio": "string",
  "employment_status": "string",
  "tags": ["string"],
  ... // Other profile fields
}
```
**Response**: Updated profile (200 OK)
**Errors**:
- 403 Forbidden (if not owner)
- 400 Bad Request (invalid data)

### 4. Delete Profile
**URL**: `/api/profiles/<str:username>/`
**Method**: `DELETE`
**Authentication**: Token Authentication
**Permissions**: Profile owner only
**URL Parameters**:
- `username`: User's username
**Response**: 204 No Content
**Errors**:
- 403 Forbidden (if not owner)

### 5. List All Profiles
**URL**: `/api/profiles/`
**Method**: `GET`
**Description**: Get compact list of all profiles
**Response**:
```json
[
  {
    "user": "string",
    "country": "string",
    "state": "string",
    "city": "string",
    "photo_url": "string",
    "employment_status": "string",
    "job_title": "string",
    "company": "string",
    "tags": ["string"]
  }
]
```

---

## Post Endpoints

### 1. Create Post
**URL**: `/api/posts/`
**Method**: `POST`
**Authentication**: Token Authentication
**Request Body**:
```json
{
  "title": "string",
  "description": "string",
  "post_type": "string",
  "tags": ["string"],
  "links": "string",
  "start_time": "datetime",
  "location": "string"
}
```
**Response**: Created post (201 Created)
**Errors**: 400 Bad Request (invalid data)

### 2. List Posts (Paginated)
**URL**: `/api/posts/`
**Method**: `GET`
**Query Parameters**:
- `page`: Page number (default: 1)
**Response**:
```json
{
  "next_page": 2,
  "current_page": 1,
  "posts_per_type": 25,
  "posts": {
    "Job": [/* Post objects */],
    "General": [/* Post objects */],
    "Event": [/* Post objects */],
    "Project": [/* Post objects */]
  }
}
```

### 3. Retrieve Post
**URL**: `/api/posts/<int:pk>/`
**Method**: `GET`
**URL Parameters**:
- `pk`: Post ID
**Response**:
```json
{
  "post_id": "int",
  "user": "string",
  "title": "string",
  "description": "string",
  "post_type": "string",
  "created_at": "datetime",
  "updated_at": "datetime",
  "tags": ["string"],
  "links": "string",
  "start_time": "datetime",
  "location": "string",
  "slack_ts": "string",
  "client_msg_id": "string",
  "slack_user_id": "string"
}
```

### 4. Update Post
**URL**: `/api/posts/<int:pk>/`
**Method**: `PUT`
**Authentication**: Token Authentication
**Permissions**: Post owner only
**URL Parameters**:
- `pk`: Post ID
**Request Body**: Partial post data
**Response**: Updated post (200 OK)
**Errors**:
- 403 Forbidden (if not owner)
- 400 Bad Request (invalid data)

### 5. Delete Post
**URL**: `/api/posts/<int:pk>/`
**Method**: `DELETE`
**Authentication**: Token Authentication
**Permissions**: Post owner only
**URL Parameters**:
- `pk`: Post ID
**Response**: 204 No Content
**Errors**: 403 Forbidden (if not owner)

---

## Comment Endpoints

### 1. Create Comment
**URL**: `/api/posts/<int:pk>/comments/`
**Method**: `POST`
**Authentication**: Token Authentication
**URL Parameters**:
- `pk`: Post ID
**Request Body**:
```json
{
  "comment_text": "string"
}
```
**Response**: Created comment (201 Created)
```json
{
  "comment_id": "int",
  "user": "string",
  "post": "string",
  "comment_text": "string",
  "created_at": "datetime"
}
```

### 2. List Comments
**URL**: `/api/posts/<int:pk>/comments/`
**Method**: `GET`
**URL Parameters**:
- `pk`: Post ID
**Response**: List of comments
```json
[
  {
    "comment_id": "int",
    "user": "string",
    "post": "string",
    "comment_text": "string",
    "created_at": "datetime"
  }
]
```

### 3. Delete Comment
**URL**: `/api/posts/<int:pk>/comments/<int:comment_id>/`
**Method**: `DELETE`
**Authentication**: Token Authentication
**Permissions**: Comment owner only
**URL Parameters**:
- `pk`: Post ID
- `comment_id`: Comment ID
**Response**: 204 No Content
**Errors**:
- 404 Not Found (post/comment not found)
- 403 Forbidden (if not owner)

---

## Resource Endpoints

### 1. Create Resource
**URL**: `/api/resources/`
**Method**: `POST`
**Request Body**:
```json
{
  "title": "string",
  "description": "string",
  "links": "string",
  "tags": ["string"]
}
```
**Response**: Created resource (201 Created)
```json
{
  "resource_id": "int",
  "title": "string",
  "description": "string",
  "created_at": "datetime",
  "updated_at": "datetime",
  "links": "string",
  "tags": ["string"]
}
```

### 2. List Resources
**URL**: `/api/resources/`
**Method**: `GET`
**Response**: List of resources (same structure as above)

### 3. Retrieve Resource
**URL**: `/api/resources/<int:pk>/`
**Method**: `GET`
**URL Parameters**:
- `pk`: Resource ID
**Response**: Resource details (same structure as above)

### 4. Update Resource
**URL**: `/api/resources/<int:pk>/`
**Method**: `PUT`
**URL Parameters**:
- `pk`: Resource ID
**Request Body**: Partial resource data
**Response**: Updated resource (200 OK)

### 5. Delete Resource
**URL**: `/api/resources/<int:pk>/`
**Method**: `DELETE`
**URL Parameters**:
- `pk`: Resource ID
**Response**: 204 No Content

---

## Search Endpoints

### 1. Directory Search Data
**URL**: `/api/directory/`
**Method**: `GET`
**Description**: Get searchable directory data (usernames and allowed tags)
**Response**:
```json
{
  "users": ["cleaned_usernames"],
  "tags": ["tag_names"]
}
```

### 2. All Tags
**URL**: `/api/tags/`
**Method**: `GET`
**Response**: List of all tags
```json
["tag_name1", "tag_name2"]
```

### 3. Search Profiles
**URL**: `/api/search/profiles/`
**Method**: `GET`
**Query Parameters**:
- `tags`: Comma-separated list of tags
**Description**: Search profiles by tags (intersection of all tags)
**Response**: List of matching profiles

### 4. Search Posts
**URL**: `/api/search/posts/`
**Method**: `GET`
**Query Parameters**:
- `tags`: Comma-separated list of tags
**Description**: Search posts by tags (intersection of all tags)
**Response**: List of matching posts

### 5. Search Resources
**URL**: `/api/search/resources/`
**Method**: `GET`
**Query Parameters**:
- `tags`: Comma-separated list of tags
**Description**: Search resources by tags (intersection of all tags)
**Response**: List of matching resources

---

## Authentication Endpoints

### Slack Integration
**URL**: `/api/slack/post/`
**Authentication**: Token Authentication
**Methods**:
- **POST**: Create post from Slack data
- **PUT**: Update post by Slack timestamp and type
- **DELETE**: Delete post by Slack timestamp and type
**Request Body**:
```json
{
  "slack_ts": "string",
  "post_type": "string",
  // Other post fields
}
```

---

## Frontend Endpoint

### Serve Frontend Application
**URL**: `/`
**Method**: `GET`
**Description**: Serves the React frontend application
**Caching**: Never cached (development setting)
**Response**: HTML page (`index.html`)

---

## Data Models

### Profile
```python
{
  "user": "User",
  "slack_username": "CharField",
  "linkedin_url": "CharField",
  "github_url": "CharField",
  "personal_site": "CharField",
  "country": "CharField",
  "state": "CharField",
  "city": "CharField",
  "phone_number": "CharField",
  "photo_url": "CharField",
  "employment_status": "CharField (choices)",
  "job_title": "CharField",
  "company": "CharField",
  "bio": "TextField",
  "tags": ["Tag"]
}
```

### Post
```python
{
  "user": "User",
  "title": "CharField",
  "description": "TextField",
  "post_type": "CharField (choices: Job, General, Event, Project)",
  "created_at": "DateTimeField",
  "updated_at": "DateTimeField",
  "tags": ["Tag"],
  "links": "TextField",
  "start_time": "DateTimeField",
  "location": "CharField",
  "slack_ts": "CharField",
  "client_msg_id": "CharField",
  "slack_user_id": "CharField"
}
```

### Comment
```python
{
  "user": "User",
  "post": "Post",
  "comment_text": "TextField",
  "created_at": "DateTimeField"
}
```

### Resource
```python
{
  "title": "CharField",
  "description": "TextField",
  "created_at": "DateTimeField",
  "updated_at": "DateTimeField",
  "links": "TextField",
  "tags": ["Tag"]
}
```

### Tag
```python
{
  "tag_name": "CharField (unique)",
  "allowed_on_profile": "BooleanField"
}
```

### Employment Status Choices
```python
EMPLOYED = "Employed"
SEARCHING = "Searching"
HIRING = "Hiring"
STUDENT = "Student"
```
