const express = require("express");
const dotenv = require("dotenv");
const { connectDB } = require("./config/Database");
const routesBackend = require("./routes");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: "https://telkom1cijaura-clientmanagement.vercel.app/",
    credentials: true,
  })
);

app.use(cookieParser());

connectDB();

app.use(express.json());

app.use("/api/mongodb/user", routesBackend);

app.get("/", (req, res) => {
  res.send("Backend Running...");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
