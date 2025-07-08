// @ts-nocheck
// Jest and Testing Library Type Declarations
import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveClass(className: string): R;
      toHaveStyle(style: { [key: string]: any }): R;
      toBeVisible(): R;
      toBeDisabled(): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveTextContent(text: string): R;
    }
  }
}

// Mock function types
declare const jest: {
  fn(): jest.MockedFunction<any>;
  spyOn(object: any, method: string): jest.SpyInstance;
  mock(moduleName: string): any;
  clearAllMocks(): void;
  resetAllMocks(): void;
};


