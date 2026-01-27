import config, { mailer } from '../config';
import { verificationEmailTemplate, passwordResetEmailTemplate } from '../templates';

class EmailService {
  constructor(private readonly email: typeof mailer) {}

  public async sendVerificationEmail(to: string, fullname: string, token: string, expiresAt: string): Promise<void> {
    const verificationLink = `http://localhost:3000/verify?token=${token}`;
    const verificationTemplate = verificationEmailTemplate('Coffee Shop', fullname, verificationLink, expiresAt);

    const mailOptions = {
      from: `"Coffee Shop" <${config.SMTP_USER}>`,
      to,
      subject: 'Email Verification',
      html: verificationTemplate,
    };

    await this.email.sendMail(mailOptions);
  }

  public async sendResetPassword(to: string, fullname: string, token: string, expiresAt: string): Promise<void> {
    const resetPasswordLink = `http://localhost:3000/reset-password?token=${token}`;
    const resetPasswordTemplate = passwordResetEmailTemplate('Coffee Shop', fullname, resetPasswordLink, expiresAt);

    const mailOptions = {
      from: `"Coffee Shop" <${config.SMTP_USER}>`,
      to,
      subject: 'Reset Password',
      html: resetPasswordTemplate,
    };

    await this.email.sendMail(mailOptions);
  }
};

export default EmailService;
