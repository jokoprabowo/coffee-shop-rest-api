export function verificationEmailTemplate(verifyUrl: string) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <style>
      .container {
        max-width: 480px;
        margin: auto;
        background: #ffffff;
        padding: 24px;
        border-radius: 12px;
        font-family: Arial, sans-serif;
        border: 1px solid #e2e2e2;
      }
      .title {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 16px;
        color: #333;
        text-align: center;
      }
      .btn-wrapper {
        text-align: center;
        margin: 20px 0;
      }
      .btn {
        display: inline-block;
        background-color: #4f46e5;
        color: white !important;
        padding: 12px 24px;
        border-radius: 8px;
        text-decoration: none;
        font-size: 16px;
        font-weight: bold;
      }
      .link-wrapper {
        text-align: center;
        margin-top: 12px;
      }
      .link-text {
        font-size: 14px;
        word-break: break-all;
        color: #4f46e5;
        text-align: center;
        display: inline-block;
        max-width: 100%;
      }
      .footer {
        margin-top: 24px;
        font-size: 12px;
        color: #777;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="title">Verify Your Email</div>

      <p style="text-align:center;">
        Click the button below to verify your email address:
      </p>

      <div class="btn-wrapper">
        <a href="${verifyUrl}" class="btn">Verify Email</a>
      </div>

      <p style="text-align:center;">
        If the button doesn't work, use the link below:
      </p>

      <div class="link-wrapper">
        <span class="link-text">${verifyUrl}</span>
      </div>

      <div class="footer">
        If you didn't request this, please ignore this email.
      </div>
    </div>
  </body>
  </html>
`;
}
