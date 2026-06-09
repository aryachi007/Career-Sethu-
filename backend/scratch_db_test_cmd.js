const mongoose = require('mongoose');
require('dotenv').config();

console.log("Connecting using MONGODB_URI from .env...");
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("SUCCESSFULLY CONNECTED");
    process.exit(0);
  })
  .catch(err => {
    console.error("CONNECTION FAILED:", err.message);
    process.exit(1);
  });
