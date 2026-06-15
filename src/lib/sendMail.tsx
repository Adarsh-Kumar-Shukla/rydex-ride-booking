import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

export const sendMail = async (to: string, subject: string, html: string) => {
  try {
    console.log("📧 Sending email to:", to);

    const info = await transporter.sendMail({
      from: `"RYDEX" <${process.env.EMAIL}>`,
      to,
      subject,
      html,
    });

    console.log("✅ EMAIL SENT SUCCESSFULLY");
    console.log("Message ID:", info.messageId);

    return info;
  } catch (error) {
    console.error("❌ EMAIL FAILED:");
    console.error(error);
    throw error;
  }
};