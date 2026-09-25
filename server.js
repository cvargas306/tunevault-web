const express = require("express");
const app = express();
const PORT = 3000;

// Load the songs data from the JSON file
const songs = require("./data/songs.json");

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static("public"));

// Middleware to parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Route to display the list of songs on the home page
app.get("/", (req, res) => {
  res.render("home", { songs: songs });
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