# Echo

## Overview

Echo is a social app where you choose what you see. Share short posts called **Echos**, follow people, and organize posts into **Scrolls**.

A Scroll can be a collection of posts you pick yourself or a feed built with your own rules.

## Features

- Write Echos with up to 1,000 characters and add tags.
- Like, dislike, and reply to posts.
- Follow people and view their profiles.
- Search for posts, Scrolls, people, and tags.
- Create **Curation Scrolls** by picking posts to keep together.
- Create **Feed Scrolls** that show posts based on tags, authors, and dates. Sort by newest, oldest, or most liked.
- Keep your Scrolls private or make them public. Save public Scrolls made by others.

## Mission / Purpose

**Ditch the Algorithm. Curate Your Feed.**

Echo gives people control over their social feed. You decide which topics and people matter to you, and choose how posts are shown.

This project also showcases my work in building a full-stack social app, from the interface to the server and database.

## Tech Stack / Technical Details

- **Frontend:** React 19 and Vite.
- **Styling:** Tailwind CSS 4 and DaisyUI 5.
- **Navigation and state:** React Router and Zustand.
- **Animations and icons:** GSAP and Lucide React.
- **Backend:** Node.js and Express 5, written in JavaScript.
- **Database:** MongoDB with Mongoose.
- **Login:** JWT tokens stored in HTTP-only cookies. Passwords are hashed with bcryptjs.
- **App structure:** The React app is in `frontend/`, and the API is in `backend/`. The frontend uses Axios to call the API. In production, Express also serves the built frontend.
