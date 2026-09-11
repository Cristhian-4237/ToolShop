import { type Page } from '@playwright/test';
import { NavbarComponent } from './components/NavBarComponent';

export abstract class BasePage {
    protected readonly page: Page;
    // 🎯 Inyección automática: Todas las páginas ganan el menú superior sin programarlo en su constructor
    public readonly navbar: NavbarComponent;

    constructor(page: Page) {
        this.page = page;
        this.navbar = new NavbarComponent(page);
    }
    async reloadPage(): Promise<void> {
    await this.page.reload();
}
}
