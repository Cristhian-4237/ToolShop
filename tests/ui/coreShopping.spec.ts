import { test, expect } from '../../fixtures/basePage';

test.describe('Toolshop E-commerce - Core UI Validation Suite', () => {

    test('Should verify home dashboard loads successfully', async ({ loadedDashboardPage }) => {
        
        await expect(loadedDashboardPage.titleLocator).toBeVisible();
        
        await expect(loadedDashboardPage.navbar.cartQuantityLocator).toBeHidden();
    });

    test('Should successfully navigate to product details view and verify add button visibility', async ({ loadedDashboardPage }) => {
        await expect(loadedDashboardPage.titleLocator).toBeVisible();
        await loadedDashboardPage.addProductToCart('Combination Pliers');

    });
    
    test('Should ensure the cart badge is completely hidden from the DOM upon initial anonymous session load', async ({ loadedDashboardPage }) => {
        
        await expect(loadedDashboardPage.titleLocator, '[VALIDATION ERROR] The core home dashboard header failed to render visible.').toBeVisible();
        await expect(loadedDashboardPage.navbar.cartQuantityLocator, '[VALIDATION ERROR] The cart badge failed to render hidden.').toBeHidden();
        
    });
    test('Should increment cart badge count by one when a single product is added', async ({ loadedDashboardPage }) => {
        await expect(loadedDashboardPage.titleLocator).toBeVisible();
        await loadedDashboardPage.addProductToCart('Combination Pliers');
        await expect(loadedDashboardPage.navbar.cartQuantityLocator).toHaveText('1');
    });
    test('Should dynamically update cart badge total when multiple quantities of the same product are added', async ({ loadedDashboardPage }) => {
        await expect(loadedDashboardPage.titleLocator).toBeVisible();
        await loadedDashboardPage.addMultipleProductsToCart('Combination Pliers', 4);
        await expect(loadedDashboardPage.navbar.cartQuantityLocator).toHaveText('4');
    });
    test.only('Should persist selected items and accurate cart count when executing a hard browser reload', async ({ loadedDashboardPage }) => {
        await expect(loadedDashboardPage.titleLocator).toBeVisible();
        await loadedDashboardPage.addMultipleProductsToCart('Combination Pliers', 4);
        await loadedDashboardPage.reloadPage();
        await expect(loadedDashboardPage.navbar.cartQuantityLocator).toHaveText('4');

    });
});
