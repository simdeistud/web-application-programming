const express = require("express");
const app = express();
const api = require("./routes/api.router.js");
const { connect } = require('./config/db.js');
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", api);
app.use(express.static('./public'));

app.listen(process.env.WEB_PORT, () => {
  console.log(`Listening on port ${process.env.WEB_PORT}!`);
});


async function start() {
  await connect();
  console.log("MongoDB connected");
}
start();

