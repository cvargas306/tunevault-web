# Overview

As I continue building my development skills, I wanted to take my web application one step further by replacing its temporary in-memory data with a real relational database. This project extends TuneVault Web, my Node.js and Express music catalog, so that every song is now stored, queried, and updated in PostgreSQL.

TuneVault Web lets a visitor browse a catalog of songs, view the details of each song, add new songs, edit existing ones, and delete them. Every page builds a SQL command in JavaScript, sends it to PostgreSQL through the `pg` library, receives the result, and uses it to render the page.

To run it locally:

1. Install PostgreSQL and make sure the service is running.
2. Create the database: `createdb tunevault`
3. Create the tables: `psql -d tunevault -f db/schema.sql`
4. Load the initial data: `psql -d tunevault -f db/seed.sql`
5. Copy `.env.example` to `.env` and set `DATABASE_URL` for your machine.
6. Run `npm install` to install dependencies, then `npm run dev` to start the server.
7. Open `http://localhost:3000` in a browser.

My purpose in building this software was to learn how a web application communicates with a relational database: designing tables and relationships, writing SQL from the terminal, and running parameterized queries from Node.js to insert, retrieve, update, and delete data safely.

[Software Demo Video -Part 1](https://www.loom.com/share/c42cef78083c4cd596fd42501519702f)

[Software Demo Video -Part 2](https://www.loom.com/share/0c30c3f5e8ac428eb743c6d09159e9e5)

# Relational Database

I used PostgreSQL 18, an open-source relational database, running locally on my Mac (installed with Homebrew). The database is named `tunevault`, and its structure is defined in two SQL scripts: `db/schema.sql` creates the tables and `db/seed.sql` loads the initial data.

The database has two tables with a one-to-many relationship (one genre has many songs):

**`genres`**
- `id` — integer primary key, generated automatically
- `name` — genre name (required and unique)

**`songs`**
- `id` — integer primary key, generated automatically
- `title` — song title (required)
- `artist` — artist name (required)
- `album` — album name (optional, so singles can be stored without an album)
- `duration_seconds` — length of the song in seconds (required, must be greater than 0); the app displays it as `m:ss`
- `genre_id` — foreign key that references `genres.id`

The Home and Song Detail pages use a `JOIN` between `songs` and `genres` to display each song's genre name, and the Add and Edit forms load their genre dropdown from the `genres` table.

# Web Pages

**Home (`/`)** — Lists every song in the catalog using a `SELECT` with a `JOIN` between the `songs` and `genres` tables. Each song is a link to its own Detail page.

**Song Detail (`/song/:id`)** — Displays the title, artist, album, genre, and duration of a single song, using a parameterized `SELECT` based on the id in the URL. Songs without an album are shown as "Single". Includes links to edit the song and a button to delete it.

**Add Song (`/add`)** — A form to submit a new song (title, artist, optional album, duration, and genre). The genre dropdown is loaded from the database. Submitting the form runs an `INSERT` and redirects to the new song's Detail page.

**Edit Song (`/song/:id/edit`)** — A form pre-filled with the current data of a song. Submitting it runs an `UPDATE` and redirects back to the song's Detail page.

**Delete Song** — A button on the Detail page that asks for confirmation, runs a `DELETE`, and redirects to the Home page.

# Development Environment

I used Visual Studio Code as my IDE, the macOS Terminal with `psql` to create and inspect the database, Homebrew to install PostgreSQL, Git and GitHub for version control, and Google Chrome for testing.

I built this project with JavaScript on Node.js and the Express framework, using EJS as the templating engine and basic CSS for styling. For the database, I used SQL with PostgreSQL, the `pg` (node-postgres) library to connect and run queries from Node.js, and `dotenv` to load the database connection settings from a `.env` file.

# Useful Websites

* [PostgreSQL Documentation](https://www.postgresql.org/docs/current/)
* [psql Documentation](https://www.postgresql.org/docs/current/app-psql.html)
* [PostgreSQL Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html)
* [node-postgres Documentation](https://node-postgres.com/)
* [dotenv on GitHub](https://github.com/motdotla/dotenv)
* [Express Documentation](https://expressjs.com/)
* [EJS Documentation](https://ejs.co/)
* [MDN - Node.js and Express](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs)

# Future Work

* Add a statistics page using aggregate functions (for example, number of songs and average duration per genre)
* Add a `playlists` table with a many-to-many relationship to songs
* Deploy the app with a cloud PostgreSQL service so it can be used online
* Show friendlier error messages in the form instead of plain text responses
* Review and fix the npm audit warnings in the project dependencies