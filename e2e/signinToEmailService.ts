import { Page } from "@playwright/test";

export const signinToEmailService = async (page: Page) => {
  await page.locator('input[type="email"]').click();
  await page
    .locator('input[type="email"]')
    .fill(process.env.PLAYWRIGHT_TEST_EMAIL_USER as string);
  await page.locator('input[type="password"]').click();
  await page
    .locator('input[type="password"]')
    .fill(process.env.PLAYWRIGHT_TEST_EMAIL_PASSWORD as string);
  await page.locator("#login-signin-button").click();
};
