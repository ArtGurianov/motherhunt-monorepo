"use server";

import { transporter } from "@/lib/nodemailer";

const styles = {
  container:
    "max-width:500px;margin:16px auto;padding:16px;border:1px solid #ddd;border-radius:8px;",
  heading: "font-size:24px;color:#333",
  paragraph: "font-size:16px",
  link: "display:inline-block;margin-top:16px;padding:8px 16px;background:#007BFF;color:#FFF;text-decoration:none;border-radius:4px;",
};

export const sendEmail = async ({
  to,
  subject,
  meta,
}: {
  to: string;
  subject: string;
  meta: {
    description: string;
    link: string;
  };
}) => {
  const mailOptions = {
    from: process.env.NODEMAILER_USER,
    to,
    subject: `MotherHunt - ${subject}`,
    html: `
      <div style="${styles.container}">
        <h1 style="${styles.heading}">${subject}</h1>
        <p style="${styles.paragraph}">${meta.description}</p>
        <a href="${meta.link}" style="${styles.link}">Click here</a>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (e) {
    console.error("sendEmailAction: ", e);
    return { success: false };
  }
};
