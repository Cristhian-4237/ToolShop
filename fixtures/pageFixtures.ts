import { test as base } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';

type MyPageFixtures = {
    dashboardPage: DashboardPage;
};

export const pageFixtures = base.extend<MyPageFixtures>({
    dashboardPage: async ({ page }, use) => {
        await use(new DashboardPage(page));
    },
});
