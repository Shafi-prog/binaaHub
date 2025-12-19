/**
 * Secure Random Generation Utilities
 * 
 * This module provides cryptographically secure random generation functions
 * to replace insecure Math.random() usage in security-sensitive contexts.
 */

import { randomBytes } from 'crypto';

/**
 * Generate a cryptographically secure random string
 * Uses rejection sampling to ensure uniform distribution across the charset
 * @param length - Length of the string to generate
 * @param charset - Character set to use (default: alphanumeric)
 * @returns Secure random string with uniform distribution
 */
export function generateSecureRandomString(
  length: number, 
  charset: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
): string {
  const result: string[] = [];
  const charsetLength = charset.length;
  const maxValid = 256 - (256 % charsetLength); // Ensure uniform distribution
  
  // Allocate extra bytes for rejection sampling
  let randomIndex = 0;
  let randomBytesBuffer = randomBytes(length * 2);
  
  for (let i = 0; i < length; i++) {
    let byte: number;
    do {
      if (randomIndex >= randomBytesBuffer.length) {
        // Need more random bytes
        randomBytesBuffer = randomBytes(length * 2);
        randomIndex = 0;
      }
      byte = randomBytesBuffer[randomIndex++];
    } while (byte >= maxValid); // Reject biased values
    
    result.push(charset[byte % charsetLength]);
  }
  
  return result.join('');
}

/**
 * Generate a secure session ID
 * @returns Secure session ID
 */
export function generateSecureSessionId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = generateSecureRandomString(16);
  return `session_${timestamp}_${randomPart}`;
}

/**
 * Generate a secure temporary password
 * @param length - Length of the password (default: 16)
 * @returns Secure temporary password
 */
export function generateSecurePassword(length: number = 16): string {
  // Include uppercase, lowercase, numbers, and special characters
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  return generateSecureRandomString(length, charset);
}

/**
 * Generate a secure UUID v4
 * @returns Secure UUID v4 string
 */
export function generateSecureUUID(): string {
  const bytes = randomBytes(16);
  
  // Set version (4) and variant bits
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  
  const hex = bytes.toString('hex');
  return [
    hex.substring(0, 8),
    hex.substring(8, 12),
    hex.substring(12, 16),
    hex.substring(16, 20),
    hex.substring(20, 32)
  ].join('-');
}

/**
 * Generate a secure token
 * @param length - Length in bytes (default: 32)
 * @returns Secure token as hex string
 */
export function generateSecureToken(length: number = 32): string {
  return randomBytes(length).toString('hex');
}

/**
 * Generate a secure random integer within a range using rejection sampling
 * This implementation avoids modulo bias by rejecting values that would
 * create non-uniform distribution. The rejection sampling loop ensures
 * that only values within the acceptable range are used.
 * 
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (exclusive)
 * @returns Secure random integer with uniform distribution
 */
export function generateSecureRandomInt(min: number, max: number): number {
  const range = max - min;
  if (range <= 0) {
    throw new Error('max must be greater than min');
  }
  
  // Calculate the number of bytes needed
  const bytesNeeded = Math.ceil(Math.log2(range) / 8);
  const maxValue = Math.pow(256, bytesNeeded);
  const maxAcceptable = Math.floor(maxValue / range) * range;
  
  // Rejection sampling: Keep generating until we get a value in acceptable range
  let randomValue: number;
  do {
    const bytes = randomBytes(bytesNeeded);
    randomValue = 0;
    for (let i = 0; i < bytesNeeded; i++) {
      randomValue = (randomValue << 8) + bytes[i];
    }
  } while (randomValue >= maxAcceptable); // This ensures uniform distribution
  
  // Now we can safely use modulo since randomValue < maxAcceptable
  return min + (randomValue % range);
}
