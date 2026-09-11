import { type Page, type Locator } from '@playwright/test';

export class NavbarComponent {
    private readonly page: Page;
    private readonly homeLink: Locator;
    private readonly cartLink: Locator;
    private readonly cartQuantity: Locator;

    constructor(page: Page) {
        this.page = page;
        this.homeLink = page.locator('[data-test="nav-home"]');
        this.cartLink = page.locator('[data-test="nav-cart"]');
        this.cartQuantity = page.locator('[data-test="cart-quantity"]');
    }

    get homeLinkLocator(): Locator {
        return this.homeLink;
    }

    get cartLinkLocator(): Locator {
        return this.cartLink;
    }

    get cartQuantityLocator(): Locator {
        return this.cartQuantity;
    }

    async clickHome(): Promise<void> {
        await this.homeLink.click();
    }

    async clickCart(): Promise<void> {
        await this.cartLink.click();
    }
}
