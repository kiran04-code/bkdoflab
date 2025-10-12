// index.js
import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Auth, getAllOrodcust, getById, loginlab, register, StoreInDB } from "./controller/lab.js";
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
const allowedOrigins = [
  "https://labbackend-2d5l.onrender.com",
  "https://cunsumerfronted-1.onrender.com",  
  "http://localhost:8080", // for local testing
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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
app.get("/Auth", authUser("Tokenlab"), Auth);
app.post("/register", register);
app.post("/StoreInDB", StoreInDB);
app.post("/login", loginlab); // Use POST for login
app.get("/getAllOrodcust", getAllOrodcust); // Use POST for login
app.get("/products/:id", getById); // Use POST for login

// ------------------- Start Server -------------------
const PORT = process.env.PORT || 3005;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Local Server is Running on Port: http://localhost:${PORT}`);
});


