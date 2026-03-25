const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5003;

connectDB();

app.listen(PORT, () => {
  console.log(`Report service running on port ${PORT}`);
});