const path = require("path");
const app = require("./src/app");
const express = require("express");
require("dotenv").config();

//process.env relies on config -> dev.env
//default server is on port 3001
const port = process.env.PORT || 3001;

// ... other app.use middleware
app.use(express.static(path.join(__dirname, "..", "..", "client", "build")));

// ...
// Right before your app.listen(), add this:
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "client", "build", "index.js"));
});

console.log("__dir is", path.join(__dirname, "client", "build"));

app.listen(port, () => {
  console.log("server is up on port " + port);
});
