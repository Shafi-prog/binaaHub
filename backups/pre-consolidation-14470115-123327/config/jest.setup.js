// jest.setup.js
require('@testing-library/jest-dom');

global.ResizeObserver = class ResizeObserver {
  constructor(cb) {
    this.cb = cb;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};