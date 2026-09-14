import { test as setup, expect } from '@playwright/test';
import { ENV } from '../data/environment';
import * as fs from 'fs';
import * as path from 'path';

setup('Global Admin Authentication', async ({ request }) => {
  
  console.log(`[AUTH] Initiating authentication request to: ${ENV.apiUrl}/users/login`);

  const response = await request.post(`${ENV.apiUrl}/users/login`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    data: {
      email: ENV.admin.email,
      password: ENV.admin.password,
    },
  });

  
  expect(response.ok(), `[AUTH ERROR] HTTP request failed with status: ${response.status()}`).toBeTruthy();

  
  const contentType = response.headers()['content-type'] || '';
  if (!contentType.includes('application/json')) {
    const rawBody = await response.text();
    throw new Error(
      `[AUTH ERROR] Expected 'application/json' response header but received '${contentType}'.\n` +
      `Ensure TOOLSHOP_API_URL in the .env points to the correct subdomain (https://practicesoftwaretesting.com).\n` +
      `Response Body Preview (First 200 chars):\n${rawBody.substring(0, 200)}`
    );
  }

  
  const responseBody = await response.json();
  const jwtToken = responseBody.access_token;

  expect(jwtToken, '[AUTH ERROR] Authentication payload is missing the access_token property.').toBeDefined();

  
  const authStatePath = path.resolve('.auth/admin-state.json');
  
  
  const storageState = {
    cookies: [],
    origins: [
      {
        origin: new URL(ENV.baseUrl).origin,
        localStorage: [
          {
            name: 'token',
            value: jwtToken,
          },
        ],
      },
    ],
  };

  
  fs.mkdirSync(path.dirname(authStatePath), { recursive: true });
  fs.writeFileSync(authStatePath, JSON.stringify(storageState, null, 2));
  
  console.log(`[AUTH] Authentication state successfully generated at: ${authStatePath}`);
});
