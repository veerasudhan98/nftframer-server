//externals
const express = require("express");

//internals
const Item = require("../model/item");
const auth = require("../middleware/auth");

//router handles express endpoints
const router = new express.Router();

//Getting the cart
router.get("/item/:id", auth, async (req, res, next) => {
  const item = await Item.findOne({ _id: req.params.id });
  res.send(item);
});

router.post("/item", auth, async (req, res, next) => {
  const ids = req.body.items;
  const item = await Item.find({ _id: { $in: ids } });
  res.send(item);
});

module.exports = router;
