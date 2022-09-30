const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: [
        // successfully placing the order by paying the amount
        "paid",
        // order is being prepared
        "processing",
        // order is ready to be delivered
        "dispatched",
        // order is delivered
        "delivered",
        // // order is cancelled by customer
        // "cancelled",
        // // order is cancelled by admin
        // "admin-cancelled",
        // // order was returned by customer due to damaged product or other issues
        // "returned",
        // "refunded",
      ],
      // by default when a order is placed we consider it as paid (since the payment was successful)
      default: "paid",
    },
    paid: {
      type: Object,
      default: {},
    },
    processing: {
      type: Object,
      default: {},
    },
    dispatched: {
      type: Object,
      default: {},
    },
    delivered: {
      type: Object,
      default: {},
    },

    // items: [
    //   {
    //     type: mongoose.Schema.Types.Object,
    //     ref: "Item",
    //     required: true,
    //   },
    // ],
    items: {
      type: Array,
    },
    total: {
      type: Number,
      required: true,
    },
    totalPriceInUSD: {
      type: Number,
      required: true,
    },
    payment: {
      type: Object,
      // type: mongoose.Schema.Types.ObjectId,
      // ref: "Payment",
      required: true,
    },
    delivery: {
      type: Object,
      // type: mongoose.Schema.Types.ObjectId,
      // ref: "Delivery",
      required: true,
    },
    coupon: {
      type: String,
      // type: mongoose.Schema.Types.ObjectId,
      // ref: "Coupon",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

orderSchema.pre("save", async function (next) {
  const order = this;
  console.log("order status,,,,,", order.status);
  console.log("order string", order.status.toString());
  console.log("order [status]", Object.keys(order[order.status.toString()]));
  if (!Object.keys(order[order.status.toString()]).length) {
    const status = order.status;
    order[status] = {
      date: new Date().toLocaleString().split(",")[0],
      time: new Date().toLocaleString().split(",")[1],
    };
  }
  console.log("this is from save", this);
  next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
