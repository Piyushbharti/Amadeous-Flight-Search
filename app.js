const express = require("express");
require("dotenv").config();
// const cors = require("cors");
const mongoose = require("mongoose");
const flightSearch = require("./routes/auth.route.js");

mongoose
  .connect("mongodb://localhost:27017/flightSearch", {})
  .then(() => {
    console.log("connection successful");
  })
  .catch((e) => {
    console.log("No connection");
  });

const app = express();

app.use(express.json());
// app.use(cors());

app.use("/api/v1", flightSearch);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(8000, () => {
  console.log("server is running on port 3000");
});
