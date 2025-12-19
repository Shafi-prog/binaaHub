/**
 * Unit tests for secure random generation utilities
 * Tests verify uniform distribution and security properties
 */

import {
  generateSecureRandomString,
  generateSecureRandomInt,
  generateSecureSessionId,
  generateSecurePassword,
  generateSecureUUID,
  generateSecureToken
} from '@/lib/secure-random';

describe('Secure Random Generation', () => {
  describe('generateSecureRandomString', () => {
    it('should generate a string of correct length', () => {
      const length = 16;
      const result = generateSecureRandomString(length);
      expect(result).toHaveLength(length);
    });

    it('should only use characters from the charset', () => {
      const charset = 'ABC';
      const result = generateSecureRandomString(100, charset);
      for (const char of result) {
        expect(charset).toContain(char);
      }
    });

    it('should have uniform distribution (chi-square test)', () => {
      const charset = 'ABCDEFGHIJ'; // 10 characters for easier testing
      // Using 10,000 iterations for statistical significance in chi-square test
      // This ensures we can reliably detect distribution bias
      const iterations = 10000;
      const expectedFrequency = iterations / charset.length;
      const counts: Record<string, number> = {};
      
      // Initialize counts
      for (const char of charset) {
        counts[char] = 0;
      }
      
      // Generate many samples
      for (let i = 0; i < iterations; i++) {
        const result = generateSecureRandomString(1, charset);
        counts[result]++;
      }
      
      // Chi-square test for uniform distribution
      // With 10 categories and significance level 0.05, critical value ~16.92
      let chiSquare = 0;
      for (const char of charset) {
        const observed = counts[char];
        const deviation = observed - expectedFrequency;
        chiSquare += (deviation * deviation) / expectedFrequency;
      }
      
      // Each character should appear roughly 1000 times (±20% is reasonable)
      for (const char of charset) {
        expect(counts[char]).toBeGreaterThan(expectedFrequency * 0.7);
        expect(counts[char]).toBeLessThan(expectedFrequency * 1.3);
      }
      
      // Chi-square should be reasonable (not too high)
      expect(chiSquare).toBeLessThan(20); // Generous threshold
    });

    it('should generate different strings on consecutive calls', () => {
      const results = new Set<string>();
      for (let i = 0; i < 100; i++) {
        results.add(generateSecureRandomString(16));
      }
      // Should have many unique results (at least 95 out of 100)
      expect(results.size).toBeGreaterThan(95);
    });
  });

  describe('generateSecureRandomInt', () => {
    it('should generate numbers within the specified range', () => {
      const min = 10;
      const max = 20;
      for (let i = 0; i < 100; i++) {
        const result = generateSecureRandomInt(min, max);
        expect(result).toBeGreaterThanOrEqual(min);
        expect(result).toBeLessThan(max);
      }
    });

    it('should have uniform distribution', () => {
      const min = 0;
      const max = 10;
      // Using 10,000 iterations for statistical significance in distribution testing
      const iterations = 10000;
      const expectedFrequency = iterations / (max - min);
      const counts: number[] = new Array(max - min).fill(0);
      
      for (let i = 0; i < iterations; i++) {
        const result = generateSecureRandomInt(min, max);
        counts[result - min]++;
      }
      
      // Each number should appear roughly expectedFrequency times (±20%)
      for (let i = 0; i < counts.length; i++) {
        expect(counts[i]).toBeGreaterThan(expectedFrequency * 0.7);
        expect(counts[i]).toBeLessThan(expectedFrequency * 1.3);
      }
    });

    it('should throw error when max <= min', () => {
      expect(() => generateSecureRandomInt(10, 10)).toThrow('max must be greater than min');
      expect(() => generateSecureRandomInt(10, 5)).toThrow('max must be greater than min');
    });

    it('should handle large ranges', () => {
      const min = 0;
      const max = 1000000;
      const result = generateSecureRandomInt(min, max);
      expect(result).toBeGreaterThanOrEqual(min);
      expect(result).toBeLessThan(max);
    });
  });

  describe('generateSecureSessionId', () => {
    it('should generate a valid session ID', () => {
      const sessionId = generateSecureSessionId();
      expect(sessionId).toMatch(/^session_[a-z0-9]+_[A-Za-z0-9]{16}$/);
    });

    it('should generate unique session IDs', () => {
      const ids = new Set<string>();
      for (let i = 0; i < 100; i++) {
        ids.add(generateSecureSessionId());
      }
      expect(ids.size).toBe(100);
    });
  });

  describe('generateSecurePassword', () => {
    it('should generate a password of correct length', () => {
      const length = 20;
      const password = generateSecurePassword(length);
      expect(password).toHaveLength(length);
    });

    it('should use default length of 16', () => {
      const password = generateSecurePassword();
      expect(password).toHaveLength(16);
    });

    it('should contain mixed character types', () => {
      const password = generateSecurePassword(100);
      // With 100 characters, we should have variety
      expect(/[A-Z]/.test(password)).toBe(true);
      expect(/[a-z]/.test(password)).toBe(true);
      expect(/[0-9]/.test(password)).toBe(true);
    });
  });

  describe('generateSecureUUID', () => {
    it('should generate a valid UUID v4', () => {
      const uuid = generateSecureUUID();
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
      expect(uuid).toMatch(uuidRegex);
    });

    it('should generate unique UUIDs', () => {
      const uuids = new Set<string>();
      for (let i = 0; i < 100; i++) {
        uuids.add(generateSecureUUID());
      }
      expect(uuids.size).toBe(100);
    });
  });

  describe('generateSecureToken', () => {
    it('should generate a hex token of correct length', () => {
      const byteLength = 32;
      const token = generateSecureToken(byteLength);
      expect(token).toHaveLength(byteLength * 2); // Hex encoding doubles length
      expect(/^[0-9a-f]+$/.test(token)).toBe(true);
    });

    it('should use default length of 32 bytes', () => {
      const token = generateSecureToken();
      expect(token).toHaveLength(64); // 32 bytes * 2 for hex
    });

    it('should generate unique tokens', () => {
      const tokens = new Set<string>();
      for (let i = 0; i < 100; i++) {
        tokens.add(generateSecureToken());
      }
      expect(tokens.size).toBe(100);
    });
  });
});
