const mongoose = require("mongoose");
function connectDatabase() {
  return mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/propview");
}
module.exports = { connectDatabase };
