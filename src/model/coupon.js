const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    discount: {
      type: Number,
      required: true,
      default: 0,
    },
    expired: {
      type: Boolean,
      required: true,
      default: false,
    },
    expiredAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { timestamps: true }
);

couponSchema.pre("save", async function (next) {
  console.log("this is from save");
  next();
});

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;
