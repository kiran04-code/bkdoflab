import mongoose from "mongoose";
const productDataSchema = new mongoose.Schema({
  // Basic Info
  farmerId: { type: String, required: true, unique: true, trim: true },
  licenseId: { type: String, required: true },
  batchId: { type: String, required: true, unique: true, trim: true },
  ProductName: { type: String, required: true, unique: true, trim: true },
  testDate: { type: String, required: true },

  // Environmental Data
  temperature: { type: Number, default: 0 },
  humidity: { type: Number, default: 0 },
  storageTime: { type: Number, default: 0 },
  lightExposure: { type: Number, default: 0 },

  // Soil Data
  soilPh: { type: Number, default: 0 },
  soilMoisture: { type: Number, default: 0 },
  soilNitrogen: { type: Number, default: 0 },
  soilPhosphorus: { type: Number, default: 0 },
  soilPotassium: { type: Number, default: 0 },
  soilCarbon: { type: Number, default: 0 },
  qrCodeDataUrl: { type: String, required: true },
  // Contaminants
  heavyMetalPb: { type: Number, default: 0 },
  heavyMetalAs: { type: Number, default: 0 },
  heavyMetalHg: { type: Number, default: 0 },
  heavyMetalCd: { type: Number, default: 0 },
  aflatoxinTotal: { type: Number, default: 0 },
  pesticideResidue: { type: Number, default: 0 },

  // Biochemical & Quality
  moistureContent: { type: Number, default: 0 },
  essentialOil: { type: Number, default: 0 },
  chlorophyllIndex: { type: Number, default: 0 },
  leafSpots: { type: Number, default: 0 },
  discoloration: { type: Number, default: 0 },

  // Microbial
  bacterialCount: { type: Number, default: 0 },
  fungalCount: { type: Number, default: 0 },
  ecoliPresent: { type: String, default: "no" },
  salmonellaPresent: { type: String, default: "no" },

  // Genetic
  dnaAuthenticity: { type: String, default: "0%" },

  // Certificate IPFS Hash
  certificateIpfsHash: { type: String, required: true },
}, {
  // Automatically add createdAt and updatedAt timestamps
  timestamps: true,
});

// 2. Create the Mongoose Model
// Mongoose will create a collection named 'productdatas' in your MongoDB.
export const ProductData = mongoose.model('ProductData', productDataSchema);
