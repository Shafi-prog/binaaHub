// Extend Jest timeout for E2E tests
// Many E2E flows involve network + rendering, so 60s is safer default
jest.setTimeout(60_000);

// Optional: small helper to retry flaky expectations can be added here later
