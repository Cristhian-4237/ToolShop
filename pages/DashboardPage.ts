import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
    private readonly pageTitle: Locator;
    
    constructor(page: Page) {
        super(page);
        this.pageTitle = page.getByRole('img', { name: 'Banner' });
                
    }
    get titleLocator(): Locator {
        return this.pageTitle;
    }
    
    async goto(): Promise<void> {
        await this.page.goto('/');
    }
    getProductCardLocator(productName: string): Locator {
        return this.page.locator('.card').filter({ hasText: `${productName}` });
    }
    async addProductToCart(productName: string): Promise<void> {
        const productCard = this.getProductCardLocator(productName);
        await productCard.click();
        await this.page.waitForURL('**/product/**');
        await this.page.getByRole('button', { name: /Add to cart/i }).click();
    }
    async addMultipleProductsToCart(productName: string, quantity: number): Promise<void> {
        const productCard = this.getProductCardLocator(productName);
        await productCard.click();
        await this.page.waitForURL('**/product/**');
        await this.page.locator('[data-test="quantity"]').fill(quantity.toString());
        await this.page.getByRole('button', { name: /Add to cart/i }).click();
    }
}