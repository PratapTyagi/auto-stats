const ShopifyAPIClient = require("shopify-api-node");
const axios = require("axios").default;

module.exports = createCustomersWebhook = async (
  yourShopDomain,
  access_token,
  version,
  address
) =>
  await registerWebhook(yourShopDomain, access_token, version, {
    topic: "customers/create",
    address,
    format: "json",
  });

const registerWebhook = async function (
  shopDomain,
  accessToken,
  version,
  webhook
) {
  const shopify = new ShopifyAPIClient({
    shopName: shopDomain,
    accessToken: accessToken,
  });
  const isCreated = await checkWebhookStatus(shopDomain, accessToken, version);
  if (!isCreated) {
    shopify.webhook.create(webhook).then(
      (response) => console.log(`webhook '${webhook.topic}' created`),
      (err) =>
        console.log(
          `Error creating webhook '${webhook.topic}'. ${JSON.stringify(
            err.response.body
          )}`
        )
    );
  }
};

const checkWebhookStatus = async function (shopDomain, accessToken, version) {
  try {
    const shopifyWebhookUrl =
      "https://" + shopDomain + `/admin/api/${version}/webhooks.json`;
    let response = await axios.get(shopifyWebhookUrl, {
      headers: {
        "X-Shopify-Access-Token": accessToken,
      },
    });
    if (response) {
      console.log(response);
    } else {
      return false;
    }
  } catch (error) {
    console.log("This is the error", error);
    return false;
  }
};
