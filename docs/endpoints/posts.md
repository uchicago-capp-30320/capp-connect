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
- id: unique identifier for this post
- timestamp: timestamp for post

### GET /fetch_post_ids/

Fetches ids of relevant posts, either the most recent or posts that match the user's query.

Parameters:
- n: number of ids to return for each type (default 20)
- query: user query to filter the returned ids (if NULL, returns the most recent ids)
- post_type: restriction on what type of posts

Response:
- general_posts:
    - post_id: array of unique general post identifiers (general, job, and resources are all types of posts delineated by a type variable in the db)
- job_posts:
    - post_id: array of unique job post identifiers
- resources_posts:
    - post_id: array of unique post identifiers
- event_posts:
    - event_id: array of unique event post identifiers
- projects_posts:
    - project_id: array of unique project post identifiers


### GET /fetch_post_info/

Fetches the relevant information for the posts specified by their ids.

Parameters:
- ids: array of ids (currently capped to 20 ids)
- post_type: type of post 

Response:
- posts: array of posts
    - id: unique identifier for this post
    - user_id: user id of poster
    - body: text content of post
    - timestamp: timestamp for post
    - super_post_id: post id of post this post is a comment of, will be NULL for top-level post
    - tags: tags associated with the post's content
