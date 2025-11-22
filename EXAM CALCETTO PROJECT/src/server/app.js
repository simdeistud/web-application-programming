const express = require("express");
const app = express();
const api = require("./api.js");
const port = 8080;

app.get("/", (req, res) => {
  res.send("index.html");
});

app.use("/api", api);

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});