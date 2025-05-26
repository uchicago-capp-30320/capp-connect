# capp-connect
CAPP Connect Frontend Repo
Frontend members: Gregory Mitchell, Amber Avila, Paula Cadena

## Tech Stack
For the design of the frontend, we used React Native with the Expo Framework. This design choice was made to simultaneously design for web and mobile. Expo Go is an app downloadable via mobile app stores and allows for easy prototyping and development for the app on mobile. Expo Go is being used as of 5/17/25, but we will eventually switch to development builds more freedom and robustness.

## Basic Layout
We have 4 main pages that users can navigate across:
- Home
- Directory
- Resources
- Feed

### Home page
The Home page is the landing page for users onto the app. Intentionally simple, users can search the entire app via this page and get a basic understanding of how the app works.

The current layout lets users search the entire app based on tags related to Directory, Resources, and Feed.

### Directory
The Directory showcases all the CAPP students and alumni that are using the app. It displays basic information about them including their current position, company, location, and skills.interests. Users can navigate to users' individual pages via the directory.

### Resources page
The Resources page is meant to serve as a central location for CAPP-specific information that lived in multiple places (like Canvas, faculty websites, and Slack). It is meant to showcase resources that are constants for students and alumni, that aren't expected to change very often, but let students have easy access to key info (think CAPP salaries, electives, etc.). While all users may view this page, only Admins can create new resources.

### Feed
The Feed is an amalgamation of posts made in Slack that are ported over and posts that are made exclusively on the app. The Feed is filterable for posts of the four types: General, Events, Jobs, and Projects. These filters broadly represent the type of post, but this is largely determined by where users choose to post (meaning that there may be some user error here).

## Search
The entire app is designed to be searchable via tags. Across all four pages, there is a search bar at the top that allows users to search information relevant to the page via predetermined tags--the exception is the Home page, where users are able to search across the entire app. We use tag autocompletion to coerce users to use the predetermined tags we've created. For the purposes of fast autocompletion, available tags are cached on the client side and used for suggestions.

## Styling
As of 5/14, there are centralized styling files in the frontend/themes/ folder. These files are meant to make it easier to customize the look and feel of the app. Currently we have standards for coloring and box/container/text-input fields that are customizable from themes/. Please use these for designing pages and components, and if need be, update them to reflect an object or design that is consistent with the app's current design but not fully reflected by what is in the files.

### Tag Carousel
There is a tag carousel that should be used anytime we are displaying tags in the app for consistency. Tags in the carousel are in a flashlist that is scrollable while being in a single row.
