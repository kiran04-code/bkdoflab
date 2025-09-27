// index.js
import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Auth, loginlab, register } from "./controller/lab.js";
import { dbConnection } from "./config/db.js";
import { authUser } from "./middleware/user.js";

config();
const app = express();

// ------------------- Middlewares -------------------
// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookies
app.use(cookieParser());

// CORS - Allow frontend origin and credentials (cookies)
app.use(
  cors({
    origin: "http://localhost:8080", // replace with your frontend URL or localhost for dev
    credentials: true,
  })
);

// ------------------- Server Check Routes -------------------
app.get("/", (req, res) => res.send("Server is Running!"));

app.get("/testApi", authUser("Tokenlab"), (req, res) => {
  console.log("done");
  res.json({
    data: req.user,
    sirname: "Rathod",
  });
});

// ------------------- MongoDB Connection -------------------
dbConnection(
  "mongodb+srv://kr551344_db_user:ErqBwOEVmaJC2oPF@cluster1.uelsejd.mongodb.net/?retryWrites=true&w=majority&appName=cluster1"
)
  .then(() => console.log("MONGODB IS CONNECTED"))
  .catch((err) => console.log("MongoDB Error:", err));

// ------------------- Routes -------------------
app.post("/register", register);
app.post("/login", loginlab); // Use POST for login
app.get("/Auth", authUser("Tokenlab"), Auth);

// ------------------- Start Server -------------------
const PORT = process.env.PORT || 3005;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Local Server is Running on Port: http://localhost:${PORT}`);
});
