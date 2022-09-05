const { google } = require("googleapis");

module.exports = async (data, spreadsheetId, sheetsNumber) => {
  console.log(data, spreadsheetId);
  const auth = new google.auth.GoogleAuth({
    keyFile: "keys.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });
  // Auth client Object
  const authClientObject = await auth.getClient();
  // Google sheets instance
  const googleSheets = google.sheets({ version: "v4", auth: authClientObject });

  const range =
    data.length === 1
      ? `Sheet${sheetsNumber}!A:${String.fromCharCode(data[0].length + 64)}`
      : `Sheet${sheetsNumber}!A1:${String.fromCharCode(data[0].length + 64)}${
          data[0].length
        }`;

  await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",

    resource: {
      values: data,
    },
  });
};
