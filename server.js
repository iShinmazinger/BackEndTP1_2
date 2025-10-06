const express = require("express");
const cors = require("cors");
require("dotenv").config();
const sequelize = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

sequelize.sync().then(() => {
  console.log("Base de datos sincronizada");
  app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${process.env.PORT}`);
  });
});
