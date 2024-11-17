const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const commentRoutes = require("./routes/commentRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/comments", commentRoutes);

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
