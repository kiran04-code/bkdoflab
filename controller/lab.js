import { createToken } from "../auth/user.js";
import Laboratory from "../model/lab.js";
import bcrypt from "bcrypt";

// ---------------- REGISTER ----------------
export const register = async (req, res) => {
  console.log(req.body);
  try {
    const { laboratoryName, licenseId, email, password, location } = req.body;

    if (!email || !password || !laboratoryName || !licenseId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingEmail = await Laboratory.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const existingLicense = await Laboratory.findOne({ licenseId });
    if (existingLicense) {
      return res.status(400).json({ message: "License ID already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newLab = await Laboratory.create({
      laboratoryName,
      licenseId,
      email,
      password: hashedPassword,
      location,
    });

    const Tokenlab = await createToken(newLab);
    res.cookie("Tokenlab", Tokenlab, {
      httpOnly: true,       // Prevents client-side JavaScript from accessing the cookie
      secure: true,         // Ensures cookie is sent only over HTTPS
      sameSite: "none",

    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      lab: {
        id: newLab._id,
        laboratoryName: newLab.laboratoryName,
        licenseId: newLab.licenseId,
        email: newLab.email,
        location: newLab.location,
      },
    });
  } catch (err) {
    console.error("Register Error:", err);

    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({
        message: `${field} already exists`,
        error: err.message,
      });
    }

    if (!res.headersSent) {
      return res.status(500).json({ message: "Server error", error: err.message });
    }
  }
};

// ---------------- LOGIN ----------------
export const loginlab = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await Laboratory.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const Tokenlab = createToken(user);

    // Set cookie
    res.cookie("Tokenlab", Tokenlab, {
        httpOnly: true,       // Prevents client-side JavaScript from accessing the cookie
        secure: true,         // Ensures cookie is sent only over HTTPS
        sameSite: "none",

    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        laboratoryName: user.laboratoryName,
        email: user.email,
      },
      token: Tokenlab,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ---------------- LOGOUT ----------------
export const logout = async (req, res) => {
  try {
    res.clearCookie("Tokenlab", {
      httpOnly: true,
      secure: "production" === "production",
      sameSite: "production" === "production" ? "None" : "Lax",
    }).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Issue during logout",
    });
  }
};

// ---------------- AUTH ----------------
export const Auth = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const data = await Laboratory.findById(req.user._id);

    res.json({
      success: true,
      userData: data
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
