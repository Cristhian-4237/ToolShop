import { test } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';

test('Manual Verification of Dashboard Locators', async ({ page }) => {
    // 1. Instanciamos tu clase manualmente para esta prueba de control
    const dashboard = new DashboardPage(page);

    // 2. Navegamos al sitio web de Toolshop
    await page.goto('https://practicesoftwaretesting.com');

    // 3. ¡LA PIEZA CLAVE! Congelamos la ejecución y abrimos el inspector interactivo
    await page.pause();
});
