import { expect, type Page, test } from "@playwright/test";

const SHOTS = "test-results/screens";
const shot = async (page: Page, name: string) => {
  await page.waitForTimeout(700); // let entrance animations finish
  await page.screenshot({ path: `${SHOTS}/${name}.png`, fullPage: true });
};

async function register(page: Page, email: string, name = "Juan") {
  await page.goto("/");
  await shot(page, "00-landing");
  await page.getByRole("link", { name: "Build my plan" }).click();
  await page.getByLabel("First name").fill(name);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("a long enough password");
  await shot(page, "01-register");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/onboarding/);
}

async function onboard(page: Page) {
  await shot(page, "02-onboarding-intro");
  await page.getByRole("button", { name: "Begin" }).click();
  // Goals (multi)
  await page.getByRole("checkbox", { name: "Communication" }).click();
  await page.getByRole("checkbox", { name: "Confidence" }).click();
  await page.getByRole("checkbox", { name: "Networking" }).click();
  await shot(page, "03-onboarding-goals");
  await page.getByRole("button", { name: "Continue" }).click();
  // Primary goal (auto-advances)
  await page.getByRole("radio", { name: "Communication" }).click();
  // Situations (multi)
  await page.getByRole("checkbox", { name: "In meetings" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("radio", { name: /Intermediate/ }).click();
  await page.getByRole("radio", { name: /15 min/ }).click();
  await page.getByRole("radio", { name: /Every day/ }).click();
  await page.getByRole("radio", { name: /struggle to express it/ }).click();
  // Six self-ratings
  for (let i = 0; i < 6; i++) {
    await expect(page.getByText("How true is this today?")).toBeVisible();
    await page.getByRole("radio", { name: /Sometimes/ }).click();
    await page.waitForTimeout(350);
  }
  await page.getByRole("textbox").fill("Present to leadership without notes and get a decision.");
  await shot(page, "04-onboarding-goal");
  await page.getByRole("button", { name: "Build my plan" }).click();
  await expect(page).toHaveURL(/\/onboarding\/plan/);
  await expect(page.getByRole("heading", { name: "Juan's Growth Plan" })).toBeVisible();
  await shot(page, "05-plan");
}

test("a new learner completes the whole daily loop", async ({ page }) => {
  const email = `juan-${Date.now()}@e2e.test`;
  await register(page, email);
  await onboard(page);

  await page.getByRole("link", { name: "Start Day 1" }).click();
  await expect(page).toHaveURL(/\/home/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Juan");
  await expect(page.getByText("Today's training", { exact: true })).toBeVisible();
  await shot(page, "06-home");

  // Lesson
  await page.getByRole("link", { name: /Start today's training/ }).click();
  await expect(page).toHaveURL(/\/lesson\//);
  await shot(page, "07-lesson-hook");
  for (let i = 0; i < 5; i++) {
    await page.getByRole("button", { name: "Continue" }).click();
    if (i === 2) await shot(page, "08-lesson-concept");
    if (i === 3) await shot(page, "09-lesson-example");
  }
  // Exercise: answer whatever type it is.
  await expect(page.getByText("Practise").first()).toBeVisible();
  const choice = page.getByRole("radiogroup").first();
  if (await page.getByRole("button", { name: "Check my answer" }).isVisible()) {
    await choice.getByRole("radio").first().click();
    await page.getByRole("button", { name: "Check my answer" }).click();
  } else if (await page.getByPlaceholder("Write your version…").isVisible()) {
    await page.getByPlaceholder("Write your version…").fill("I recommend we decide today because the data is clear.");
    await page.getByRole("button", { name: "Get feedback" }).click();
  } else {
    await page.getByRole("button", { name: /Check the order|Get feedback/ }).click();
  }
  await expect(page.getByText(/Instant feedback|Coach feedback/)).toBeVisible();
  await shot(page, "10-exercise-feedback");
  await page.getByRole("button", { name: "Continue" }).click();

  // Mission → reflection → knowledge check
  await expect(page.getByText("Real-world mission").first()).toBeVisible();
  await shot(page, "11-mission");
  await page.getByRole("button", { name: "I'll do it today" }).click();
  await page.getByRole("textbox").fill("I will lead with my point in tomorrow's stand-up.");
  await page.getByRole("button", { name: "Continue" }).click();
  for (let q = 0; q < 3; q++) {
    await page.getByRole("radio").first().click();
    await page.getByRole("button", { name: "Check", exact: true }).click();
    await expect(page.getByText(/Correct\.|Not quite\./)).toBeVisible();
    if (q === 0) await shot(page, "12-quiz");
    await page.getByRole("button", { name: /Next question|See my score/ }).click();
  }
  await expect(page.getByText(/\d\/3/)).toBeVisible();
  await page.getByRole("button", { name: "Finish lesson" }).click();
  await expect(page.getByText("Lesson complete", { exact: true })).toBeVisible();
  await expect(page.getByText(/^\+\d+$/)).toBeVisible();
  await shot(page, "13-complete");
  await page.getByRole("link", { name: "Back to today" }).click();

  // Home now shows the done state and the live mission.
  await expect(page.getByText("Today's training is done", { exact: true })).toBeVisible();
  await shot(page, "14-home-done");
  await page.getByRole("link", { name: /I did it/ }).click();
  await page.getByRole("button", { name: "Yes" }).click();
  await page.getByRole("radio", { name: /Good/ }).click();
  await expect(page.getByText("Reflect for a minute", { exact: true })).toBeVisible();
  await page.getByLabel("What happened?").fill("I asked a question before sharing my view. I was nervous at first.");
  await page.getByLabel("What worked?").fill("Leading with the recommendation.");
  await shot(page, "15-reflection");
  await page.getByRole("button", { name: "Save reflection" }).click();
  await expect(page.getByText("Mission logged.", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Back to today" }).click();

  // Journey + profile reflect progress.
  await page.getByRole("link", { name: "Journey" }).click();
  await expect(page.getByText(/1 of \d+ lessons/)).toBeVisible();
  await shot(page, "16-journey");
  await page.getByRole("link", { name: "Profile" }).click();
  await expect(page.getByText(/XP/).first()).toBeVisible();
  await shot(page, "17-profile");

  // Practice: conversation simulator.
  await page.getByRole("link", { name: "Practice" }).click();
  await shot(page, "18-practice");
  await page.getByRole("link", { name: /potential client/i }).first().click();
  await expect(page.getByLabel("Your reply")).toBeVisible();
  await shot(page, "19-simulator");
  for (const reply of [
    "I lead logistics at a rail company. What brought you to the event today?",
    "That sounds interesting — how are you handling the peak season?",
    "We solved something similar last year by moving bookings online. Would a short call next week help?",
    "Great, let's exchange emails and I'll send a few times.",
  ]) {
    const box = page.getByLabel("Your reply");
    if (!(await box.isVisible())) break;
    await box.fill(reply);
    await page.getByRole("button", { name: "Send reply" }).click();
    await expect(page.getByText(reply)).toBeVisible();
    await expect(page.getByLabel(/is typing/)).toHaveCount(0);
  }
  await page.getByRole("button", { name: /feedback/ }).click();
  await expect(page.getByText(/Instant feedback|Coach feedback/)).toBeVisible();
  await shot(page, "20-simulator-feedback");

  // Coach
  await page.goto("/coach");
  await page.getByRole("button", { name: "How can I sound more confident?" }).click();
  await expect(page.locator("ol li").nth(1)).not.toBeEmpty();
  await page.waitForTimeout(800);
  await shot(page, "21-coach");

  // Explore
  await page.goto("/explore");
  await shot(page, "22-explore");
  await page.locator("a[href^='/explore/']").first().click();
  await expect(page.locator("article h1")).toBeVisible();
  await shot(page, "23-resource");
});

test("protected screens redirect to sign-in and admin is hidden from learners", async ({ page }) => {
  await page.goto("/home");
  await expect(page).toHaveURL(/\/login/);
  await shot(page, "24-login");
  const email = `ana-${Date.now()}@e2e.test`;
  await register(page, email, "Ana");
  const res = await page.goto("/admin");
  expect(res?.status()).toBe(404);
});
