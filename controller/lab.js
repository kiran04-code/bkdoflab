import { createToken } from "../auth/user.js";
import Laboratory from "../model/lab.js";
import bcrypt from "bcrypt";
import { ProductData } from "../model/Products.js";
import qrcode from 'qrcode';

// ---------------- REGISTER ----------------
export const register = async (req, res) => {
  try {
    const { laboratoryName, licenseId, email, password, location } = req.body;

    if (!email || !password || !laboratoryName || !licenseId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingEmail = await Laboratory.findOne({ email });
    if (existingEmail)
      return res.status(400).json({ message: "Email already registered" });

    const existingLicense = await Laboratory.findOne({ licenseId });
    if (existingLicense)
      return res.status(400).json({ message: "License ID already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newLab = await Laboratory.create({
      laboratoryName,
      licenseId,
      email,
      password: hashedPassword,
      location,
    });

    const Tokenlab = await createToken(newLab); // Ensure this returns a string JWT

    res.cookie("Tokenlab", Tokenlab, {
      httpOnly: true,       // Prevents client-side JavaScript from accessing the cookie
      secure: true,         // Ensures cookie is sent only over HTTPS
      sameSite: "none",
      // 1 day
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

    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ---------------- LOGIN ----------------
export const loginlab = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });

    const user = await Laboratory.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const Tokenlab = createToken(user); // Always await if async

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
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });
    return res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Issue during logout",
    });
  }
};

// ---------------- AUTH ----------------
export const Auth = async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const data = await Laboratory.findById(req.user._id);
    return res.json({ success: true, userData: data });
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Implement the Controller Function
// This function will handle the POST request from your frontend.
export const StoreInDB = async (req, res) => {
  try {
    // Log the incoming data for debugging
    console.log("Received data to store in DB:", req.body);

    // Destructure all expected data from the request body
    const {
  ProductName,
      
      farmerId,
      batchId,
      licenseId,
      testDate,
      temperature,
      humidity,
      storageTime,
      lightExposure,
      soilPh,
      soilMoisture,
      soilNitrogen,
      soilPhosphorus,
      soilPotassium,
      soilCarbon,
      heavyMetalPb,
      heavyMetalAs,
      heavyMetalHg,
      heavyMetalCd,
      aflatoxinTotal,
      pesticideResidue,
      moistureContent,
      essentialOil,
      chlorophyllIndex,
      leafSpots,
      discoloration,
      bacterialCount,
      fungalCount,
      ecoliPresent,
      salmonellaPresent,
      dnaAuthenticity,
      certificateIpfsHash,
    } = req.body;

    // Optional: Check if a record with this batchId already exists
    const existingProduct = await ProductData.findOne({ batchId });
    if (existingProduct) {
      return res.status(409).json({ // 409 Conflict
        success: false,
        message: `A record with Batch ID ${batchId} already exists.`,
      });
    }
    const productUrl = `https://cunsumerfronted-1.onrender.com/products/${batchId}`;
    const qrCodeDataUrl = await qrcode.toDataURL(productUrl)
    const newProductRecord = new ProductData({
      ProductName,
      farmerId,
      batchId,
      licenseId,
      testDate,
      temperature,
      humidity,
      storageTime,
      lightExposure,
      soilPh,
      soilMoisture,
      soilNitrogen,
      soilPhosphorus,
      soilPotassium,
      soilCarbon,
      heavyMetalPb,
      heavyMetalAs,
      heavyMetalHg,
      heavyMetalCd,
      aflatoxinTotal,
      pesticideResidue,
      moistureContent,
      essentialOil,
      chlorophyllIndex,
      leafSpots,
      discoloration,
      bacterialCount,
      fungalCount,
      ecoliPresent,
      salmonellaPresent,
      dnaAuthenticity,
      certificateIpfsHash,
      qrCodeDataUrl
    });
    await newProductRecord.save();
    return res.status(201).json({ // 201 Created
      success: true,
      message: "Product data stored successfully in the database.",
    });

  } catch (error) {
    console.error("Error storing data in DB:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while saving the data.",
      error: error.message,
    });
  }
};


export const getAllOrodcust = async(req,res)=>{
  const data = await  ProductData.find({})
  return res.json({
    success:true,
    datas:data
  })
}

export const getById = async(req,res)=>{
const { id } = req.params; // ✅ correctly get the id from URL
    const data = await ProductData.findOne({ batchId: id });
  return res.json({
    success:true,
    datas:data
  })
}
