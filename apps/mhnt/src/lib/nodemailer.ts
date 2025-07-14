import nodemailer from "nodemailer";
import { getEnvConfigServer } from "./config/env";

const getTransporter = () => {
  const envConfig = getEnvConfigServer();
  return nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
      user: envConfig.NODEMAILER_USER,
      pass: envConfig.NODEMAILER_APP_PASSWORD,
    },
  });
};

export const transporter = getTransporter();
