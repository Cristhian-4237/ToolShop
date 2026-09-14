import { test, expect } from '../../fixtures/basePage';
import { ENV } from '../../data/environment';
import { TOOLSHOP_DATA } from '../../data/toolShopData';

test.describe('Toolshop E-commerce - Hybrid Validation Suite', () => {

  test('Should instantly reflect cart item count in UI when items are injected via Backend API', async ({ 
    apiCartController,  
    loadedDashboardPage,
    page 
  }) => {
    
    const targetProductName = TOOLSHOP_DATA.products.pliers;
    const expectedQuantityNumber = 3;
    const expectedQuantityString = '3';

    
    const liveProductId = await apiCartController.getLiveProductIdByName(targetProductName);

    
    const finalCartId = await apiCartController.addProductViaApi(liveProductId, expectedQuantityNumber);

    
    await page.addInitScript(({ cartId, qty }) => {
      window.sessionStorage.setItem('cart_id', cartId);
      window.sessionStorage.setItem('cart_quantity', qty);
    }, { cartId: finalCartId, qty: expectedQuantityString });

    
    await page.goto(ENV.baseUrl);
    
    
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
    
    const targetProductName = TOOLSHOP_DATA.products.pliers;
    const expectedQuantityNumber = 3;
    const modifiedQuantityNumber = 1;
    const modifiedQuantityString = '1';

    
    const liveProductId = await apiCartController.getLiveProductIdByName(targetProductName);

    
    const finalCartId = await apiCartController.addProductViaApi(liveProductId, expectedQuantityNumber);

    
    await apiCartController.addProductViaApi(liveProductId, modifiedQuantityNumber, finalCartId);

    
    
    await page.addInitScript(({ cartId, qty }) => {
      window.sessionStorage.setItem('cart_id', cartId);
      window.sessionStorage.setItem('cart_quantity', qty);
    }, { cartId: finalCartId, qty: modifiedQuantityString });

    
    await page.goto(ENV.baseUrl);

    
    await expect(loadedDashboardPage.titleLocator).toBeVisible();

    
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
    
    const targetProductName = TOOLSHOP_DATA.products.pliers;
    const initialQuantityNumber = 3;      
    const incrementalQuantityNumber = 2; 
    const finalExpectedQuantityString = '5'; 

    
    const liveProductId = await apiCartController.getLiveProductIdByName(targetProductName);

    
    const finalCartId = await apiCartController.addProductViaApi(liveProductId, initialQuantityNumber);

    
    await apiCartController.addProductViaApi(liveProductId, incrementalQuantityNumber, finalCartId);

    
    await page.addInitScript(({ cartId, qty }) => {
      window.sessionStorage.setItem('cart_id', cartId);
      window.sessionStorage.setItem('cart_quantity', qty);
    }, { cartId: finalCartId, qty: finalExpectedQuantityString });

    
    await page.goto(ENV.baseUrl);

    
    await expect(loadedDashboardPage.titleLocator).toBeVisible();

    
     await expect(loadedDashboardPage.navbar.cartQuantityLocator).toHaveText(finalExpectedQuantityString);
  });
});
