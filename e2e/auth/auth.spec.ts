import { test, expect } from "@playwright/test";
import { createFakeUser } from "../fakeData";
import { signinToEmailService } from "../signinToEmailService";

test.describe("auth flow", () => {
  test.describe("valid inputs", () => {
    let user: { name: string; email: string; password: string };

    test.beforeAll(() => {
      user = createFakeUser();
    });

    test("Should display a verify email message, on successful signup \n& Should navigate to login with a email successfully verified message displayed on successful email verification", async ({
      page,
    }) => {
      const slowExpect = expect.configure({ timeout: 20000 });

      test.setTimeout(120000);

      //signup
      await page.goto(process.env.PLAYWRIGHT_TEST_BASE_URL as string);
      await page.getByRole("link", { name: "Sign up" }).click();
      await page.getByLabel("Name").click();
      await page.getByLabel("Name").fill(user.name);
      await page.getByLabel("Email").click();
      await page.getByLabel("Email").fill(user.email);
      await page.getByLabel("Password", { exact: true }).click();
      await page.getByLabel("Password", { exact: true }).fill(user.password);
      await page.getByLabel("Confirm Password").click();
      await page.getByLabel("Confirm Password").fill(user.password);
      await page.getByRole("checkbox").check();
      await page.getByLabel("Register").click();

      await slowExpect(page.getByRole("heading")).toContainText(
        "Click the link in your mail to verify the email."
      );

      //verify email
      await page.goto(process.env.PLAYWRIGHT_TEST_EMAIL_SERVER as string);
      let emailInbox = await page.getByText("PlanCraftr").nth(1);

      if (!(await emailInbox.isVisible())) {
        await signinToEmailService(page);
      }

      await page.getByText("PlanCraftr").nth(1).click();
      await page
        .locator("li")
        .filter({ hasText: "Verify Email" })
        .first()
        .click();

      await slowExpect(page.getByText(`To: ${user.email}`)).toBeVisible();

      await page.getByText("HTML").click();

      await expect(
        page.getByRole("heading", { name: "Verify Email" })
      ).toBeVisible();

      await page.getByRole("link", { name: "Verify Your Email" }).click();

      await slowExpect(
        page.getByText("Email successfully verified.")
      ).toBeVisible();

      //login
      await page.getByLabel("Email").click();
      await page.getByLabel("Email").fill(user.email);
      await page.getByLabel("Password", { exact: true }).click();
      await page.getByLabel("Password", { exact: true }).fill(user.password);
      await page.getByLabel("login").click();

      await slowExpect(
        page.getByRole("heading", { name: "Dashboard" })
      ).toBeVisible();

      //logout
      await page.getByRole("button", { name: "LogOut" }).click();

      await expect(
        page.getByRole("heading", { name: "PlanCraftr" })
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "Get started" })
      ).toBeVisible();

      //forgot password

      //---get password reset link---
      await page.getByRole("link", { name: "Log in" }).click();
      await page.getByRole("link", { name: "Forgot password?" }).click();
      await page.getByLabel("Email").click();
      await page.getByLabel("Email").fill(user.email);
      await page.getByLabel("Register").click();

      await slowExpect(page.getByRole("heading")).toContainText(
        "A password reset link has been sent to your email address. Please check your inbox and click the link to reset your password."
      );

      //---reset password---
      await page.goto(process.env.PLAYWRIGHT_TEST_EMAIL_SERVER as string);
      //   const emailInbox2 = await page.getByText("PlanCraftr").nth(1);

      //   console.log("inbox visible: ", await emailInbox2.isVisible());

      //   if (!(await emailInbox2.isVisible())) {
      //     await signinToEmailService(page);
      //   }

      await page.getByText("PlanCraftr").nth(1).click();
      await page.getByText("Reset Password").first().click();

      await slowExpect(page.getByText(`To: ${user.email}`)).toBeVisible();

      await page.getByText("HTML").click();

      await expect(
        page.getByRole("heading", { name: "Password Reset" })
      ).toBeVisible();

      await page.getByRole("link", { name: "Reset Your Password" }).click();

      await slowExpect(
        page.getByRole("heading", { name: "Reset password" })
      ).toBeVisible();

      const user2 = createFakeUser();
      await page.getByLabel("New password", { exact: true }).click();
      await page
        .getByLabel("New password", { exact: true })
        .fill(user2.password);
      await page.getByLabel("Confirm new password").click();
      await page.getByLabel("Confirm new password").fill(user2.password);
      await page.getByLabel("Reset").click();

      await slowExpect(
        page.getByText("Password reset successful.")
      ).toBeVisible();
      await slowExpect(
        page.getByRole("heading", { name: "Log in" })
      ).toBeVisible();

      //---login again to verify password reset---
      await page.getByLabel("Email").click();
      await page.getByLabel("Email").fill(user.email);
      await page.getByLabel("Password", { exact: true }).click();
      await page.getByLabel("Password", { exact: true }).fill(user2.password);
      await page.getByLabel("login").click();

      await slowExpect(
        page.getByRole("heading", { name: "Dashboard" })
      ).toBeVisible();

      await page.getByRole("button", { name: "LogOut" }).click();
      await expect(
        page.getByRole("heading", { name: "PlanCraftr" })
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "Get started" })
      ).toBeVisible();
    });
  });
});
