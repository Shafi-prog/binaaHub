/**
 * Security utilities for safe async operations and input validation
 * Addresses code scanning vulnerabilities related to setTimeout/setInterval
 */

/**
 * Type-safe delay function that prevents code injection
 * @param ms - Milliseconds to delay
 * @returns Promise that resolves after the delay
 */
export function safeDelay(ms: number): Promise<void> {
  // Validate input to prevent negative or excessive delays
  const validatedMs = Math.max(0, Math.min(ms, 300000)); // Max 5 minutes
  return new Promise<void>((resolve) => {
    setTimeout(resolve, validatedMs);
  });
}

/**
 * Type-safe debounce function that prevents code injection
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function safeDebounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  const validatedWait = Math.max(0, Math.min(wait, 10000)); // Max 10 seconds
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
      timeout = null;
    }, validatedWait);
  };
}

/**
 * Type-safe throttle function
 * @param func - Function to throttle
 * @param limit - Minimum time between calls in milliseconds
 * @returns Throttled function
 */
export function safeThrottle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  const validatedLimit = Math.max(0, Math.min(limit, 10000)); // Max 10 seconds
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, validatedLimit);
    }
  };
}

/**
 * Safe interval function with auto-cleanup
 * @param callback - Function to call on interval
 * @param ms - Interval in milliseconds
 * @returns Cleanup function
 */
export function safeInterval(
  callback: () => void,
  ms: number
): () => void {
  const validatedMs = Math.max(100, Math.min(ms, 300000)); // Min 100ms, Max 5 minutes
  const intervalId = setInterval(callback, validatedMs);
  
  return () => {
    clearInterval(intervalId);
  };
}

/**
 * Safe timeout with automatic cleanup
 * @param callback - Function to call after timeout
 * @param ms - Timeout in milliseconds
 * @returns Cleanup function
 */
export function safeTimeout(
  callback: () => void,
  ms: number
): () => void {
  const validatedMs = Math.max(0, Math.min(ms, 300000)); // Max 5 minutes
  const timeoutId = setTimeout(callback, validatedMs);
  
  return () => {
    clearTimeout(timeoutId);
  };
}

/**
 * Retry operation with exponential backoff
 * @param operation - Async operation to retry
 * @param maxRetries - Maximum number of retries
 * @param baseDelay - Base delay in milliseconds
 * @returns Result of the operation
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  const validatedRetries = Math.max(0, Math.min(maxRetries, 10)); // Max 10 retries
  
  for (let attempt = 0; attempt <= validatedRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt < validatedRetries) {
        const delay = Math.min(baseDelay * Math.pow(2, attempt), 30000); // Max 30 seconds
        await safeDelay(delay);
      }
    }
  }
  
  throw lastError!;
}

/**
 * Input sanitization for strings
 * @param input - String to sanitize
 * @returns Sanitized string
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  // Remove null bytes and control characters except newline and tab
  return input
    .replace(/\0/g, '')
    .replace(/[\x01-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '')
    .trim();
}

/**
 * Validate and sanitize email
 * @param email - Email to validate
 * @returns Sanitized email or null if invalid
 */
export function validateEmail(email: string): string | null {
  const sanitized = sanitizeString(email);
  
  // Simple but safe email validation (prevents ReDoS)
  if (sanitized.length === 0 || sanitized.length > 254) {
    return null;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(sanitized) ? sanitized : null;
}

/**
 * Validate and sanitize phone number (Saudi format)
 * @param phone - Phone number to validate
 * @returns Sanitized phone or null if invalid
 */
export function validateSaudiPhone(phone: string): string | null {
  const sanitized = sanitizeString(phone).replace(/[\s\-\(\)]/g, '');
  
  // Safe regex with clear limits (prevents ReDoS)
  const phoneRegex = /^(\+966|00966|966|0)?5[0-9]{8}$/;
  return phoneRegex.test(sanitized) ? sanitized : null;
}

/**
 * Validate numeric input
 * @param value - Value to validate
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Validated number or null if invalid
 */
export function validateNumber(
  value: any,
  min: number = -Infinity,
  max: number = Infinity
): number | null {
  const num = Number(value);
  
  if (isNaN(num) || !isFinite(num)) {
    return null;
  }
  
  if (num < min || num > max) {
    return null;
  }
  
  return num;
}

/**
 * Validate and sanitize URL
 * @param url - URL to validate
 * @param allowedProtocols - Allowed protocols (default: http, https)
 * @returns Sanitized URL or null if invalid
 */
export function validateUrl(
  url: string,
  allowedProtocols: string[] = ['http:', 'https:']
): string | null {
  const sanitized = sanitizeString(url);
  
  try {
    const parsed = new URL(sanitized);
    
    if (!allowedProtocols.includes(parsed.protocol)) {
      return null;
    }
    
    return parsed.toString();
  } catch {
    return null;
  }
}

/**
 * Sanitize object keys to prevent prototype pollution
 * @param obj - Object to sanitize
 * @returns Sanitized object
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): Partial<T> {
  const dangerous = ['__proto__', 'constructor', 'prototype'];
  const result: any = {};
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && !dangerous.includes(key)) {
      const value = obj[key];
      
      // Recursively sanitize nested objects
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        result[key] = sanitizeObject(value);
      } else {
        result[key] = value;
      }
    }
  }
  
  return result;
}

/**
 * Create a safe error message that doesn't leak sensitive information
 * @param error - Error object
 * @param userMessage - User-friendly message
 * @returns Safe error message
 */
export function createSafeErrorMessage(
  error: unknown,
  userMessage: string = 'An error occurred'
): string {
  // In production, never expose the actual error
  if (process.env.NODE_ENV === 'production') {
    return userMessage;
  }
  
  // In development, include error details
  if (error instanceof Error) {
    return `${userMessage}: ${error.message}`;
  }
  
  return userMessage;
}

/**
 * Freeze object to prevent modification (prototype pollution)
 * @param obj - Object to freeze
 * @returns Frozen object
 */
export function deepFreeze<T extends object>(obj: T): Readonly<T> {
  Object.freeze(obj);
  
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    const value = (obj as any)[prop];
    if (value && typeof value === 'object' && !Object.isFrozen(value)) {
      deepFreeze(value);
    }
  });
  
  return obj;
}

export default {
  safeDelay,
  safeDebounce,
  safeThrottle,
  safeInterval,
  safeTimeout,
  retryWithBackoff,
  sanitizeString,
  validateEmail,
  validateSaudiPhone,
  validateNumber,
  validateUrl,
  sanitizeObject,
  createSafeErrorMessage,
  deepFreeze,
};
