import { mergeTests } from '@playwright/test';
import { shoppingFixtures } from './shoppingFixtures';
import { apiFixtures } from './apiFixtures';
// Si tuvieras authFixtures, apiFixtures, etc., las importarías aquí

// Unimos todas las ramas de fixtures en un solo punto de entrada limpio
export const test = mergeTests(shoppingFixtures, apiFixtures);
export { expect } from '@playwright/test';
    