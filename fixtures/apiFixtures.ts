import { test as base } from '@playwright/test';
import { ENV } from '../data/environment';

export interface ICartItemPayload {
  readonly cart_id: string;
  readonly product_id: string;
  readonly quantity: number;
}

export interface ICartCreationResponse {
  readonly id: string;
}

export interface IProductBackendResponse {
  readonly id: string;
  readonly name: string;
}





export const apiFixtures = base.extend<{ 
  apiCartController: { 
    getLiveProductIdByName: (productName: string) => Promise<string>;
    addProductViaApi: (productId: string, quantity: number, cartId?: string) => Promise<string>; 
  } 
}>({
  apiCartController: async ({ request }, use) => {
    const controller = {
      


      getLiveProductIdByName: async (productName: string): Promise<string> => {
        const response = await request.get(`${ENV.apiUrl}/products`);
        if (!response.ok()) {
          throw new Error(`[API ERROR]: Failed to fetch products catalogue. Status: ${response.status()}`);
        }
        
        const responsePayload = await response.json();
        const productsList: IProductBackendResponse[] = Array.isArray(responsePayload) 
          ? responsePayload 
          : responsePayload.data;
        
        const targetProduct = productsList.find((product) => product.name === productName);
        if (!targetProduct) {
          throw new Error(`[TEST SETUP ERROR]: Product '${productName}' was not found in the live backend response.`);
        }
        
        return targetProduct.id;
      },

      



      addProductViaApi: async (productId: string, quantity: number, cartId?: string): Promise<string> => {
        let activeCartId = cartId;

        
        if (!activeCartId) {
          const cartResponse = await request.post(`${ENV.apiUrl}/carts`, {
            headers: { 'accept': 'application/json' }
          });

          if (!cartResponse.ok()) {
            throw new Error(`[API PRECONDITION ERROR]: Failed to initialize Cart Session. Status: ${cartResponse.status()}`);
          }

          const cartData = (await cartResponse.json()) as ICartCreationResponse;
          activeCartId = cartData.id;
        }

        
        const response = await request.post(`${ENV.apiUrl}/carts`, {
          headers: { 'accept': 'application/json' },
          data: {
            cart_id: activeCartId,
            product_id: productId,
            quantity: quantity
          } as ICartItemPayload
        });

        if (!response.ok()) {
          throw new Error(`[API CONTROLLER ERROR]: Failed to process cart operation in backend. Status: ${response.status()}`);
        }

        const updatedCartData = (await response.json()) as ICartCreationResponse;
        return updatedCartData.id;
      }
    }; 

    await use(controller); 
  }
});
