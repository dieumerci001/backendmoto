import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (to, fullName, code) => {
  await transporter.sendMail({
    from: `"MMS Rwanda" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verify your MMS Rwanda account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; border: 1px solid #dbe2e8; border-radius: 10px; overflow: hidden;">
        <div style="background: #004a99; padding: 24px; text-align: center;">
          <h2 style="color: white; margin: 0;">MMS Rwanda 🇷🇼</h2>
        </div>
        <div style="padding: 32px;">
          <p style="font-size: 16px;">Hello <strong>${fullName}</strong>,</p>
          <p style="color: #64748b;">Use the code below to verify your account. It expires in <strong>10 minutes</strong>.</p>
          <div style="text-align: center; margin: 32px 0;">
            <span style="font-size: 40px; font-weight: 700; letter-spacing: 10px; color: #004a99;">${code}</span>
          </div>
          <p style="color: #94a3b8; font-size: 13px;">If you did not create an account, ignore this email.</p>
        </div>
      </div>
    `,
  });
};
