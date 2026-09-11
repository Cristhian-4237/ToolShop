import { pageFixtures } from './pageFixtures';
import { DashboardPage } from '../pages/DashboardPage';

type MyShoppingFixtures = {
    loadedDashboardPage: DashboardPage;
};

// Extendemos de la capa de páginas para poder usar 'dashboardPage' como dependencia
export const shoppingFixtures = pageFixtures.extend<MyShoppingFixtures>({
    loadedDashboardPage: async ({ dashboardPage }, use) => {
        await dashboardPage.goto();        
        await use(dashboardPage);
    },
});
