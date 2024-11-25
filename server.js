const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const connectDB = require("./config/mongoose.config");
const cors = require("cors");

dotenv.config();

// Conectar a MongoDB
connectDB();

const app = express();

app.use(cors()); 

app.use(express.json());

// rutas
const authRoutes = require("./routes/auth.routes");
const commentRoutes = require("./routes/comment.routes");

app.use("/api/auth", authRoutes);
app.use("/api/comments", commentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`.yellow.bold);
});

