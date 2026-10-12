const express = require("express");
const app = express();
const PORT = 3000;

// Shared PostgreSQL connection pool (see db.js)
const pool = require("./db");

// Load the songs data from the JSON file
const songs = require("./data/songs.json");

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

// Route to display the details of a specific song by ID
app.get("/song/:id", (req, res) => {
  const songId = parseInt(req.params.id, 10);

  const song = songs.find(function (s) {
    return s.id === songId;
  });

  if (!song) {
    res.status(404).send("Song not found");
    return;
  }

  res.render("detail", { song: song });
});

// Route to display the form for adding a new song
app.get("/add", (req, res) => {
  res.render("add");
});

// Route to handle the submission of the new song form
app.post("/add", (req, res) => {
  const maxId = songs.reduce(function (max, s) {
    return s.id > max ? s.id : max;
  }, 0);

  // Create a new song object with the submitted data
  const newSong = {
    id: maxId + 1,
    title: req.body.title,
    artist: req.body.artist,
    album: "Single",
    duration: req.body.duration,
    genre: req.body.genre,
  };

  songs.push(newSong);
  
  // Redirect to the home page after adding the new song
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});