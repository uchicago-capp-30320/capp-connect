# Endpoint Documentation

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
