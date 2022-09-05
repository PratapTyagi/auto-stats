const mongoose = require("mongoose");

module.exports = mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((connected) => {
    console.log(`Database got connected`);
  })
  .catch((error) => {
    console.log(error);
  });
