const express = require("express");
const app = express();
const PORT = 3000;

const songs = require("./data/songs.json");

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("home", { songs: songs });
});

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

app.get("/add", (req, res) => {
  res.render("add");
});

app.post("/add", (req, res) => {
  const maxId = songs.reduce(function (max, s) {
    return s.id > max ? s.id : max;
  }, 0);

  const newSong = {
    id: maxId + 1,
    title: req.body.title,
    artist: req.body.artist,
    album: "Single",
    duration: req.body.duration,
    genre: req.body.genre,
  };

  songs.push(newSong);

  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});