// Generic @models mock that returns no-op classes/functions for any named import.
// This avoids pulling heavy ESM deps (e.g., MikroORM/Medusa models) in unit tests.

const cache = new Map<string, any>()

function makeNoop(name: string) {
  // Create a lightweight constructor with a readable name for snapshots
  const fn = function ModelMock(this: any, init?: any) {
    Object.assign(this, init || {})
  }
  Object.defineProperty(fn, 'name', { value: name })
  return fn
}

const models = new Proxy({}, {
  get(_target, prop: string | symbol) {
    const key = String(prop)
    if (!cache.has(key)) {
      cache.set(key, makeNoop(key))
    }
    return cache.get(key)
  },
})

module.exports = models
