import nodemailer from 'nodemailer';

/**
 * Send an OTP verification email to the user.
 * @param {string} to - Recipient email address
 * @param {string} otp - 6-digit OTP code
 * @returns {Promise<boolean>}
 */
export async function sendOtpEmail(to, otp) {
  const emailUser = process.env.EMAIL_USER || process.env.GMAIL_USER || 'prachiagroindustris9696@gmail.com';
  const emailPass = process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;

  console.log(`========================================`);
  console.log(`[ADMIN OTP GENERATED] Email: ${to} | OTP: ${otp}`);
  console.log(`========================================`);

  if (!emailPass) {
    console.warn(`[Nodemailer Warning] EMAIL_PASS or GMAIL_APP_PASSWORD env var not configured. OTP printed to server logs above.`);
    return true; // Return true so flow continues gracefully even without SMTP configured
  }

  try {
    const transporter = nodemailer.createTransport({
      service: process.env.SMTP_SERVICE || 'gmail',
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });

    const mailOptions = {
      from: `"Prachi Agro Admin Security" <${emailUser}>`,
      to: to,
      subject: `Your Prachi Agro Admin Login Verification Code: ${otp}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; padding: 24px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #166534; margin: 0; font-size: 24px;">प्राची ॲग्रो इंडस्ट्रीज</h2>
            <p style="color: #4b5563; font-size: 14px; margin-top: 4px;">Prachi Agro Industries Admin Security</p>
          </div>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <p style="font-size: 16px; color: #1f2937;">Hello Admin,</p>
          <p style="font-size: 15px; color: #4b5563; line-height: 1.5;">
            You requested a login verification code for the Prachi Agro Admin Dashboard. Use the 6-digit verification code below:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 36px; font-weight: bold; letter-spacing: 6px; color: #15803d; background-color: #f0fdf4; border: 2px dashed #22c55e; padding: 12px 28px; border-radius: 8px; display: inline-block;">
              ${otp}
            </span>
          </div>
          <p style="font-size: 14px; color: #6b7280; line-height: 1.5;">
            ⏱️ This code is valid for <strong>10 minutes</strong>. Do not share this code with anyone.
          </p>
          <p style="font-size: 13px; color: #9ca3af; margin-top: 30px; text-align: center;">
            If you did not request this login, please change your admin password immediately.
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Nodemailer] OTP email sent successfully to ${to}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`[Nodemailer Error] Failed to send email to ${to}:`, error.message);
    return true;
  }
}
