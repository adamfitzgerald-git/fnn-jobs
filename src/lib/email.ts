import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "localhost",
  port: parseInt(process.env.SMTP_PORT || "587"),
  auth: process.env.SMTP_USER
    ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
    : undefined,
});

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || "noreply@firstnationsnews.com.au",
      to,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error("Email send failed:", error);
    return { success: false, error };
  }
}

export function eoiEmailHtml({
  jobseekerName,
  jobseekerEmail,
  jobseekerBio,
  message,
  jobTitle,
  employerName,
}: {
  jobseekerName: string;
  jobseekerEmail: string;
  jobseekerBio?: string;
  message: string;
  jobTitle?: string;
  employerName: string;
}) {
  return `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #1A2420;">New Expression of Interest — FNN Employment Hub</h2>
      <p>A jobseeker has expressed interest${jobTitle ? ` in <strong>${jobTitle}</strong>` : ""} at <strong>${employerName}</strong>.</p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
      <p><strong>Name:</strong> ${jobseekerName}</p>
      <p><strong>Email:</strong> <a href="mailto:${jobseekerEmail}">${jobseekerEmail}</a></p>
      ${jobseekerBio ? `<p><strong>Bio:</strong> ${jobseekerBio}</p>` : ""}
      <p><strong>Message:</strong></p>
      <p style="background: #F5F1EB; padding: 15px; border-radius: 6px;">${message}</p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
      <p style="color: #666; font-size: 14px;">This message was sent via the <a href="${process.env.NEXTAUTH_URL}">FNN Employment Hub</a>.</p>
    </div>
  `;
}

export function registrationEmailHtml({ name }: { name: string }) {
  return `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #1A2420;">Welcome to the FNN Employment Hub</h2>
      <p>Hi ${name},</p>
      <p>Thank you for registering with the First Nations News Employment Hub.</p>
      <p>You can now:</p>
      <ul>
        <li>Save jobs that interest you</li>
        <li>Express interest in roles and connect with employers</li>
        <li>Manage your profile from your dashboard</li>
      </ul>
      <p><a href="${process.env.NEXTAUTH_URL}/dashboard" style="display: inline-block; background: #1D9E75; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none;">Go to your dashboard</a></p>
      <p style="color: #666; font-size: 14px; margin-top: 20px;">— The FNN Employment Hub Team</p>
    </div>
  `;
}
