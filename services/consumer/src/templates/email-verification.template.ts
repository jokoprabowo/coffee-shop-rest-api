export function verificationEmailTemplate(
  appName: string,
  fullName: string,
  verificationUrl: string,
  expiredIn: string,
  year = new Date().getFullYear(),
) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Email Verification</title>

  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
      font-family: Arial, Helvetica, sans-serif;
    }

    .wrapper {
      width: 100%;
      padding: 20px;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
    }

    .header {
      background-color: #16a34a;
      padding: 20px;
      text-align: center;
    }

    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 24px;
    }

    .content {
      padding: 30px;
      color: #333333;
      font-size: 14px;
      line-height: 1.6;
    }

    .button-wrapper {
      text-align: center;
      margin: 30px 0;
    }

    .button {
      background-color: #16a34a;
      color: #ffffff !important;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      display: inline-block;
    }

    .footer {
      background-color: #f9fafb;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
    }

    .footer a {
      color: #16a34a;
      word-break: break-all;
    }
  </style>
</head>

<body>
  <div class="wrapper">
    <div class="container">

      <div class="header">
        <h1>${appName}</h1>
      </div>

      <div class="content">
        <p>Hello <strong>${fullName}</strong>,</p>

        <p>
          Thank you for registering with <strong>${appName}</strong>.
          Please verify your email address by clicking the button below:
        </p>

        <div class="button-wrapper">
          <a href="${verificationUrl}" class="button">
            Verify Email
          </a>
        </div>

        <p>
          This verification link is valid for <strong>${expiredIn}</strong>.
          If you did not create an account, you can safely ignore this email.
        </p>

        <p>
          Best regards,<br />
          The ${appName} Team
        </p>
      </div>

      <div class="footer">
        <p>© ${year} ${appName}. All rights reserved.</p>
        <p>
          If the button doesn’t work, copy and paste the following link into your browser:<br />
          <a href="${verificationUrl}">
            ${verificationUrl}
          </a>
        </p>
      </div>

    </div>
  </div>
</body>
</html>
`;
}
