// @ts-nocheck
import Medusa from "@medusajs/js-sdk"


const getBackendUrl = () => {
  // Check if __BACKEND_URL__ is defined (webpack define plugin)
  if (typeof __BACKEND_URL__ !== 'undefined') {
    return __BACKEND_URL__;
  }
  
  // Fallback to environment variables
  if (typeof window !== 'undefined') {
    // Client side - use environment variables or default
    return process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 
           process.env.NEXT_PUBLIC_BACKEND_URL || 
           'http://localhost:9000';
  } else {
    // Server side - use environment variables or default
    return process.env.MEDUSA_BACKEND_URL || 
           process.env.BACKEND_URL || 
           'http://localhost:9000';
  }
};

export const backendUrl = getBackendUrl();

export const sdk = new Medusa({
  baseUrl: backendUrl,
  auth: {
    type: "session",
  },
})

// useful when you want to call the BE from the console and try things out quickly
if (typeof window !== "undefined") {
  ;(window as any).__sdk = sdk
}


