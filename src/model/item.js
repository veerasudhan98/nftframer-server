const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    collectionName: {
      type: String,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    frameSize: {
      type: String,
      required: true,
    },
    frameColor: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

itemSchema.pre("save", async function (next) {
  console.log("this is from save");
  next();
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
