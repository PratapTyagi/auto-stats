const express = require("express");
const { customers } = require("../../../controllers/shopify");
const router = express.Router();

// Web hook catch on customer creation
router.post("/new-customer", customers.createCustomer);

module.exports = router;
