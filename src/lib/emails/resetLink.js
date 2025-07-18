import nodemailer from "nodemailer";

export async function sendResetPasswordEmail(to, username, resetLink) {
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
    subject: "🔐 Reset Your SneakShop Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; background: #f4f4f4; border-radius: 10px;">
        <h2 style="color: #333;">Hi ${username},</h2>
        <p style="font-size: 16px; color: #555;">
          We received a request to reset your password for your <strong>SneakShop</strong> account.
        </p>
        <p style="font-size: 16px; color: #555;">
          Click the button below to set a new password:
        </p>
        <a href="${resetLink}" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #111; color: white; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
        <p style="margin-top: 20px; font-size: 14px; color: #777;">
          This link will expire in 1 hour for security reasons.
        </p>
        <p style="margin-top: 30px; font-size: 14px; color: #aaa;">
          If you didn’t request a password reset, you can safely ignore this email.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
