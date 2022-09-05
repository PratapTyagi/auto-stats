const axios = require("axios").default;
const sheets = require("../../../utils/sheet.js");

const weeklyUnfulfilledOrders = async (req, res) => {
  const { shop, sheetId } = req.query;
  try {
    var today = new Date();
    var currentWeekStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 7
    );
    const { data } = await axios.get(
      `https://${shop}/admin/api/${process.env.VERSION}/orders.json?fulfillment_status=unshipped&created_at_min=${currentWeekStart}`,
      {
        headers: {
          "X-Shopify-Access-Token": process.env.ACCESS_TOKEN,
        },
      }
    );

    const { orders } = data;

    const result = orders.map((order) => {
      const titles = order.line_items.map((line_item) => {
        return {
          product: line_item.name,
          id: line_item.origin_location.id,
          name: line_item.origin_location.name,
        };
      });
      return Object.values(titles[0]);
    });
    await sheets(result, sheetId, 1);
    res.json({ result, totalOrders: result.length });
  } catch (error) {
    console.log(error);
  }
};

const newOrder = async (req, res) => {
  const { id, total_price, app_id } = req.body;
  const { sheetId } = req.query;

  const data = [[id, total_price, app_id]];
  await sheets(data, sheetId, 2);
};

module.exports = {
  weeklyUnfulfilledOrders,
  newOrder,
};
