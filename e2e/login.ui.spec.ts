import { test, expect } from '@playwright/test';

test('page loads with login inputs and button', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByPlaceholder('Email')).toBeVisible();
  await expect(page.getByPlaceholder('Password')).toBeVisible();
  await expect(page.getByRole('button', { name: /login|sign in/i })).toBeVisible();
});

test('successful login redirects to dashboard', async ({ page }) => {
  await page.goto('/');
  await page.getByPlaceholder('Email').fill('student@example.com');
  await page.getByPlaceholder('Password').fill('password123');
  await page.getByRole('button', { name: /login|sign in/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
});

test('failed login shows an error message', async ({ page }) => {
  await page.goto('/');
  await page.getByPlaceholder('Email').fill('student@example.com');
  await page.getByPlaceholder('Password').fill('wrong-password');
  await page.getByRole('button', { name: /login|sign in/i }).click();
  await expect(page.getByText(/invalid credentials|incorrect/i)).toBeVisible();
});

test('empty form submission does not navigate to dashboard', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /login|sign in/i }).click();
  await expect(page).not.toHaveURL(/\/dashboard/);
});

test('button shows loading state while request is in flight', async ({ page }) => {
  await page.goto('/');
  await page.getByPlaceholder('Email').fill('student@example.com');
  await page.getByPlaceholder('Password').fill('password123');
  const button = page.getByRole('button', { name: /login|sign in/i });
  await button.click();
  await expect(button).toBeDisabled();
});
