import { mergeTests } from '@playwright/test';
import { shoppingFixtures } from './shoppingFixtures';
import { apiFixtures } from './apiFixtures';



export const test = mergeTests(shoppingFixtures, apiFixtures);
export { expect } from '@playwright/test';
    