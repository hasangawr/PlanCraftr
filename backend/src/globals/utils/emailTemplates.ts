export const enum EmailType {
  VerifyEmail = 'VERIFY_EMAIL',
  ResetPassword = 'RESET_PASSWORD',
}

const formatEmailVerifyMail = (link: string) => {
  const email = `
    
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Email Verification</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f7; color: #333333;">
              <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                  <div style="background-color: #6366F1; color: #ffffff; text-align: center; padding: 20px 10px;">
                      <h1 style="margin: 0; font-size: 24px;">Email Verification</h1>
                  </div>
                  <div style="padding: 20px 30px;">
                      <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Hello,</p>
                      <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Thank you for signing in! Please verify your email address by clicking the button below. This helps us ensure your account's security.</p>
                      <p style="text-align: center;">
                          <a href="${link}" style="display: inline-block; background-color: #6366F1; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 5px; font-size: 16px;">Verify Your Email</a>
                      </p>
                      <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">If you did not sign in or receive this email by mistake, you can safely ignore it.</p>
                  </div>
                  <div style="text-align: center; font-size: 14px; color: #666666; padding: 20px 10px;">
                      <p>&copy; 2024 PlanCraftr. All rights reserved.</p>
                      <p><a href="https://plancraftr.com" style="color: #6366F1; text-decoration: none;">Visit our website</a></p>
                  </div>
              </div>
          </body>
          </html>
    
      `;

  return email;
};

const formatPasswordResetEmail = (link: string) => {
  const email = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Password Reset</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f7; color: #333333;">
              <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                  <div style="background-color: #ff6f61; color: #ffffff; text-align: center; padding: 20px 10px;">
                      <h1 style="margin: 0; font-size: 24px;">Password Reset</h1>
                  </div>
                  <div style="padding: 20px 30px;">
                      <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Hello,</p>
                      <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">You requested a password reset for your account. Click the button below to reset your password. If you did not request this, <a href="mailto:support-team@plancraftr.com" style="color: #ff6f61; text-decoration: none;">contact our support team.</a></p>
                      <p style="text-align: center;">
                          <a href="${link}" style="display: inline-block; background-color: #ff6f61; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 5px; font-size: 16px;">Reset Your Password</a>
                      </p>
                      <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">This password reset link is valid for the next 24 hours.</p>
                  </div>
                  <div style="text-align: center; font-size: 14px; color: #666666; padding: 20px 10px;">
                      <p>&copy; 2024 PlanCraftr. All rights reserved.</p>
                      <p><a href="https://plancraftr.com" style="color: #ff6f61; text-decoration: none;">Visit our website</a></p>
                  </div>
              </div>
          </body>
          </html>
  
      `;

  return email;
};

const formatEmail = (link: string, type: EmailType): string | undefined => {
  if (type === EmailType.VerifyEmail) {
    return formatEmailVerifyMail(link);
  } else if (type === EmailType.ResetPassword) {
    return formatPasswordResetEmail(link);
  }
};

export default formatEmail;
