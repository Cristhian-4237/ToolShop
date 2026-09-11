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

/**
 * Fixture de Infraestructura de API.
 * Encapsula las operaciones del backend aislando los contratos HTTP del Spec.
 */
export const apiFixtures = base.extend<{ 
  apiCartController: { 
    getLiveProductIdByName: (productName: string) => Promise<string>;
    addProductViaApi: (productId: string, quantity: number, cartId?: string) => Promise<string>; // 🎯 'cartId' opcional para reutilizar el método
  } 
}>({
  apiCartController: async ({ request }, use) => {
    const controller = {
      /**
       * Interroga al catálogo vivo del backend para obtener el ULID real de forma dinámica.
       */
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

      /**
       * Método Unificado Senior para la gestión de Carritos en Backend.
       * Si se omite 'cartId' crea un carrito nuevo. Si se envía, le añade más unidades.
       */
      addProductViaApi: async (productId: string, quantity: number, cartId?: string): Promise<string> => {
        let activeCartId = cartId;

        // Si no nos pasaron un carrito previo, creamos uno limpio desde cero
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

        // Ejecutamos el POST unificado a la raíz que sí reconoce el servidor de Toolshop
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
