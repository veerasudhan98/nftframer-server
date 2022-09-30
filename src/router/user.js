//externals
const express = require("express");
const bcrypt = require("bcryptjs");

//internals
const User = require("../model/user");
const auth = require("../middleware/auth");
const { listeners } = require("../model/user");

//router handles express endpoints
const router = new express.Router();

//Getting the user
router.get("/user/me", auth, async (req, res, next) => {
  res.send(req.user);
});

router.post("/user", async (req, res) => {
  let { walletAddress } = req.body;
  //converting to lowercase
  walletAddress = walletAddress.toString().toLowerCase();

  try {
    if (!walletAddress) {
      throw Error("walletAddress is required");
    }
    let user = await User.findOne({ walletAddress });
    let status = "";
    let token = "";
    if (!user) {
      user = new User({
        walletAddress,
      });
      await user.save();
      // Generate a new JWT token
      token = await user.generateAuthToken();
      status = 201;
    } else {
      token = await user.generateAuthToken();
      status = 200;
    }

    res
      .status(status)
      .send({ data: { user, token, msg: "Successfully connected!" } });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post("/user/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token != req.token;
    });
    await req.user.save();

    res.status(200).send({ data: { msg: "Logout successfully" } });
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
