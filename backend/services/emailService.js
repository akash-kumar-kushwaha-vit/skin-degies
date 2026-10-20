const nodemailer = require("nodemailer");

const escapeHtml = (value) =>
  value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);

const sendEmailVerification = async ({ to, name, token }) => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error("SMTP_HOST, SMTP_USER, and SMTP_PASS must be configured to send email.");
  }

  const frontendUrl = process.env.FRONTEND_URL;
  if (!frontendUrl) {
    throw new Error("FRONTEND_URL must be configured to create email verification links.");
  }

  const port = Number(SMTP_PORT || 587);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("SMTP_PORT must be a valid port number.");
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: process.env.SMTP_SECURE === "true" || port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  const verificationUrl = new URL("/verify-email", frontendUrl);
  verificationUrl.searchParams.set("token", token);
  const safeName = escapeHtml(name);
  const safeVerificationUrl = escapeHtml(verificationUrl.href);

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || SMTP_USER,
    to,
    subject: "Verify your SkinDegies account",
    text: `Hi ${name},\n\nVerify your email address to activate your SkinDegies account:\n${verificationUrl.href}\n\nThis link expires in 24 hours. If you did not create an account, you can ignore this email.`,
    html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#172033"><div style="padding:28px;border-radius:16px;background:#f4f7fb"><p style="color:#2563eb;font-weight:700;letter-spacing:.08em;text-transform:uppercase;font-size:12px">SkinDegies AI</p><h1 style="font-size:24px">Verify your email</h1><p>Hi ${safeName},</p><p>Confirm your email address to activate your SkinDegies account and continue to your clinical workspace.</p><p style="margin:28px 0"><a href="${safeVerificationUrl}" style="background:#2563eb;color:#fff;text-decoration:none;padding:13px 20px;border-radius:10px;font-weight:700">Verify email address</a></p><p style="font-size:13px;color:#64748b">This link expires in 24 hours. If you did not create an account, you can ignore this email.</p></div></div>`,
  });
};

module.exports = { sendEmailVerification };
