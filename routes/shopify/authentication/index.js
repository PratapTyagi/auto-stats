const express = require("express");
const router = express.Router();
const {
  fetchToken,
  storeToken,
} = require("../../../controllers/shopify/authentication");

/* 
  Send data in order to get access_token 
  which can be used to request various 
  routes on shopify.
*/

router.get("/authentication", fetchToken);

/*
  Here we set our access token
  And can initialize our web hook on sheet 
  when we connect it 
*/

router.get("/access_token", storeToken);

module.exports = router;
