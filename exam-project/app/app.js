const express = require("express");
const app = express();
const api = require("./routers/api.js");
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", api);
app.use(express.static('../../web'));

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
