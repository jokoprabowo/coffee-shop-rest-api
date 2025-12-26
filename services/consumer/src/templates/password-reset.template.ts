export function passwordResetEmailTemplate(
  appName: string,
  fullName: string,
  resetPasswordUrl: string,
  expiredIn: string,
  year = new Date().getFullYear(),
): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Reset Password</title>

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
      background-color: #2563eb;
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
      background-color: #2563eb;
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
      color: #2563eb;
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
          We received a request to reset the password for your account.
          Click the button below to proceed:
        </p>

        <div class="button-wrapper">
          <a href="${resetPasswordUrl}" class="button">
            Reset Password
          </a>
        </div>

        <p>
          This link is valid for <strong>${expiredIn}</strong>.
          If you did not request a password reset, please ignore this email.
        </p>

        <p>
          Thank you,<br />
          The ${appName} Team
        </p>
      </div>

      <div class="footer">
        <p>© ${year} ${appName}. All rights reserved.</p>
      </div>

    </div>
  </div>
</body>
</html>
`;
}
