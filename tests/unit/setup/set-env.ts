// Safe env setup for tests: avoid assigning to readonly properties on process.env
// Use Object.defineProperty to override during tests
export function setEnv(key: string, value: string) {
  Object.defineProperty(process.env, key, {
    configurable: true,
    enumerable: true,
    value,
    writable: true,
  })
}
