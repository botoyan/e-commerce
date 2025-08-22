import nodemailer from "nodemailer";

export async function sendOrderConfirmationEmail(
  to,
  username,
  orderId,
  totalAmount
) {
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
    subject: `✅ Your SneakShop Order Confirmation (#${orderId})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; background: #f4f4f4; border-radius: 10px;">
        <h2 style="color: #333;">Hi ${username},</h2>
        <p style="font-size: 16px; color: #555;">
          Thanks for shopping with <strong>SneakShop</strong>! Your order has been received and is now being processed.
        </p>

        <div style="margin: 30px 0; background: #fff; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
          <p style="font-size: 16px; margin-bottom: 8px;"><strong>Order ID:</strong> ${orderId}</p>
          <p style="font-size: 16px; margin-bottom: 8px;"><strong>Total:</strong> $${totalAmount.toFixed(
            2
          )}</p>
          <p style="font-size: 16px;"><strong>Status:</strong> Pending</p>
        </div>

        <p style="font-size: 16px; color: #555;">
          We'll notify you once your order has been shipped.
        </p>

        <a href="${
          process.env.BASE_URL
        }/orders/${orderId}" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #111; color: white; text-decoration: none; border-radius: 5px;">
          View Your Order
        </a>

        <p style="margin-top: 30px; font-size: 14px; color: #aaa;">
          If you have any questions, just reply to this email — we're happy to help!
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
