---
name: toolshop-hybrid-testing
description: 'Create or refactor ToolShop Playwright API, UI, and hybrid tests, Page Objects, fixtures, authentication setup, and session-storage flows while preserving the existing TypeScript architecture, security rules, locator design, and web-first assertions.'
argument-hint: 'Describe the Page Object, fixture, test, or hybrid flow to create or refactor.'
user-invocable: true
disable-model-invocation: false
---

# ToolShop Hybrid Testing

## Purpose

Use this skill when adding or refactoring ToolShop Page Objects, component objects, API controllers, fixtures, composed fixtures, authentication setup, or `*.spec.ts` files. Match the existing repository architecture before introducing new abstractions. Keep production code and test code in strict TypeScript and use technical corporate English in code, names, and test descriptions.

## Operating Procedure

1. Inspect the nearest existing implementation, fixture, Page Object, and test before editing.
2. Identify the owning layer: environment/configuration, API fixture, Page Object, component object, composed fixture, setup project, or spec.
3. Reuse the existing base classes, fixtures, data objects, and naming conventions. Do not create parallel abstractions for behavior that already exists.
4. Make the smallest symmetric change: every Page Object return type must match the value consumed by its test, and every fixture dependency must be explicit.
5. Keep specs flat and focused on business behavior. Move repeated preconditions into fixtures.
6. Validate the touched test slice with the narrowest relevant Playwright command, then run type or lint validation when available.

## Non-Negotiable Security Rules

- Never write credentials, access tokens, private keys, session secrets, or sensitive URLs in source code, public JSON, fixtures, specs, logs, reports, or comments.
- Read sensitive values through `process.env.*`. Prefer the repository's centralized environment module so validation is consistent and consumers do not duplicate configuration logic.
- Every required environment variable must fail fast with an explicit runtime error when missing. Use an error such as `CRITICAL CONFIGURATION ERROR: The required environment variable 'NAME' is missing.`
- Do not print passwords, tokens, authorization headers, or complete sensitive response bodies. Redact diagnostic output.
- Generated authentication state is infrastructure output, not source data. Keep it out of version control and verify the relevant path is ignored before relying on it.
- Do not add fallback credentials, hard-coded URLs, or silent defaults that make a test execute against an ambiguous environment.

## Fixture Architecture

Use a modular inheritance chain with Playwright `test.extend()`:

```text
base Playwright test
  -> pageFixtures.ts       Page Object instantiation only
  -> authFixtures.ts       authenticated state and direct internal navigation
  -> API fixtures           backend controllers and contracts
  -> composed fixtures      reusable multi-step preconditions
  -> spec files             business assertions and scenario data
```

- `pageFixtures.ts` must only instantiate isolated Page Objects and components. It must not contain login, API setup, cart setup, or scenario orchestration.
- `authFixtures.ts`, `basePage.ts`, or the next established extension layer may consume `pageFixtures` and provide authenticated fixtures such as `loggedInPage` or `loadedDashboardPage`.
- API fixtures must encapsulate requests, response checks, payload types, and backend setup. Specs should not contain raw setup requests when a controller fixture exists.
- Composed fixtures must consume other fixtures as dependencies and encapsulate repeated preconditions such as creating a cart, injecting products, loading session state, or navigating to checkout.
- Do not add manual `test.beforeEach` blocks for reusable preconditions. Add or extend a fixture instead.
- Use explicit interfaces or type aliases for fixture contracts. Use no `any`, unsafe casts, or untyped fixture objects.
- Preserve fixture dependency direction; lower-level fixtures must not import higher-level scenario fixtures.

## Authentication and State Injection

- Interactive authentication belongs in `tests/auth.setup.ts` or the existing global setup infrastructure and runs once through the Playwright setup project.
- Specs must consume authentication implicitly through `storageState` and advanced fixtures. Do not repeat login steps in test bodies.
- Authenticated fixtures should navigate directly to the required internal route, such as `/inventory.html`, through a Page Object or fixture method.
- For API-to-UI hybrid flows, prepare backend state first and inject required browser state before the first page load. Use `page.addInitScript` or the established equivalent so `sessionStorage` is available at document initialization.
- Prefer `dashboardPage.goto()` or the owning Page Object navigation method in specs. A direct `page.goto()` is acceptable only in infrastructure code or when no Page Object route exists.
- Keep the browser state contract explicit and typed. Do not place tokens or secrets in `sessionStorage` unless the application specifically requires it; never expose them in test output.

## Page Object Rules

- Keep every base selector as `private readonly` and initialize it in the Page Object or component constructor.
- Action methods remain asynchronous and retain correct `async`/`await` behavior for clicks, fills, navigation, waits, and other interactions.
- Locator accessors and locator-returning methods are synchronous. They must not be declared `async` and must not use `await`.
- Do not extract primitive DOM values in Page Objects with `.textContent()`, `.innerText()`, `.isVisible()`, or equivalent asynchronous reads for assertions.
- Return live Playwright `Locator` objects instead, with explicit signatures such as `getProductsTitleLocator(): Locator`.
- Use template literals for every runtime-built selector or text value, for example ``filter({ hasText: `${productName}` })``.
- For repeated elements such as products or cart rows, expose a method receiving the commercial product name and return a native filtered locator:

```ts
getCartItemLocator(productName: string): Locator {
    return this.cartItems.filter({ hasText: `${productName}` });
}
```

- Keep component-specific selectors and behavior in component objects such as `NavBarComponent`; compose them through the owning Page Object or fixture.
- Reuse existing navigation and action methods. Do not duplicate `addProductToCart`, checkout, or navbar logic in specs.

## Test Assertion Rules

- Use Playwright Web-First Assertions directly in `*.spec.ts` files:

```ts
await expect(pageObject.titleLocator).toBeVisible();
await expect(pageObject.itemCountLocator).toHaveText(`${expectedQuantity}`);
```

- Do not use static JavaScript assertions such as `expect(actual).toBe(expected)` for UI state. Assertions must target live Locators and retain Playwright auto-retries.
- When an item is removed or a cart badge disappears from the DOM, use `await expect(locator).toBeHidden()` rather than asserting the text `0`.
- Keep scenario-specific expected values in the spec or typed test data. Keep selectors and UI mechanics in Page Objects.
- Avoid `test.only`, arbitrary timeouts, sleeps, direct DOM extraction, and assertions hidden inside fixture setup unless the assertion verifies infrastructure preconditions.
- Tests must remain independent and parallel-safe. Do not share mutable cart IDs, storage, or browser state between tests.

## DRY and Change Review

Before finishing, verify:

- No behavior was duplicated when an existing Page Object, component, controller, or fixture could be reused.
- Repeated setup is a composed fixture, not a `beforeEach` block or copied sequence in multiple specs.
- API contracts, response validation, and environment access remain in their owning infrastructure layers.
- Page Object locator return types and spec assertions are symmetric.
- All dynamic selectors use template literals.
- All code is strict TypeScript with zero `any`.
- Existing architecture and public fixture names remain compatible unless the request explicitly requires a breaking change.
- No secret, token, credential, or sensitive URL was introduced into tracked files.

## Validation

Run the narrowest applicable command after editing:

```bash
npx playwright test path/to/touched.spec.ts
npx tsc --noEmit
```

If a test fails, inspect the failure and repair the same layer first. Do not broaden the refactor to unrelated files. Report unrelated pre-existing failures separately.
