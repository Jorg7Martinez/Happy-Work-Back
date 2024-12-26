const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const connectDB = require("./config/mongoose.config");
const cors = require("cors");

dotenv.config();

connectDB();

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'https://happy-work.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

const authRoutes = require("./routes/auth.routes");
const commentRoutes = require("./routes/comment.routes");
const companyRoutes = require("./routes/company.routes");


app.use("/api/auth", authRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/company", companyRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`.yellow.bold);
});

