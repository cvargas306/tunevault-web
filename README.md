# Overview

As I continue building my development skills, I wanted to move beyond a console application and build my first server-rendered web app. This project extends the music theme from my earlier work into a browsable, interactive experience on the web.

This is TuneVault Web, a Node.js and Express application for browsing a small catalog of songs. To run it locally: clone the repository, run `npm install` to install dependencies, then `npm run dev` to start the development server. Open `http://localhost:3000` in a browser to see the home page listing the song catalog.

My purpose in building this software was to learn how a backend framework like Express handles routing, dynamic pages, and form submissions, and to practice structuring a small multi-page application from scratch.

[Software Demo Video](https://www.loom.com/share/8470bcae490749d583045d2a3060be55)

# Web Pages

**Home (`/`)** — Lists every song in the catalog, dynamically generated from a JSON data file. Each song is a link to its own Detail page.

**Song Detail (`/song/:id`)** — Dynamically renders the title, artist, album, genre, and duration for a single song, based on the id in the URL. Includes a link back to the catalog.

**Add Song (`/add`)** — A form where a visitor can submit a new song (title, artist, duration, genre). Submitting the form adds the song to the in-memory list and redirects back to the Home page, where the new song now appears.

# Development Environment

I used Visual Studio Code as my IDE, along with Git and GitHub for version control, and Google Chrome for testing.

I built this project with Node.js and the Express framework, using EJS as the templating engine to render dynamic HTML, plus basic CSS for styling.

# Useful Websites

* [Express Documentation](https://expressjs.com/)
* [EJS Documentation](https://ejs.co/)
* [MDN - Node.js and Express](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs)
* [Express tutorial - Spanish](https://www.youtube.com/watch?v=JmJ1WUoUIK4&t=1466s)

# Future Work

* Persist songs in a real database instead of an in-memory array (planned for Sprint 3 with PostgreSQL)
* Add basic validation so the duration field only accepts a valid time format
* Add the ability to delete or edit an existing song
