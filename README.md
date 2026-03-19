# Quickstart
The project is uploaded to vercel, and can be view on this link: https://pu-prosjekt-vercel-ps6p.vercel.app/login 

# How to launch
## Install npm
```bash
npm install
```
## Add .env.local file
Add a .env.local file in the root folder. This file needs to have values: 
```bash
NEXT_PUBLIC_SUPABASE_URL=https://aliuymbietvlamisfkhj.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_PUvJCGDbSDSfJ7gdUuxUmQ_ZX7CLyT3
```
## Launching the project locally
```bash
npm run dev
```
## Visiting the website
To use the website go to http://localhost:3000/
You can log in with the same admin account as detailed above, or create a new account if you do not want admin features.
The website is designed for light mode, so for the best possible user experience, you should enable light mode on your computer.
# Module Setup
## App
-  The app folder has folders for each page. This is used to import a component and display it as a page.
## Components
- The component folder includes files for different parts of the page. The components defines the visuals of a certain page and how it behaves based on User Interaction.
## lib
- The lib folder contains logic and functions that aren't direclty UI. This is currently used for Business Logic, API calls, database operations and user authentication.  
# Screen Shots

## Login Page
<text style="font-size: 18px;"> Log in page allowing the user to log in, or register if they dont already have an account </text>

<br><img src="public/images/loginPage.png" alt="loginpage" width="520"><br>


## Register Page
<text style="font-size: 18px;"> Register page allowing users to create an account. </text>

<br>
<img src="public/images/registerPage.png" alt="register" width="520">
<br>

## Home Page
<text style="font-size: 18px;"> Home page where you can view all upcoming competitions that you are participating in. 
You can also click on the competitions which will lead you to the detail page.
There is also a search function that allows you to search and view other user profiles.
New post button allows user to post an image into a competition. </text>

<br>
<img src="public/images/homepage.png" alt="home page" width="520">
<br>

## Profile page
<text style="font-size: 18px;"> Profile page displaying users profile picture, bio and their animals
Pressing legg til text allows user to add another animal to their profile. </text>

<br>
<img src="public/images/profilepage.png" alt="profile page" width="520">
<br>

## Competitions page
<text style="font-size: 18px;"> The competititons shows all active, upcoming and finished competitions. If the user is an admin they can create competitions.
You can also click on each competitions and view competitors. The page also allows administrators to moderate content.
Users are also allowed to comment and like posts in competitions they are apart of. </text>

<br>
<img src="public/images/competitionList.png" alt="competition list" width="520">
<br>
<br>
<img src="public/images/upcomingCompetitions.png" alt="upcoming competitions" width="520">
<br>
<br>
<img src="public/images/makeCompetition.png" alt="create competition" width="520">
<br>
<br>
<img src="public/images/competition.png" alt="competition details" width="520">
<br>
<br>
<img src="public/images/competitionWithComments.png" alt="competition comments" width="520">
<br>

##  Search page
<text style="font-size: 18px;"> The search page allows users to search up other profiles and view their pages.</text>

<br>
<img src="public/images/Search.png" alt="search page" width="520">
<br>
<br>
<img src="public/images/userSearch.png" alt="user search results" width="520">
<br>

## Settings page
<text style="font-size: 18px;">The settings page allows the user to change their profile picture, name, bio and password. </text>

<br>
<img src="public/images/settings.png" alt="settings page" width="520">
<br>

## Admin page
<text style="font-size: 18px;"> The administrator page shows relevant statistics about the website. This includes users made over time, competitions over time and the most popular account by likes. </text>

<br>
<img src="public/images/adminDashboard.png" alt="admin dashboard" width="520">
<br>

## Sidebar
<text style="font-size: 18px;"> The sidebar shows available pages. </text>

<br>
<img src="public/images/sidebar.png" alt="sidebar" width="160">
<br>
