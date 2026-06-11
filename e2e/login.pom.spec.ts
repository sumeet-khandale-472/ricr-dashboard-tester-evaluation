import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test('page loads correctly using the page object', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.expectVisible();
});

test('successful login redirects to dashboard using the page object', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('student@example.com', 'password123');
  await expect(page).toHaveURL(/\/dashboard/);
});

test('failed login shows an error message using the page object', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('student@example.com', 'wrong-password');
  await loginPage.expectErrorVisible();
});

test('empty form submission does not navigate to dashboard using the page object', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.loginButton.click();
  await expect(page).not.toHaveURL(/\/dashboard/);
});

test('loading state is visible while the login request is in flight', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('student@example.com', 'password123');
  await expect(loginPage.loginButton).toBeDisabled();
});
