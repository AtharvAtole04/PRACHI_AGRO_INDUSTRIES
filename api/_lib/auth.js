import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

export const JWT_SECRET = process.env.JWT_SECRET || 'prachi_admin_jwt_secret_key_2024';
export const PRE_MFA_SECRET = process.env.PRE_MFA_SECRET || 'prachi_pre_mfa_secret_key_2024';

export function verifyAdmin(req) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { ok: false, status: 401, error: 'Authorization header missing or invalid. Admin token required.' };
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || (decoded.role !== 'admin' && decoded.role !== 'superadmin')) {
      return { ok: false, status: 403, error: 'Access denied: Admin privileges required.' };
    }
    return { ok: true, user: decoded };
  } catch (err) {
    return { ok: false, status: 401, error: 'Token expired or invalid: ' + err.message };
  }
}

export async function sendOtpEmail(email, otp) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT, 10) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'prachiagroindustris9696@gmail.com',
        pass: process.env.SMTP_PASS || 'dptv rypa rlyz bwwa'
      }
    });

    const mailOptions = {
      from: '"Prachi Agro Industries Security" <prachiagroindustris9696@gmail.com>',
      to: email,
      subject: `Your Admin Verification Code: ${otp}`,
      text: `Your 6-digit verification code is: ${otp}\nValid for 10 minutes. Do not share this code.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; max-width: 500px; margin: auto;">
          <h2 style="color: #1b4332; text-align: center;">Prachi Agro Industries</h2>
          <p>Hello Admin,</p>
          <p>Please enter the following 6-digit OTP code to verify your login session:</p>
          <div style="background-color: #f1f8f5; border: 1px dashed #2d6a4f; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <span style="font-size: 28px; font-weight: bold; letter-spacing: 5px; color: #2d6a4f;">${otp}</span>
          </div>
          <p style="font-size: 12px; color: #666;">This OTP is valid for 10 minutes. If you did not initiate this request, please change your credentials immediately.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('[Email OTP Sent Successfully]:', info.messageId);
    return true;
  } catch (err) {
    console.warn('[Email OTP Send Notice]:', err.message);
    // Even if SMTP fails (e.g. invalid app pass or offline), OTP is logged to console for admin access
    console.log(`[MASTER OTP FALLBACK FOR ${email}]: ${otp}`);
    return false;
  }
}
