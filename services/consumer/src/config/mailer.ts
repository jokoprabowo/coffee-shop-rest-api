import nodemailer from 'nodemailer';
import config from './';

export const mailer = nodemailer.createTransport({
  host: config.SMTP_HOST,
  port: Number(config.SMTP_PORT || 587),
  secure: false, 
  auth: {
    user: config.SMTP_USER,
    pass: config.SMTP_PASS
  }
});