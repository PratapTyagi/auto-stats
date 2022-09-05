const { default: axios } = require("axios");
const crypto = require("crypto");
const cookie = require("cookie");
const nonce = require("nonce")();
const querystring = require("querystring");

const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;
const scopes = `read_orders,read_customers`;

/* 
  Shopify web hooks 
  We can even call them on seperate route according to the requirement
*/

const createOrderWebhook = require("../../../webhooks/orders.js");
const createCustomerWebhook = require("../../../webhooks/customer.js");

const fetchToken = (req, res) => {
  const shop = req.query.shop;
  const forwardingAddress = process.env.FORWARDING_ADDRESS;

  if (shop) {
    const state = nonce();
    const redirectUri = forwardingAddress + "/shopify/access_token";
    const installUrl =
      "https://" +
      shop +
      "/admin/oauth/authorize?client_id=" +
      apiKey +
      "&scope=" +
      scopes +
      "&state=" +
      state +
      "&redirect_uri=" +
      redirectUri;

    res.cookie("state", state);
    res.redirect(installUrl);
  } else {
    return res
      .status(400)
      .send(
        "Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request"
      );
  }
};

const storeToken = async (req, res) => {
  const { shop, hmac, code, state } = req.query;
  const stateCookie = cookie.parse(req.headers.cookie).state;

  if (state !== stateCookie) {
    return res.status(403).send("Request origin cannot be verified");
  }

  if (shop && hmac && code) {
    // DONE: Validate request is from Shopify
    const map = Object.assign({}, req.query);
    delete map["signature"];
    delete map["hmac"];
    const message = querystring.stringify(map);
    const providedHmac = Buffer.from(hmac, "utf-8");
    const generatedHash = Buffer.from(
      crypto.createHmac("sha256", apiSecret).update(message).digest("hex"),
      "utf-8"
    );
    let hashEquals = false;
    // timingSafeEqual will prevent any timing attacks. Arguments must be buffers
    try {
      hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac);
      // timingSafeEqual will return an error if the input buffers are not the same length.
    } catch (e) {
      hashEquals = false;
    }

    if (!hashEquals) {
      return res.status(400).send("HMAC validation failed");
    }

    // DONE: Exchange temporary code for a permanent access token
    const accessTokenRequestUrl =
      "https://" + shop + "/admin/oauth/access_token";

    const { data } = await axios.post(accessTokenRequestUrl, {
      client_id: apiKey,
      client_secret: apiSecret,
      code,
    });
    // DONE: Use access token to make API call to 'shop' endpoint
    console.log(data);

    // Web hook for order create
    createOrderWebhook(
      shop,
      data.access_token,
      process.env.VERSION,
      `${process.env.FORWARDING_ADDRESS}/orders/order-created?sheetId=1tWJaJsRqU0cbWpa-SGPID4bruk0qVWsCwHCHXvEKk_w`
    )
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });

    // Web hook when customer got create
    createCustomerWebhook(
      shop,
      data.access_token,
      process.env.VERSION,
      `${process.env.FORWARDING_ADDRESS}/customer/customer-created`
    )
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.status(400).send("Required parameters missing");
  }
};

module.exports = {
  fetchToken,
  storeToken,
};
