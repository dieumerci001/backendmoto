import nodemailer from 'nodemailer';

const t = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

try {
  await t.sendMail({
    from: `"MMS Rwanda" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: 'MMS Rwanda - Email Test',
    html: `<h2>✅ Email is working!</h2><p>Your verification code would look like: <strong style="font-size:32px;letter-spacing:8px;color:#004a99">847291</strong></p>`
  });
  console.log('✅ Email sent successfully to', process.env.EMAIL_USER);
} catch(e) {
  console.error('❌ Failed:', e.message);
}
process.exit();
