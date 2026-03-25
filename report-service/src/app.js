const express = require("express");
const cors = require("cors");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Report service API running");
});

app.use("/api/reports", reportRoutes);

module.exports = app;