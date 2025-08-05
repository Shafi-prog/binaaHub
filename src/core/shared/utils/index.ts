// Frontend utilities only - client-safe exports
export * from "./cn";
export * from "./utils"
export * from "./client-events"

// Core utilities
export { default as ApiErrorHandler } from './apiErrorHandler';
export type { ApiError } from './apiErrorHandler';

export { default as config } from './config';
export { default as CacheManager, globalCache, useCache } from './cache';
export { default as PerformanceMonitor, usePerformanceTimer } from './performance';

// Validation utilities
export { FormValidator, ValidationRules } from './validation';
export type { ValidationRule, FieldValidation, FormErrors } from './validation';

// Hooks
export { useAsyncData } from '../hooks/useAsyncData';
export { useDebounce, useSearch } from '../hooks/useSearch';

// Note: events.ts contains server-side Medusa imports, use client-events.ts instead


