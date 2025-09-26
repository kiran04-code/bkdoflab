// index.js
import express from "express";
import { config } from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { Auth, loginlab, register } from "./controller/lab.js";
import { dbConnection } from "./config/db.js";
import { authUser } from "./middleware/user.js";



config();
const app = express();

// Middlewares
app.use(cors({ origin: "https://labbackend-2d5l.onrender.com/", credentials:true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(authUser("Tokenlab"))

// ------------------- Server Check Routes -------------------
app.get("/", (req, res) => {
  res.send("Server is Running!");
});

app.get("/testApi", (req, res) => {
  console.log("done");
  res.json({
    data: req.user,
    sirname: "Rathod",
  });
});

// ------------------- Hyperledger Fabric Routes -------------------

// ------------------- MongoDB Connection -------------------
dbConnection("mongodb+srv://kr551344_db_user:ErqBwOEVmaJC2oPF@cluster1.uelsejd.mongodb.net/?retryWrites=true&w=majority&appName=cluster1")
  .then(() => {
    console.log("MONGODB IS CONNECTED");
  })
  .catch((err) => {
    console.log("Error", err);
  });

// ------------------- Farmer Routes -------------------
app.post("/register",register)
app.get("/Auth",Auth)
app.get("/login",loginlab)
// ------------------- Start Server -------------------
const PORT =  3005;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Local Server is Running on Port: http://localhost:${PORT}`);

});