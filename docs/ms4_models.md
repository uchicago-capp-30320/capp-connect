# Model/Resource Documentation

**User_info**
Table for information about a CAPP connect user.

| Name              | Type                 | Description               |
| ----------------- | -------------------- | ------------------------- |
| user_id           | PrimaryKey (not null)     | Unique identifier for each user |
| username       | varchar             | Chosen display name       |
| name       | varchar             | User's name       |
| profile_photo       | bytea             | Profile image of user       |
| slack_username | varchar | Corresponding Slack handle   |
| linkedin | varchar | LinkedIn url   |
| github | varchar | Github url  |
| personal_site | varchar | Personal or portfolio url   |
| country | varchar | User's country location   |
| state | varchar | User's state location   |
| city | varchar | User's city location   |
| email | varchar | Contact email   |
| phone_number | varchar | Contact phone number   |
| photo_url | varchar | Link to user's profile photo  |
| employment_status | enum | One of: 'hiring', 'employed', 'searching'   |
| job_title | varchar | User's current or desired job title  |
| bio | varchar(600) | Short personal/professional bio   |
| tags | ManyToMany(Tag) | Interests, industries, etc. (via UserTags)   |

**User_tags**
Join table for tags associated with a specific user.

| Name               | Type              | Description                                                  |
| ------------------ | ----------------- | ------------------------------------------------------------ |
| user_id            |ForeignKey(User ID)| link to User_info                                            |
| tag_id             | ForeignKey (Tags) | link to tags table, ID for various tags used                                     |

**Featured_skills**
Table for featured skills

| Name               | Type               | Description                                                  |
| ------------------ | -----------------  | ------------------------------------------------------------ |
| featured_skill_id            | PrimaryKey| link to Featured_skills_skill_join_table                                            |
| user_id            | ForeignKey(User ID)| link to User_info                                            |
| featured_project_links             | varchar            |  Links to personal projects or portfolios                      |

**Skill_table**
Table for skills. We're considering having specific categories for the tags, because something like machine learning can be both a skill and a tag, so we want to make sure there isn't confusing overlap.

| Name               | Type               | Description                                                  |
| ------------------ | -----------------  | ------------------------------------------------------------ |
| skill_id            | Primary Key| ID of skill                                         |
| skill_name             | varchar            | The skill to be featured                       |

**Featured_skills_skill_join_table**
Join table linking featured skills to specific skills

| Name               | Type               | Description                                                  |
| ------------------ | -----------------  | ------------------------------------------------------------ |
| featured_skill_id             | ForeignKey            | Link to featured skills table                       |
| skill_id             | ForeignKey            |  Link to skill table                      |

**Tag**
Table for tags used in other tables.

| Name               | Type              | Description                                                  |
| ------------------ | ----------------- | ------------------------------------------------------------ |
| tag_id             | PrimaryKey(Tag ID)| Identification for tag                                       |
| tag_name           | varchar           | Display name of tag, e.g. “Python”, “UX”, “Chicago”          |

**Post_tags**
Join table for tags associated with a post.

| Name               | Type                         | Description                                                  |
| ------------------ | ---------------------------- | ------------------------------------------------------------ |
| post_id            | ForeignKey(references Posts) | References the post                                          |
| tag_id             | ForeignKey (references tags) | References the associated tag                                |

**Posts**
Table for posts created by users.

| Name               | Type              | Description                                                  |
| ------------------ | ----------------- | ------------------------------------------------------------ |
| post_id            | ID (PK)           | Unique ID for each post                                      |
| user_id            |  ID (FK)          |  Creator of the post, links to user_info                                         |
| title              |   varchar         |  Post title                                                  |
| description        |  varchar          |  Post body                                                   |
| created_at         |  timestamp        | When the post was created |
| updated_at         |  timestamp        | When the post was updated |
| links              |  varchar          |  Any associated link                                         |
| tag                |  ManyToMany(Tag)  |  Tags describing the content                                 |
| type                |  enum  |  General, Job, or Resources                                 |

**Event_tags**
Join table for tags associated with events.

| Name               | Type                          | Description                                                  |
| ------------------ | -----------------------       | ------------------------------------------------------------ |
| event_id           | ForeignKey(references Events) | References the event                                         |
| tag_id             | ForeignKey (references tags)  | References the associated tag                                |

**Events**
Table for events created by users.

| Name               | Type              | Description                                                  |
| ------------------ | ----------------- | ------------------------------------------------------------ |
| event_id           | ID (PK)           | Unique ID for each event                                     |
| user_id            |  ID (FK)          |  Creator of the event, links to user_info                                       |
| title              |  varchar          |  event title                                                 |
| description        |  varchar          |  event body                                                  |
| event_date         |  date             |  date of event                                               |
| event_time         |time with time zone|  event time                                                  |
| location           |  varchar          |  event location                                              |
| created_at         |  timestamp        |  When the event was created |
| updated_at         |  timestamp        | When the post was updated  |
| link               |  varchar          |  Any associated link                                         |
| tag                |  ManyToMany(Tag)  |  Tags describing the content                                 |

**Project_tags**
Join table for tags associated with a project.

| Name               | Type                            | Description                                                  |
| ------------------ | ------------------------------- | ------------------------------------------------------------ |
| project_id         | ForeignKey(references Projects) | References the project                                       |
| tag_id             | ForeignKey (references tags)    | References the associated tag                                |

**Projects**
Table for projects created by users.

| Name               | Type              | Description                                                  |
| ------------------ | ----------------- | ------------------------------------------------------------ |
| project_id         | ID (PK)           | Unique ID for each project                                   |
| user_id            |  ID (FK)          |  Creator of the project, links to user_info                                      |
| title              |  varchar          |  Project title                                               |
| description        |  varchar          |  Project body                                                |
| created_at         |  timestamp        |  When the project was created |
| updated_at         |  timestamp        | When the post was updated |
| links              |  varchar          |  Any associated link                                         |
| tag                |  ManyToMany(Tag)  |  Tags describing the content                                 |
