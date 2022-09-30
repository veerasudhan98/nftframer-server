//externals
const express = require("express");
const cors = require("cors");

//internals
require("./db/mongoose");
const userRoute = require("./router/user");
const cartRoute = require("./router/cart");
const orderRoute = require("./router/order");
const itemRoute = require("./router/item");

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

//cors might prevent nginx to make server connection, hence disabled for now
app.use(express.json());

//nginx expects this path to set api request to server
app.use("/api", userRoute);
app.use("/api", cartRoute);
app.use("/api", orderRoute);
app.use("/api", itemRoute);

module.exports = app;
