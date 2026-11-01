import { expect, test } from "@playwright/test";

const SHOTS = "test-results/screens";

test("a super admin manages users and content", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 860 });
  // admin@e2e.test is created as a verified SUPER_ADMIN by `admin:create` (see scripts/e2e-server.mjs).
  await page.goto("/login");
  await page.getByLabel("Email").fill("admin@e2e.test");
  await page.getByLabel("Password").fill("a long enough password");
  await page.getByRole("button", { name: "Sign in" }).click();
  // Staff who never onboarded land straight in the back office.
  await expect(page).toHaveURL(/\/admin$/);

  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  await expect(page.getByText("Registered users")).toBeVisible();
  await page.screenshot({ path: `${SHOTS}/30-admin-dashboard.png`, fullPage: true });

  // Users
  await page.getByRole("link", { name: "Users", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Users" })).toBeVisible();
  await page.screenshot({ path: `${SHOTS}/31-admin-users.png`, fullPage: true });

  // Content: open the first lesson of the first journey and save an edit.
  await page.getByRole("link", { name: "Content", exact: true }).click();
  await page.getByRole("link", { name: "Communication Mastery" }).click();
  await page.getByRole("link", { name: "First Impressions" }).click();
  await page.locator("table a[href^='/admin/content/lessons/']").first().click();
  await expect(page.getByText("1 · Hook")).toBeVisible();
  const hook = page.locator("textarea[name=hook]");
  await hook.fill(`${await hook.inputValue()} `);
  await page.getByRole("button", { name: "Save lesson" }).click();
  await expect(page.getByText("Saved.", { exact: true })).toBeVisible();
  await page.screenshot({ path: `${SHOTS}/32-admin-lesson-editor.png` });

  // Broken JSON is rejected with a clear message.
  await page.locator("textarea[name=exerciseConfig]").fill("{ not json");
  await page.getByRole("button", { name: "Save lesson" }).click();
  await expect(page.getByText("Exercise config isn't valid JSON.")).toBeVisible();

  // Create a journey (draft).
  await page.goto("/admin/content/journeys/new");
  await page.locator("input[name=title]").fill("Negotiation Lab");
  await page.locator("input[name=slug]").fill("negotiation-lab");
  await page.getByRole("button", { name: "Create journey" }).click();
  await expect(page).toHaveURL(/\/admin\/content\/journeys\/[0-9a-f-]{36}/);
  await expect(page.getByRole("heading", { name: "Negotiation Lab" })).toBeVisible();

  // Audit log records the edits.
  await page.goto("/admin/audit");
  await expect(page.getByText("journey.create")).toBeVisible();
  await expect(page.getByText("lesson.update")).toBeVisible();
});
