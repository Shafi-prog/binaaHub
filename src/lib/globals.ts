// Global variable declarations
declare global {
  var __BACKEND_URL__: string | undefined
  var __STOREFRONT_URL__: string | undefined
}

// Define the globals if they don't exist
if (typeof globalThis !== 'undefined') {
  globalThis.__BACKEND_URL__ = globalThis.__BACKEND_URL__ ?? process.env.NEXT_PUBLIC_BACKEND_URL ?? "/"
  globalThis.__STOREFRONT_URL__ = globalThis.__STOREFRONT_URL__ ?? process.env.NEXT_PUBLIC_STOREFRONT_URL ?? "http://localhost:8000"
}

export {}
