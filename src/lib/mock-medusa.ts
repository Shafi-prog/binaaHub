/**
 * Deprecated: legacy mock-medusa stub. Not used in production.
 * This file remains only to avoid broken imports in old branches.
 * Any attempt to instantiate will throw to prevent accidental use.
 */
const err = () => {
  throw new Error('Deprecated: mock-medusa is not allowed in production paths. Use Supabase services.');
};

export class OrderService {
  constructor() { err(); }
}

export class ProductService {
  constructor() { err(); }
}

export class InventoryService {
  constructor() { err(); }
}

export const __deprecated_mock_medusa = true;


