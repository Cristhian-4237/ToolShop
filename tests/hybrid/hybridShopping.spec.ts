import { test, expect } from '../../fixtures/basePage';
import { ENV } from '../../data/environment';
import { TOOLSHOP_DATA } from '../../data/toolShopData';

test.describe('Toolshop E-commerce - Hybrid Validation Suite', () => {

  test('Should instantly reflect cart item count in UI when items are injected via Backend API', async ({ 
    apiCartController,  
    loadedDashboardPage,
    page 
  }) => {
    // Parámetros comerciales fuertemente tipados con sus tipos nativos
    const targetProductName = TOOLSHOP_DATA.products.pliers;
    const expectedQuantityNumber = 3;
    const expectedQuantityString = '3';

    // 1. RESOLUCIÓN DINÁMICA DE INFRAESTRUCTURA (Aislada en el controlador, sin requests sucios en el spec)
    const liveProductId = await apiCartController.getLiveProductIdByName(targetProductName);

    // 2. PRECONDICIÓN ACELERADA (Backend)
    const finalCartId = await apiCartController.addProductViaApi(liveProductId, expectedQuantityNumber);

    // 3. STATE HANDSHAKE DETERMINISTA (Evidencia certificada de DevTools)
    await page.addInitScript(({ cartId, qty }) => {
      window.sessionStorage.setItem('cart_id', cartId);
      window.sessionStorage.setItem('cart_quantity', qty);
    }, { cartId: finalCartId, qty: expectedQuantityString });

    // 4. E2E NAVEGACIÓN Y VALIDACIÓN VISUAL
    await page.goto(ENV.baseUrl);
    //await loadedDashboardPage.goto();
    // REGLA 6: Web-First Assertions estrictas sobre objetos Locator vivos
    await expect(loadedDashboardPage.titleLocator).toBeVisible();

    await expect(
      loadedDashboardPage.navbar.cartQuantityLocator,
      '[VALIDATION ERROR]: The UI Navbar failed to synchronize with the backend API cart state.'
    ).toHaveText(expectedQuantityString);
  });

  test('Should dynamically update UI item count when backend cart state is decremented via API session mutation', async ({ 
    apiCartController,  
    loadedDashboardPage,
    page 
  }) => {
    // Parámetros comerciales fuertemente tipados con sus tipos nativos exactos
    const targetProductName = TOOLSHOP_DATA.products.pliers;
    const expectedQuantityNumber = 3;
    const modifiedQuantityNumber = 1;
    const modifiedQuantityString = '1';

    // 1. RESOLUCIÓN DINÁMICA DE INFRAESTRUCTURA (Inmune a cambios de base de datos)
    const liveProductId = await apiCartController.getLiveProductIdByName(targetProductName);

    // 2. PRECONDICIÓN ACELERADA: Generamos el carrito inicial con 3 unidades en el Backend
    const finalCartId = await apiCartController.addProductViaApi(liveProductId, expectedQuantityNumber);

    // 🎯 MUTACIÓN REAL EN EL BACKEND: Consumimos el método PUT para forzar el decremento real a 1 en el servidor
    await apiCartController.addProductViaApi(liveProductId, modifiedQuantityNumber, finalCartId);

    // 3. STATE HANDSHAKE LEGÍTIMO: Sincronizamos con los valores reales y mutados del servidor
    // Playwright inyecta preventivamente el estado en el Session Storage en el milisegundo cero
    await page.addInitScript(({ cartId, qty }) => {
      window.sessionStorage.setItem('cart_id', cartId);
      window.sessionStorage.setItem('cart_quantity', qty);
    }, { cartId: finalCartId, qty: modifiedQuantityString });

    // 4. E2E NAVEGACIÓN Y VALIDACIÓN VISUAL (Una sola carga limpia de red)
    await page.goto(ENV.baseUrl);

    // REGLA 6: Web-First Assertions estrictas sobre objetos Locator vivos
    await expect(loadedDashboardPage.titleLocator).toBeVisible();

    // 5. WEB-FIRST ASSERTION: Comprobamos que la UI refleja la mutación real del backend ('1')
    await expect(
      loadedDashboardPage.navbar.cartQuantityLocator,
      '[VALIDATION ERROR]: The UI Navbar failed to synchronize with the mutated backend API cart state.'
    ).toHaveText(modifiedQuantityString);
  });

  test.only('Should dynamically update UI item count when backend cart state is incremented via API session mutation', async ({ 
    apiCartController,  
    loadedDashboardPage,
    page 
  }) => {
    // Parámetros comerciales fuertemente tipados con sus tipos nativos exactos
    const targetProductName = TOOLSHOP_DATA.products.pliers;
    const initialQuantityNumber = 3;      // <-- PRECONDICIÓN: Iniciamos con 3 unidades reales en el backend
    const incrementalQuantityNumber = 2; // <-- MUTACIÓN: Sumamos 2 unidades reales por API
    const finalExpectedQuantityString = '5'; // <-- RESULTADO REAL: El backend sumará 3 + 2 = 5 en total

    // 1. RESOLUCIÓN DINÁMICA DE INFRAESTRUCTURA (Inmune a cambios de base de datos)
    const liveProductId = await apiCartController.getLiveProductIdByName(targetProductName);

    // 2. PRECONDICIÓN ACELERADA: Generamos el carrito inicial con 3 unidades en el Backend
    const finalCartId = await apiCartController.addProductViaApi(liveProductId, initialQuantityNumber);

    // 🎯 MUTACIÓN REAL EN EL BACKEND: Añadimos 2 unidades adicionales al carrito existente usando el POST listo en tu fixture
    await apiCartController.addProductViaApi(liveProductId, incrementalQuantityNumber, finalCartId);

    // 3. STATE HANDSHAKE LEGÍTIMO: Sincronizamos con el valor real y acumulado del servidor ('5')
    await page.addInitScript(({ cartId, qty }) => {
      window.sessionStorage.setItem('cart_id', cartId);
      window.sessionStorage.setItem('cart_quantity', qty);
    }, { cartId: finalCartId, qty: finalExpectedQuantityString });

    // 4. E2E NAVEGACIÓN Y VALIDACIÓN VISUAL (Una sola carga limpia de red)
    await page.goto(ENV.baseUrl);

    // REGLA 6: Web-First Assertions estrictas sobre objetos Locator vivos
    await expect(loadedDashboardPage.titleLocator).toBeVisible();

    // 5. WEB-FIRST ASSERTION: Comprobamos que la UI refleja la mutación real acumulada en el backend ('5')
     await expect(loadedDashboardPage.navbar.cartQuantityLocator).toHaveText(finalExpectedQuantityString);
  });
});
