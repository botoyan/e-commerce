import nodemailer from "nodemailer";

export async function sendWelcomeEmail(to, username) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: `Sneakers Shop <${process.env.EMAIL_USER}>`,
    to: to,
    subject: "🎉 Welcome to SneakShop!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; background: #f4f4f4; border-radius: 10px;">
        <h2 style="color: #333;">Hi ${username},</h2>
        <p style="font-size: 16px; color: #555;">
          Thank you for creating an account with <strong>SneakShop</strong>! We're thrilled to have you.
        </p>
        <p style="font-size: 16px; color: #555;">
          Browse our latest collection of sneakers, save your favorites, and place orders with ease.
        </p>
        <a href="https://your-app.vercel.app" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #111; color: white; text-decoration: none; border-radius: 5px;">
          Start Shopping
        </a>
        <p style="margin-top: 30px; font-size: 14px; color: #aaa;">
          If you didn’t create this account, please ignore this email.
        </p>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
}
