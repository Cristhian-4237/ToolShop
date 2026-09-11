import { test, expect } from '@playwright/test';
import { ENV } from '../../data/environment';

test.describe('Toolshop REST API - Core Backend Validation Suite', () => {

    test('Should successfully authenticate admin user via API POST request', async ({ request }) => {
        // CORRECCIÓN: Estructura idéntica con headers en minúsculas para coincidencia estricta
        const response = await request.post(`${ENV.apiUrl}/users/login`, {
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json'
            },
            data: {
                email: ENV.admin.email,
                password: ENV.admin.password
            }
        });

        await expect(response).toBeOK();

        const responseBody = await response.json();

        expect(responseBody).toHaveProperty('access_token');
        expect(typeof responseBody.access_token).toBe('string');
    });
});
