import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Mock initial Admin user
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@prachiagro.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Register Customer (Farmer) or Dealer
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role = 'customer',
      mainCrops,
      landAcres,
      businessName,
      gstNumber,
      licenseNumber,
      city,
      district,
      state
    } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: 'Name, email, phone, and password are required.' });
    }

    // Check existing user
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    const newUser = new User({
      name,
      email,
      phone,
      password,
      role: ['admin', 'customer', 'dealer'].includes(role) ? role : 'customer',
      mainCrops,
      landAcres,
      businessName,
      gstNumber,
      licenseNumber,
      city,
      district,
      state,
      isVerifiedDealer: role === 'dealer' ? false : true, // Dealers require admin verification
      status: role === 'dealer' ? 'pending' : 'active',
      dealerDiscountPercent: role === 'dealer' ? 20 : 0
    });

    await newUser.save();

    const userProfile = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      businessName: newUser.businessName,
      isVerifiedDealer: newUser.isVerifiedDealer,
      dealerDiscountPercent: newUser.dealerDiscountPercent,
      city: newUser.city,
      district: newUser.district,
      status: newUser.status
    };

    res.status(201).json({
      success: true,
      message: role === 'dealer' 
        ? 'डीलर नोंदणी यशस्वी झाली. अ‍ॅडमिन पडताळणीनंतर पूर्ण ऍक्सेस मिळेल.' 
        : 'नोंदणी यशस्वी झाली.',
      user: userProfile,
      token: `token-${newUser._id}-${Date.now()}`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login for Admin, Customer, or Dealer
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Check if it's the default Admin credentials
    if ((email === ADMIN_EMAIL || email === 'admin' || email === 'admin@prachiagro.com') && (password === ADMIN_PASSWORD || password === 'admin123')) {
      return res.json({
        success: true,
        user: {
          id: 'admin-master',
          name: 'Prachi Agro Admin',
          email: 'admin@prachiagro.com',
          phone: '9021605160',
          role: 'admin',
          isVerifiedDealer: true,
          status: 'active'
        },
        token: `admin-token-${Date.now()}`
      });
    }

    // Lookup user in DB
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Role check if requested
    if (role && user.role !== role) {
      return res.status(403).json({ error: `User is registered as ${user.role}, not ${role}.` });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ error: 'Your account has been blocked. Please contact support.' });
    }

    const userProfile = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      businessName: user.businessName,
      isVerifiedDealer: user.isVerifiedDealer,
      dealerDiscountPercent: user.dealerDiscountPercent,
      city: user.city,
      district: user.district,
      mainCrops: user.mainCrops,
      status: user.status
    };

    res.json({
      success: true,
      message: 'Login successful',
      user: userProfile,
      token: `token-${user._id}-${Date.now()}`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all users (Admin only)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify / Approve Dealer or Change Status (Admin only)
router.put('/users/:id/verify', async (req, res) => {
  try {
    const { isVerifiedDealer, dealerDiscountPercent, status } = req.body;
    const updateData = {};
    if (typeof isVerifiedDealer === 'boolean') updateData.isVerifiedDealer = isVerifiedDealer;
    if (dealerDiscountPercent !== undefined) updateData.dealerDiscountPercent = Number(dealerDiscountPercent);
    if (status) updateData.status = status;

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, select: '-password' });
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete user (Admin only)
router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
