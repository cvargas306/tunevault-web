const express = require("express");
const app = express();
const PORT = 3000;

// Shared PostgreSQL connection pool (see db.js)
const pool = require("./db");

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static("public"));

// Middleware to parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Convert a duration in seconds (e.g. 355) into "m:ss" text (e.g. "5:55")
function formatDuration(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

// Convert "m:ss" text (e.g. "5:55") into total seconds (e.g. 355).
// Returns null when the text does not match the m:ss format.
function parseDuration(text) {
  const match = /^(\d+):([0-5]\d)$/.exec(text.trim());
  if (!match) {
    return null;
  }
  const minutes = parseInt(match[1], 10);
  const seconds = parseInt(match[2], 10);
  return minutes * 60 + seconds;
}

// Route to display the list of songs on the home page.
// Builds a SELECT query with a JOIN, sends it to PostgreSQL,
// and renders the rows it returns.
app.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.id, s.title, s.artist, s.album, s.duration_seconds, g.name AS genre
      FROM songs s
      JOIN genres g ON s.genre_id = g.id
      ORDER BY s.id
    `);

    // Add a formatted "duration" field so the template can keep using song.duration
    const songsFromDb = result.rows.map(function (row) {
      return { ...row, duration: formatDuration(row.duration_seconds) };
    });

    res.render("home", { songs: songsFromDb });
  } catch (err) {
    console.error("Error loading songs:", err.message);
    res.status(500).send("Error loading songs from the database");
  }
});

// Route to display the details of a specific song by ID.
// Uses a parameterized SELECT ($1) so the id from the URL is sent safely.
app.get("/song/:id", async (req, res) => {
  const songId = parseInt(req.params.id, 10);

  // Reject ids that are not numbers before querying the database
  if (Number.isNaN(songId)) {
    res.status(404).send("Song not found");
    return;
  }

  try {
    const result = await pool.query(
      `SELECT s.id, s.title, s.artist, s.album, s.duration_seconds, g.name AS genre
       FROM songs s
       JOIN genres g ON s.genre_id = g.id
       WHERE s.id = $1`,
      [songId]
    );

    // No row means there is no song with that id
    if (result.rows.length === 0) {
      res.status(404).send("Song not found");
      return;
    }

    // Add the formatted duration so detail.ejs can keep using song.duration
    const row = result.rows[0];
    const song = { ...row, duration: formatDuration(row.duration_seconds) };

    res.render("detail", { song: song });
  } catch (err) {
    console.error("Error loading song:", err.message);
    res.status(500).send("Error loading the song from the database");
  }
});

// Route to display the form for adding a new song.
// Loads the genres from the database to fill the genre dropdown.
app.get("/add", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name FROM genres ORDER BY name");
    res.render("add", { genres: result.rows });
  } catch (err) {
    console.error("Error loading genres:", err.message);
    res.status(500).send("Error loading genres from the database");
  }
});

// Route to handle the submission of the new song form.
// Validates the duration, then builds a parameterized INSERT and
// redirects to the new song's detail page using the id PostgreSQL returns.
app.post("/add", async (req, res) => {
  const durationSeconds = parseDuration(req.body.duration);

  // Stop here if the duration is not in m:ss format
  if (durationSeconds === null) {
    res.status(400).send("Invalid duration. Use m:ss, for example 3:45.");
    return;
  }

  // An empty album field is saved as NULL (for singles)
  const album = req.body.album.trim() || null;

  try {
    const result = await pool.query(
      `INSERT INTO songs (title, artist, album, duration_seconds, genre_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [
        req.body.title.trim(),
        req.body.artist.trim(),
        album,
        durationSeconds,
        parseInt(req.body.genre_id, 10),
      ]
    );

    // RETURNING id gives back the id PostgreSQL generated for the new song
    const newId = result.rows[0].id;
    res.redirect(`/song/${newId}`);
  } catch (err) {
    console.error("Error adding song:", err.message);
    res.status(500).send("Error saving the song to the database");
  }
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});