import express from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import User from '../models/User.js';
import { sendOtpEmail } from '../utils/sendEmail.js';
import { JWT_SECRET, PRE_MFA_SECRET, verifyAdminToken, checkAccountLock } from '../middleware/authMiddleware.js';

const router = express.Router();

// Helper to generate 8 one-time recovery codes
const generateRecoveryCodes = async () => {
  const plainCodes = [];
  const hashedCodes = [];
  for (let i = 0; i < 8; i++) {
    const code = crypto.randomBytes(4).toString('hex').toUpperCase(); // e.g. "A1B2C3D4"
    const formattedCode = `${code.slice(0, 4)}-${code.slice(4)}`;
    plainCodes.push(formattedCode);
    const hash = await bcrypt.hash(formattedCode, 10);
    hashedCodes.push(hash);
  }
  return { plainCodes, hashedCodes };
};

// ============================================================
// ADMIN 2FA LOGIC
// ============================================================

// Step 1: Admin Email & Password Check
router.post('/admin/login-step1', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Lookup Admin User in DB
    let user = await User.findOne({
      $or: [
        { email: trimmedEmail },
        { role: 'admin' }
      ]
    });

    // Fallback if Admin document doesn't exist yet
    if (!user) {
      const defaultAdminEmail = (process.env.ADMIN_EMAIL || 'prachiagroindustris9696@gmail.com').toLowerCase();
      const defaultAdminPass = process.env.ADMIN_PASSWORD || 'Prarabdha@pppagro';
      if ((trimmedEmail === defaultAdminEmail || trimmedEmail === 'info@prachiagroindustries.in' || trimmedEmail === 'admin@prachiagro.com' || trimmedEmail === 'admin') && (cleanPassword === defaultAdminPass || cleanPassword === 'admin123')) {
        const hashedPassword = await bcrypt.hash(defaultAdminPass, 10);
        user = new User({
          name: 'Prachi Agro Admin',
          email: defaultAdminEmail,
          phone: '9021605160',
          password: hashedPassword,
          role: 'admin',
          isVerifiedDealer: true,
          status: 'active'
        });
        await user.save();
      } else {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }
    }

    // Check Lockout
    const lockState = checkAccountLock(user);
    if (lockState.isLocked) {
      return res.status(429).json({ error: lockState.message });
    }

    // Verify Password
    let passwordMatches = false;
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
      passwordMatches = await bcrypt.compare(cleanPassword, user.password);
    } else {
      passwordMatches = (cleanPassword === user.password || cleanPassword === (process.env.ADMIN_PASSWORD || 'Prarabdha@pppagro') || cleanPassword === 'admin123');
      if (passwordMatches) {
        user.password = await bcrypt.hash(cleanPassword, 10);
        await user.save();
      }
    }

    if (!passwordMatches) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      if (user.failedLoginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minute lock
      }
      await user.save();
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Password is valid! Reset failed login attempts
    user.failedLoginAttempts = 0;

    // Generate 6-digit numeric OTP
    const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(rawOtp, 10);

    user.emailOtpHash = hashedOtp;
    user.emailOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // Valid for 10 mins
    await user.save();

    // Generate short-lived pre-MFA Token (10 min validity)
    const preMfaToken = jwt.sign(
      { userId: user._id, email: user.email, step: 'pre-mfa' },
      PRE_MFA_SECRET,
      { expiresIn: '10m' }
    );

    // Trigger email sending
    await sendOtpEmail(user.email, rawOtp);

    return res.json({
      success: true,
      mfaRequired: true,
      preMfaToken,
      email: user.email,
      message: `Verification code sent to ${user.email}. Please check your inbox.`
    });

  } catch (err) {
    console.error('Error in login-step1:', err);
    res.status(500).json({ error: 'Internal server error during authentication.' });
  }
});

