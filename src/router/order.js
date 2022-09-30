//externals
const express = require("express");
//internals
const Cart = require("../model/cart");
const Order = require("../model/order");
const auth = require("../middleware/auth");

//router handles express endpoints
const router = new express.Router();

// List of all the orders created
router.get("/order/me", auth, async (req, res, next) => {
  const orders = await Order.find({ owner: req.user._id });
  console.log("orders", orders);
  res.send(orders);
});

router.get("/order/:id", auth, async (req, res, next) => {
  const orders = await Order.findOne({
    _id: req.params.id,
    owner: req.user._id,
  });
  console.log("orders", orders);
  res.send(orders);
});

// Creating a new order
router.post("/order", auth, async (req, res) => {
  try {
    const orderDetails = req.body;

    const newOrder = new Order({
      ...orderDetails,
      owner: req.user._id,
    });

    await newOrder.save();
    await Cart.deleteOne({
      owner: req.user._id,
    });
    res
      .status(201)
      .send({ orderDetails, messsage: "Your order placed successfully!" });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.patch("/order/:id", auth, async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    owner: req.user._id,
  });
  const updates = Object.keys(req.body);
  console.log(req.body);
  console.log("udpates", updates);
  const allowedUpdates = ["status", "delivery"];

  try {
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    console.log("isvalid", isValidOperation);

    if (!isValidOperation) {
      throw Error("Invalid operation");
    }

    if (
      req.body.status === "paid" ||
      req.body.status === "cancelled" ||
      req.body.status === "returned"
    ) {
      if (order.status === "paid" && req.body.status === "paid") {
        throw Error("Order already paid");
      }
      if (order.status === "cancelled" && req.body.status === "cancelled") {
        throw Error("Order already cancelled");
      }
      if (order.status === "returned" && req.body.status === "returned") {
        throw Error("Order already returned");
      }
      if (req.body.status === "cancelled" && order.status === "dispatched") {
        throw Error(
          "The Order already dispatched, please contact us for more information"
        );
      }
    }
    // temporary ---------
    //  else {
    //   // check if admin? if not throw error
    //   throw Error("Invalid operation for a user");
    // }

    if (
      req.body.delivery &&
      (order.status === "dispatched" || order.status === "delivered")
    ) {
      throw Error(
        "The Order is already dispatched, please contact us if need more information"
      );
    }
    updates.forEach((update) => (order[update] = req.body[update]));
    await order.save();
    res.send(order);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

module.exports = router;
