const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    details: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

paymentSchema.pre("save", async function (next) {
  console.log("this is from save");
  next();
});

const payment = mongoose.model("payment", paymentSchema);

module.exports = payment;
