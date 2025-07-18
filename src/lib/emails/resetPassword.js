import nodemailer from "nodemailer";

export default async function sendPasswordChangeEmail(to, username) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `Sneakers Shop <${process.env.EMAIL_USER}>`,
    to,
    subject: "✅ Your SneakShop Password Has Been Changed",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; background: #f4f4f4; border-radius: 10px;">
        <h2 style="color: #333;">Hi ${username},</h2>
        <p style="font-size: 16px; color: #555;">
          This is a confirmation that your password for your <strong>SneakShop</strong> account has been successfully changed.
        </p>
        <p style="font-size: 16px; color: #555;">
          If you made this change, no further action is needed.
        </p>
        <p style="font-size: 16px; color: #555;">
          If you did NOT change your password, please reset it immediately or contact our support team.
        </p>
        <p style="margin-top: 30px; font-size: 14px; color: #aaa;">
          Thank you for using <strong>SneakShop</strong>!
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
