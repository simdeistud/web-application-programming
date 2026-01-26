const express = require("express");
const app = express();
const api = require("./api.js");
const port = 8000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", api);
app.use(express.static('../../web'));

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
