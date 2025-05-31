// src/global.d.ts
// This file augments the Window interface to include the Google Maps API

export {};

declare global {
  interface Window {
    google: any;
  }
}
