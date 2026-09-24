// Minimal server just to confirm the environment is set up correctly.
// We'll expand this with real routes (Home, Song Detail, Add Song) next.

const express = require("express");
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("TuneVault Web is running!");
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
