const express = require("express");
const {
  weeklyUnfulfilledOrders,
  newOrder,
} = require("../../../controllers/shopify/orders");
const router = express.Router();

router.get("/weekly-unfulfilled-orders", weeklyUnfulfilledOrders);

// Web hook catch on order creation
router.post("/order-created", newOrder);

module.exports = router;
