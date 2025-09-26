import mongoose from "mongoose";

const labSchema = new mongoose.Schema({
  laboratoryName: {
    type: String,
    required: true
  },
  licenseId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+@.+\..+/, 'Please fill a valid email address']
  },
  location: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

const Laboratory = mongoose.model('Laboratory', labSchema);

export default Laboratory;