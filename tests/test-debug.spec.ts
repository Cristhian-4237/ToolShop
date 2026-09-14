import { test } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';

test('Manual Verification of Dashboard Locators', async ({ page }) => {
    
    const dashboard = new DashboardPage(page);

    
    await page.goto('https://practicesoftwaretesting.com');

    
    await page.pause();
});
