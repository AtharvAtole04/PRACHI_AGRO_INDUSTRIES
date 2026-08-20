import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'customer', 'dealer'],
    default: 'customer'
  },
  // Specific fields for Farmers (Customer)
  mainCrops: {
    type: String,
    default: 'कापूस, सोयाबीन, ऊस'
  },
  landAcres: {
    type: String,
    default: '5'
  },
  // Specific fields for Dealers / Retailers
  businessName: {
    type: String,
    default: ''
  },
  gstNumber: {
    type: String,
    default: ''
  },
  licenseNumber: {
    type: String,
    default: ''
  },
  dealerDiscountPercent: {
    type: Number,
    default: 20 // Default 20% wholesale margin for dealers
  },
  isVerifiedDealer: {
    type: Boolean,
    default: false
  },
  // General Address
  city: {
    type: String,
    default: ''
  },
  district: {
    type: String,
    default: ''
  },
  state: {
    type: String,
    default: 'Maharashtra'
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'blocked'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);
export default User;
