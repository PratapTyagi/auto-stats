require("dotenv").config();
require("./db");
const express = require("express");
const app = express();

// Middlewares
app.use(express.json());

// Shopify
app.use("/shopify", require("./routes/shopify"));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`App running on port ${PORT}`));
