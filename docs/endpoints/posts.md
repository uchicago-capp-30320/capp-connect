# Posts Endpoints Documentation

## **Posts**

### **Get All Posts (Paginated by Type)**
**GET** `/ccserver/posts/`
Fetches paginated posts grouped by type (Job, General, Event, Project).

**Query Parameters:**
- `page` (optional): Page number (default: `1`).

**Response:**
```json
{
  "next_page": 2,
  "current_page": 1,
  "posts_per_type": 25,
  "posts": {
    "Job": [ ... ],
    "General": [ ... ],
    "Event": [ ... ],
    "Project": [ ... ]
  }
}
```

---

### **Create a Post**
**POST** `/ccserver/posts/`
Creates a new post.

**Request Body (JSON):**
```json
{
  "title": "Post Title",
  "description": "Post content...",
  "post_type": "Job",  // Job/General/Event/Project
  "tags": ["tag1", "tag2"],
  "links": "https://example.com",
  "start_time": "2024-01-01T00:00:00Z",  // Required for events
  "location": "City"  // Optional
}
```

**Response (Success):**
```json
{
  "post_id": 1,
  "user": "username",
  "title": "Post Title",
  "post_type": "Job",
  "created_at": "2024-01-01T00:00:00Z",
  ...
}
```

---

### **Get/Update/Delete a Post**
**GET, PUT, DELETE** `/ccserver/posts/<int:pk>/`
Retrieve, update, or delete a post by ID.

**PUT Request Body (Partial Update):**
```json
{
  "title": "Updated Title",
  "tags": ["new_tag"]
}
```

**Response (GET):**
```json
{
  "post_id": 1,
  "user": "username",
  "title": "Post Title",
  "description": "Content...",
  "tags": ["tag1"],
  ...
}
```

**Response (DELETE):**
`204 No Content`

---

### **Search Posts by Tags**
**GET** `/ccserver/posts/search/`
Fetches posts matching **all** specified tags.

**Query Parameters:**
- `tags` (multiple): Tags to filter by (e.g., `?tags=tag1&tags=tag2`).

**Response:**
```json
[
  {
    "post_id": 1,
    "title": "Matching Post",
    "tags": ["tag1", "tag2"],
    ...
  }
]
```

---

## **Comments**

### **Get All Comments for a Post**
**GET** `/ccserver/posts/<int:pk>/comments/`
Returns all comments on a post.

**Response:**
```json
[
  {
    "comment_id": 1,
    "user": "username",
    "comment_text": "Great post!",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

---

### **Create a Comment**
**POST** `/ccserver/posts/<int:pk>/comments/`
Adds a comment to a post.

**Request Body (JSON):**
```json
{ "comment_text": "New comment..." }
```

**Response (Success):**
```json
{
  "comment_id": 2,
  "user": "username",
  "comment_text": "New comment...",
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

### **Delete a Comment**
**DELETE** `/ccserver/posts/<int:pk>/comments/<int:comment_id>/`
Deletes a comment by ID.

**Response:**
`204 No Content`
