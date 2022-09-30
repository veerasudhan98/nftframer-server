//externals
const express = require("express");
const bcrypt = require("bcryptjs");

//internals
const Cart = require("../model/cart");
const Item = require("../model/item");
const auth = require("../middleware/auth");

//router handles express endpoints
const router = new express.Router();

//Getting the cart
router.get("/cart/me", auth, async (req, res, next) => {
  const cart = await Cart.findOne({ owner: req.user._id });
  console.log("cart", cart);
  res.send(cart);
});

router.post("/cart", auth, async (req, res) => {
  try {
    const item = req.body;
    let cartList = await Cart.findOne({ owner: req.user._id });
    // creating a new item from the request body

    const newItem = new Item({
      ...item,
      owner: req.user._id,
    });
    console.log("cartList", cartList);
    console.log("newItem", newItem);
    // if cart is empty, create a new cart else add to exisint cart
    if (cartList) {
      cartList.items = [...cartList.items, newItem];
    } else {
      cartList = new Cart({
        items: [{ ...newItem }],
        owner: req.user._id,
      });
    }
    // save the item and cart
    await newItem.save();
    await cartList.save();
    res
      .status(200)
      .send({ cartList, messsage: "Item Added to the cart successfully" });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.delete("/cart/:id", auth, async (req, res, next) => {
  try {
    let cartList = await Cart.findOne({ owner: req.user._id });
    const newCartList = cartList.items.filter((item) => {
      console.log("item", item._id.toString());
      return item._id.toString() !== req.params.id;
    });
    cartList.items = newCartList;
    // console.log("after filter", cartList.items);
    await cartList.save();
    await Item.deleteOne({
      _id: req.params.id,
    });
    res
      .status(200)
      .send({ cartList, message: "Item deleted from the cart successfully" });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

module.exports = router;
