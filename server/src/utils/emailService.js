import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || 'Crustiva <onboarding@resend.dev>';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

let resendInstance = null;
if (RESEND_API_KEY && RESEND_API_KEY !== 're_placeholder') {
  resendInstance = new Resend(RESEND_API_KEY);
}

// Global layout wrapper for gorgeous responsive HTML emails
const getEmailTemplate = (title, headerText, contentHtml) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body {
      font-family: 'Outfit', 'Inter', Helvetica, Arial, sans-serif;
      background-color: #fffaf5;
      color: #2c2520;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #fffaf5;
      padding: 40px 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(255, 90, 54, 0.1);
    }
    .header {
      background-color: #1e1b18;
      padding: 30px;
      text-align: center;
      border-bottom: 4px solid #ff5a36;
    }
    .logo {
      font-size: 24px;
      font-weight: 800;
      color: #ffffff;
      text-decoration: none;
      letter-spacing: -0.5px;
    }
    .content {
      padding: 40px 30px;
      line-height: 1.6;
    }
    .title {
      font-size: 22px;
      font-weight: 700;
      color: #1e1b18;
      margin-bottom: 20px;
    }
    .btn {
      display: inline-block;
      background-color: #ff5a36;
      color: #ffffff !important;
      text-decoration: none;
      font-weight: 700;
      font-size: 14px;
      padding: 14px 28px;
      border-radius: 12px;
      margin: 25px 0;
      text-align: center;
      box-shadow: 0 4px 15px rgba(255, 90, 54, 0.3);
    }
    .footer {
      background-color: #2c2520;
      color: #a39b95;
      padding: 24px 30px;
      text-align: center;
      font-size: 12px;
    }
    .footer a {
      color: #ffb300;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <a class="logo" href="${CLIENT_URL}">🍕 Crustiva</a>
      </div>
      <div class="content">
        <div class="title">${headerText}</div>
        ${contentHtml}
      </div>
      <div class="footer">
        <p>Crustiva Delivery App • Oasis Infobyte Level 3 Internship</p>
        <p>This is an automated operational notification email.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

export const sendEmail = async ({ to, subject, html, title, headerText }) => {
  const finalHtml = getEmailTemplate(title || subject, headerText || title || subject, html);
  
  if (resendInstance) {
    try {
      const response = await resendInstance.emails.send({
        from: EMAIL_FROM,
        to,
        subject,
        html: finalHtml,
      });
      console.log(`✉️ Email successfully delivered to ${to} via Resend. ID: ${response.data?.id}`);
      return response;
    } catch (err) {
      console.error(`❌ Resend Email Delivery Failure to ${to}:`, err.message);
    }
  }

  // Developer Fallback console logging so setup works perfectly offline/without configuration keys
  console.log('\n========================= [DEV EMAIL LOG] =========================');
  console.log(`To:      ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Header:  ${headerText}`);
  console.log('-------------------------------------------------------------------');
  console.log(html.replace(/<[^>]*>/g, '\n').replace(/\n+/g, '\n').trim());
  console.log('===================================================================\n');
  return { devLogged: true };
};

// 1. Verification Email
export const sendVerificationEmail = async (email, name, token) => {
  const verifyUrl = `${CLIENT_URL}/verify-email?token=${token}`;
  const html = `
    <p>Hi <strong>${name}</strong>,</p>
    <p>Thank you for registering at Crustiva! To activate your user profile and enjoy our premium menu selections, please verify your email address by clicking the link below:</p>
    <div style="text-align: center;">
      <a href="${verifyUrl}" class="btn" style="color: #ffffff;">Verify Email Address</a>
    </div>
    <p>Or copy and paste this URL into your browser:</p>
    <p style="word-break: break-all; color: #ff5a36; font-size: 13px;">${verifyUrl}</p>
    <p>This verification link is active for <strong>24 hours</strong>. If you did not register for this account, you can safely ignore this email.</p>
  `;
  
  return await sendEmail({
    to: email,
    subject: '🍕 Activate Your Crustiva Account — Verification Required',
    title: 'Welcome to Crustiva!',
    headerText: 'Confirm Your Email Address',
    html,
  });
};

// 2. Forgot Password Email
export const sendForgotPasswordEmail = async (email, name, token) => {
  const resetUrl = `${CLIENT_URL}/reset-password?token=${token}`;
  const html = `
    <p>Hi <strong>${name}</strong>,</p>
    <p>We received a request to reset the password for your Crustiva account. To generate a new password, click the button below:</p>
    <div style="text-align: center;">
      <a href="${resetUrl}" class="btn" style="color: #ffffff;">Reset Account Password</a>
    </div>
    <p>Or copy and paste this URL into your browser:</p>
    <p style="word-break: break-all; color: #ff5a36; font-size: 13px;">${resetUrl}</p>
    <p>This reset link will expire in <strong>1 hour</strong> for security reasons. If you did not request this, please secure your account credentials immediately.</p>
  `;

  return await sendEmail({
    to: email,
    subject: '🔐 Crustiva Password Reset Request',
    title: 'Password Recovery',
    headerText: 'Reset Your Account Password',
    html,
  });
};

// 3. Low Stock Alert Email
export const sendLowStockEmail = async (adminEmail, itemName, currentStock, threshold) => {
  const html = `
    <p>Dear <strong>Administrator</strong>,</p>
    <p style="color: #d32f2f; font-weight: bold;">⚠️ Critical Action Required: Inventory Depletion Warning</p>
    <p>Our database monitor has detected that an essential ingredient has fallen below the safety warning threshold:</p>
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <tr style="background-color: #f7f7f7;">
        <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Ingredient Name</th>
        <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">${itemName}</td>
      </tr>
      <tr>
        <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Current Stock Level</th>
        <td style="padding: 12px; border: 1px solid #ddd; color: #d32f2f; font-weight: bold;">${currentStock} units</td>
      </tr>
      <tr style="background-color: #f7f7f7;">
        <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Safety Threshold</th>
        <td style="padding: 12px; border: 1px solid #ddd;">${threshold} units</td>
      </tr>
    </table>
    <p>To avoid delivery customizer downtime, please replenish the ingredient immediately from your administrator console panel.</p>
    <div style="text-align: center;">
      <a href="${CLIENT_URL}/admin/inventory" class="btn" style="color: #ffffff; background-color: #1e1b18;">Open Inventory Dashboard</a>
    </div>
  `;

  return await sendEmail({
    to: adminEmail,
    subject: `🚨 INVENTORY ALERT: Low Stock for ${itemName}`,
    title: 'Inventory Alert System',
    headerText: 'Stock Depletion Warning',
    html,
  });
};

// 4. Order Confirmation Email
export const sendOrderConfirmationEmail = async (email, name, orderId, totalAmount, items) => {
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <strong>${item.name}</strong> (${item.size})<br />
        <span style="font-size: 11px; color: #777;">
          Base: ${item.customization.base} | Sauce: ${item.customization.sauce} | Cheese: ${item.customization.cheese}<br />
          Veggies: ${item.customization.veggies.join(', ') || 'None'}
        </span>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">x${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price * item.quantity}</td>
    </tr>
  `).join('');

  const html = `
    <p>Hi <strong>${name}</strong>,</p>
    <p>Hooray! Your order has been placed successfully and has been sent to our culinary kitchen. Our chefs are crafting your gourmet selections right now.</p>
    <p><strong>Order ID:</strong> <span style="font-family: monospace; background: #eee; padding: 2px 6px; border-radius: 4px;">${orderId}</span></p>
    
    <h3 style="margin-top: 30px; border-bottom: 2px solid #ff5a36; padding-bottom: 8px;">Order Details</h3>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="background-color: #f7f7f7;">
          <th style="padding: 10px; text-align: left; font-size: 12px; text-transform: uppercase;">Items</th>
          <th style="padding: 10px; text-align: center; font-size: 12px; text-transform: uppercase;">Qty</th>
          <th style="padding: 10px; text-align: right; font-size: 12px; text-transform: uppercase;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
        <tr>
          <td colspan="2" style="padding: 15px 10px 10px; text-align: right; font-weight: bold;">Grand Total:</td>
          <td style="padding: 15px 10px 10px; text-align: right; font-weight: bold; color: #ff5a36; font-size: 18px;">₹${totalAmount}</td>
        </tr>
      </tbody>
    </table>

    <div style="text-align: center; margin-top: 30px;">
      <a href="${CLIENT_URL}/orders" class="btn" style="color: #ffffff;">Track Your Order Live</a>
    </div>
  `;

  return await sendEmail({
    to: email,
    subject: `🍕 Crustiva Order Confirmed! (ID: ${orderId.slice(-6).toUpperCase()})`,
    title: 'Thank You For Your Order!',
    headerText: 'We Are Preparing Your Pizza!',
    html,
  });
};
