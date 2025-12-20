import config, { mailer } from '../config';
import { verificationEmailTemplate } from '../template';

class EmailService {
  private readonly mailer: typeof mailer;

  constructor(emailClient: typeof mailer) {
    this.mailer = emailClient;
  }

  public async sendVerificationEmail(to: string, token: string): Promise<void> {
    const verificationLink = `http://localhost:3000/verify?token=${token}`;
    const verificationTemplate = verificationEmailTemplate(verificationLink);

    const mailOptions = {
      from: `"Coffee Shop" <${config.SMTP_USER}>`,
      to,
      subject: 'Email Verification',
      html: verificationTemplate,
    };

    await this.mailer.sendMail(mailOptions);
  }
};

export default EmailService;
