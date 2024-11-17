const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors"); 
const connectDB = require("./config/mongoose.config");

dotenv.config();

// Conectar a MongoDB
connectDB();

const app = express();

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



/*

MONGO_URI=mongodb+srv://lamas:happy321work@cluster.mongodb.net/baseHappy?retryWrites=true&w=majority

const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

require('./config/mongoose.config');

app.use(
    cors({
        credentials: true,
        origin: ["http://localhost:3000"]
    })
)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//* Routs Pirates
const pirateRoutes =  require("./routes/pirate.routes");
app.use("/api/pirate", pirateRoutes);

//* Routs Users
const userRoutes =  require("./routes/user.routes");
app.use("/api/user", userRoutes);


app.listen(port, () => console.log(`Listening at Port: ${port}`));*/