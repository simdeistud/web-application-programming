const express = require("express");
const app = express();
const api = require("./routes/api.router.js");
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", api);
app.use(express.static('./public'));

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