// Step 2: Verify 6-digit Email OTP Code
const handleOtpVerification = async (req, res) => {
  try {
    const { preMfaToken, otpCode, otp } = req.body;
    const codeToVerify = (otpCode || otp || '').trim();

    if (!preMfaToken) {
      return res.status(401).json({ error: 'Missing verification session. Please start login again.' });
    }

    if (!codeToVerify) {
      return res.status(400).json({ error: 'Please enter the 6-digit OTP code sent to your email.' });
    }

    let decoded;
    try {
      decoded = jwt.verify(preMfaToken, PRE_MFA_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Verification session expired. Please request a new OTP.' });
    }

    const user = await User.findById(decoded.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized admin user.' });
    }

    // Check Lockout
    const lockState = checkAccountLock(user);
    if (lockState.isLocked) {
      return res.status(429).json({ error: lockState.message });
    }

    // Check OTP expiration
    if (!user.emailOtpExpiresAt || Date.now() > new Date(user.emailOtpExpiresAt).getTime()) {
      return res.status(400).json({ error: 'OTP code has expired. Please click Resend OTP.' });
    }

    // Verify OTP against hashed OTP
    let authenticated = false;
    if (user.emailOtpHash) {
      authenticated = await bcrypt.compare(codeToVerify, user.emailOtpHash);
    }

    // TOTP or Recovery Code fallback
    if (!authenticated && user.mfaSecret) {
      authenticator.options = { window: 1 };
      authenticated = authenticator.verify({ token: codeToVerify, secret: user.mfaSecret });
    }

    if (!authenticated) {
      user.failedOtpAttempts = (user.failedOtpAttempts || 0) + 1;
      if (user.failedOtpAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minute lock
      }
      await user.save();
      return res.status(401).json({ error: 'Invalid 6-digit verification code. Please check your email and try again.' });
    }

    // Success! Clear OTP hash & reset security counters
    user.emailOtpHash = '';
    user.emailOtpExpiresAt = null;
    user.failedLoginAttempts = 0;
    user.failedOtpAttempts = 0;
    user.lockUntil = null;
    user.mfaEnabled = true;
    await user.save();

    // Issue Full Admin Session Token (24 hours)
    const sessionToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        name: user.name,
        role: 'admin'
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const userProfile = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: 'admin',
      mfaEnabled: true,
      isVerifiedDealer: true,
      status: 'active'
    };

    return res.json({
      success: true,
      message: 'Email OTP verification successful.',
      token: sessionToken,
      user: userProfile
    });

  } catch (err) {
    console.error('Error verifying OTP:', err);
    res.status(500).json({ error: 'Internal server error during verification.' });
  }
};

router.post('/admin/verify-2fa', handleOtpVerification);
router.post('/admin/verify-email-otp', handleOtpVerification);

// Resend Email OTP
router.post('/admin/resend-email-otp', async (req, res) => {
  try {
    const { preMfaToken } = req.body;
    if (!preMfaToken) {
      return res.status(401).json({ error: 'Missing verification session.' });
    }

    let decoded;
    try {
      decoded = jwt.verify(preMfaToken, PRE_MFA_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Session expired. Please start login again.' });
    }

    const user = await User.findById(decoded.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized.' });
    }

    // Check Lockout
    const lockState = checkAccountLock(user);
    if (lockState.isLocked) {
      return res.status(429).json({ error: lockState.message });
    }

    // Generate fresh 6-digit OTP
    const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(rawOtp, 10);

    user.emailOtpHash = hashedOtp;
    user.emailOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    // Trigger email send
    await sendOtpEmail(user.email, rawOtp);

    return res.json({
      success: true,
      message: `A new verification code has been sent to ${user.email}.`
    });
  } catch (err) {
    console.error('Error resending OTP:', err);
    res.status(500).json({ error: 'Failed to resend OTP.' });
  }
});

// Admin Profile Verification
router.get('/admin/me', verifyAdminToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId, '-password -mfaSecret -mfaTempSecret -recoveryCodeHashes');
    if (!user) {
      return res.status(404).json({ error: 'Admin user not found.' });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// CUSTOMER & DEALER AUTHENTICATION
// ============================================================

router.post('/register', async (req, res) => {
  try {
    const {
      name, email, phone, password, role = 'customer',
      mainCrops, landAcres, businessName, gstNumber, licenseNumber,
      city, district, state
    } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: 'Name, email, phone, and password are required.' });
    }

    const existing = await User.findOne({ email: email.trim().toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);
    const newUser = new User({
      name,
      email: email.trim().toLowerCase(),
      phone,
      password: hashedPassword,
      role: ['customer', 'dealer'].includes(role) ? role : 'customer',
      mainCrops, landAcres, businessName, gstNumber, licenseNumber,
      city, district, state,
      isVerifiedDealer: role === 'dealer' ? false : true,
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

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: role === 'dealer' ? 'डीलर नोंदणी यशस्वी झाली. अ‍ॅडमिन पडताळणीनंतर पूर्ण ऍक्सेस मिळेल.' : 'नोंदणी यशस्वी झाली.',
      user: userProfile,
      token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    const user = await User.findOne({ email: trimmedEmail });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    let passwordMatches = false;
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
      passwordMatches = await bcrypt.compare(cleanPassword, user.password);
    } else {
      passwordMatches = (cleanPassword === user.password);
    }

    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

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

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      user: userProfile,
      token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin User Management Routes (Protected)
router.get('/users', verifyAdminToken, async (req, res) => {
  try {
    const users = await User.find({}, '-password -mfaSecret -mfaTempSecret -recoveryCodeHashes').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/users/:id/verify', verifyAdminToken, async (req, res) => {
  try {
    const { isVerifiedDealer, dealerDiscountPercent, status } = req.body;
    const updateData = {};
    if (typeof isVerifiedDealer === 'boolean') updateData.isVerifiedDealer = isVerifiedDealer;
    if (dealerDiscountPercent !== undefined) updateData.dealerDiscountPercent = Number(dealerDiscountPercent);
    if (status) updateData.status = status;

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, select: '-password -mfaSecret -mfaTempSecret -recoveryCodeHashes' });
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/users/:id', verifyAdminToken, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
