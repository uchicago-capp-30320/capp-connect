# Endpoint Documentation

## Posts

These endpoints are connected to the app's ability to create and load posts

### POST /create_post/

Creates a new post or comment. If super_post_id is provided, the post is treated as a comment on another post.

Parameters:
- user_id: user id of poster
- super_post_id: post id of post this post is a comment of, will be NULL for top-level post
- body: text content of post
- tags: tags associated with the post's content
- post_type: general, event, project, job, or CAPP resource

Response:
- post_id: unique identifier for this post
- timestamp: timestamp for post

### GET /fetch_post_ids/

Fetches ids of relevant posts, either the most recent or posts that match the user's query.

Parameters:
- n: number of ids to return for each type (default 20)
- query: user query to filter the returned ids (if NULL, returns the most recent ids)
- post_type: restriction on what type of posts

Response:
- general_posts:
    - post_ids: array of unique post identifiers
- job_posts:
    - post_ids: array of unique post identifiers
- event_posts:
    - post_ids: array of unique post identifiers
- projects_posts:
    - post_ids: array of unique post identifiers
- resources_posts:
    - post_ids: array of unique post identifiers

### GET /fetch_post_info/

Fetches the relevant information for the posts specified by their ids.

Parameters:
- ids: array of ids (currently capped to 20 ids)

Response:
- posts: array of posts
    - post_id: unique identifier for this post
    - user_id: user id of poster
    - body: text content of post
    - timestamp: timestamp for post
    - super_post_id: post id of post this post is a comment of, will be NULL for top-level post
    - tags: tags associated with the post's content

## Users

These endpoints are connected to the app's display of user information

### GET /get_user/{user_id}

Gets a user's information

Parameters:
- user_id: user id of poster

Response:
- name: user's name
- profile_photo: profile image of user
- bio: user's bio
- email: email address
- linkedin: LinkedIn URL
- github: GitHub URL
- personal_site: personal or portfolio URL
- tags: user's topical tags

### POST /edit_user/

Edit a user's information

Parameters:
- user_id: user id. Must match the user_id associated with the user trying to make the change
- profile_photo: profile image of user
- name: user's name
- bio: user's bio
- email: email address
- linkedin: LinkedIn URL
- github: GitHub URL
- personal_site: personal or portfolio URL
- tags: user's topical tags

Response:
- completed: boolean for if submission was completed successfully
