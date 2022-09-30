const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    items: [
      {
        type: mongoose.Schema.Types.Object,
        ref: "Item",
        required: true,
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

cartSchema.pre("save", async function (next) {
  console.log("this is from save");
  next();
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
