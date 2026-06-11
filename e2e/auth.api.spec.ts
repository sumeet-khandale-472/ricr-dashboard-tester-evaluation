import { test, expect } from '@playwright/test';

const uniqueEmail = `qa_${Date.now()}_${Math.random().toString(36).slice(2, 8)}@example.com`;

test('register succeeds with valid data', async ({ request }) => {
  const response = await request.post('/auth/register', {
    data: {
      userName: 'Playwright QA',
      email: uniqueEmail,
      password: 'Secret123',
      userType: 1,
    },
  });

  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.success).toBe(true);
  expect(body.data.email).toBe(uniqueEmail);
});

test('register fails when email is missing', async ({ request }) => {
  const response = await request.post('/auth/register', {
    data: {
      userName: 'Playwright QA',
      password: 'Secret123',
      userType: 1,
    },
  });

  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.success).toBe(false);
});

test('login sets cookie for web client', async ({ request }) => {
  const response = await request.post('/auth/login', {
    data: { email: uniqueEmail, password: 'Secret123' },
  });

  expect(response.status()).toBe(200);
  expect(response.headers()['set-cookie']).toContain('accessToken=');
});

test('login returns accessToken for mobile client', async ({ request }) => {
  const response = await request.post('/auth/login', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Android 13; Mobile)' },
    data: { email: uniqueEmail, password: 'Secret123' },
  });

  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(typeof body.data.accessToken).toBe('string');
  expect(body.data.accessToken.length).toBeGreaterThan(0);
});

test('login fails with invalid credentials', async ({ request }) => {
  const response = await request.post('/auth/login', {
    data: { email: uniqueEmail, password: 'WrongPass' },
  });

  expect(response.status()).toBe(401);
  const body = await response.json();
  expect(body.success).toBe(false);
});

test('GET /me returns unauthorized without a token', async ({ request }) => {
  const response = await request.get('/auth/me');

  expect(response.status()).toBe(401);
  const body = await response.json();
  expect(body.success).toBe(false);
});

test('GET /me returns authorized data when using cookie session', async ({ request }) => {
  const login = await request.post('/auth/login', {
    data: { email: uniqueEmail, password: 'Secret123' },
  });
  const cookieHeader = login.headers()['set-cookie'] || '';

  const response = await request.get('/auth/me', {
    headers: { cookie: cookieHeader },
  });

  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(typeof body.data.id).toBe('number');
});

test('logout clears the accessToken cookie', async ({ request }) => {
  const login = await request.post('/auth/login', {
    data: { email: uniqueEmail, password: 'Secret123' },
  });
  const cookieHeader = login.headers()['set-cookie'] || '';

  const response = await request.post('/auth/logout', {
    headers: { cookie: cookieHeader },
  });

  expect(response.status()).toBe(200);
  expect(response.headers()['set-cookie']).toContain('accessToken=;');
});
