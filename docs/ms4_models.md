# Model/Resource Documentation

**Profile**
Information about a CAPP connect user.

| Name              | Type                 | Description               |
| ----------------- | -------------------- | ------------------------- |
| user           | OneToOne (User)     | Unique identifier, Django's User model|
| slack_username | varchar | Corresponding Slack handle   |
| slack_dm_url | varchar | Link to message user on Slack   |
| linkedin_url| varchar | LinkedIn url   |
| github_url| varchar | GitHub url   |
| personal_site | varchar | Personal or portfolio url   |
| country | varchar | User's country location   |
| state | varchar | User's state location   |
| city | varchar | User's city location   |
| phone_number | varchar | Contact phone number   |
| email | varchar | Contact email   |
| photo_url       | varchar             | Url to profile image of user       |
| employment_status | enum | One of: 'hiring', 'employed', 'searching'   |
| job_title | varchar | User's current or desired job title  |
| company | varchar | User's current company  |
| bio | varchar(600) | Short personal/professional bio   |
| tags | ManyToMany(Tag) | Interests, industries, etc. (via UserTags)   |

**ProfileTag**
Join table for tags associated with a specific user.

| Name               | Type              | Description                                                  |
| ------------------ | ----------------- | ------------------------------------------------------------ |
| profile            |ForeignKey(User ID)| link to Profile table                                            |
| tag             | ForeignKey (Tags) | link to tags table, ID for various tags used                                     |

**Tag**
Tags used in other tables.

| Name               | Type              | Description                                                  |
| ------------------ | ----------------- | ------------------------------------------------------------ |
| tag_id             | PrimaryKey(Tag ID)| Identification for tag                                       |
| tag_name           | varchar           | Display name of tag, e.g. “Python”, "Health policy", “fellowship”          |

**PostTag**
Join table for tags associated with a post.

| Name               | Type                         | Description                                                  |
| ------------------ | ---------------------------- | ------------------------------------------------------------ |
| post            | ForeignKey(references Posts) | References the post                                          |
| tag             | ForeignKey (references tags) | References the associated tag                                |

**Post**
Posts created by users.

| Name               | Type              | Description                                                  |
| ------------------ | ----------------- | ------------------------------------------------------------ |
| post_id            | ID (PK)           | Unique ID for each post                                      |
| user            |  ID (FK)          |  Creator of the post, links to Profile                                         |
| title              |   varchar         |  Post title                                                  |
| description        |  varchar          |  Post body                                                   |
| post_type                |  enum  |  Job, General, Resource, Event, or Project                                 |
| created_at         |  timestamp        | When the post was created |
| updated_at         |  timestamp        | When the post was last updated |
| tags                |  ManyToMany(Tag)  |  Tags describing the content                                 |
| links              |  varchar          |  Any associated link                                         |
| start_time        |  timestamp        | When the post was created |
| location              |  varchar          |  Location, for an event post                                         |
| source                | varchar  | Indicates if the post is from Slack or the app                                 |

**Comment**
Comments by users on posts.

| Name         | Type              | Description                              |
|--------------|-------------------|------------------------------------------|
| comment_id   | PrimaryKey        | Unique ID for each comment                |
| user         | ForeignKey(User)  | Author of the post, links to Profile                   |
| post         | ForeignKey(Post)  | Post being commented on                          |
| comment_text | text              | Comment content         |
| created_at   | timestamp         | Time the comment was created             |

**Resource**
Resources uploaded for reference.

| Name       | Type         | Description                         |
|------------|--------------|-------------------------------------|
| resource_id| PrimaryKey   | Unique ID for each resource         |
| title      | varchar(100) | Resource title                      |
| description| text         | Resource body                |
| created_at | timestamp    | When the resource was created       |
| updated_at | timestamp    | When the resource was last updated               |
| links      | text         | Any associated link |
