/**
 * HTML Sanitization Utilities
 * 
 * This module provides utilities for safely sanitizing HTML content
 * to prevent XSS attacks when using dangerouslySetInnerHTML.
 */

// Using namespace import for isomorphic-dompurify to avoid TypeScript errors
// The library uses 'export =' syntax which requires this import pattern
import * as DOMPurify from 'isomorphic-dompurify';

/**
 * Default configuration for HTML sanitization
 */
const DEFAULT_CONFIG: DOMPurify.Config = {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li', 'a', 'span', 'div'],
  ALLOWED_ATTR: ['class', 'href', 'target', 'rel'],
  ALLOW_DATA_ATTR: false,
  ALLOW_UNKNOWN_PROTOCOLS: false,
  RETURN_TRUSTED_TYPE: false,
};

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param html - The HTML content to sanitize
 * @param allowedTags - Optional array of allowed HTML tags
 * @param allowedAttr - Optional array of allowed HTML attributes
 * @returns Sanitized HTML string safe for use with dangerouslySetInnerHTML
 */
export function sanitizeHTML(
  html: string,
  allowedTags?: string[],
  allowedAttr?: string[]
): string {
  const config: DOMPurify.Config = {
    ...DEFAULT_CONFIG,
    ...(allowedTags && { ALLOWED_TAGS: allowedTags }),
    ...(allowedAttr && { ALLOWED_ATTR: allowedAttr }),
  };

  return DOMPurify.sanitize(html, config);
}

/**
 * Sanitize HTML content for basic rich text (bold, italic, links)
 * @param html - The HTML content to sanitize
 * @returns Sanitized HTML string
 */
export function sanitizeBasicHTML(html: string): string {
  return sanitizeHTML(html, ['b', 'i', 'em', 'strong', 'a', 'br', 'p'], ['href', 'target', 'rel']);
}

/**
 * Sanitize HTML content for user-generated content with safe formatting
 * @param html - The HTML content to sanitize
 * @returns Sanitized HTML string
 */
export function sanitizeUserContent(html: string): string {
  return sanitizeHTML(
    html,
    ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li', 'a'],
    ['href', 'target', 'rel', 'class']
  );
}

/**
 * Strip all HTML tags from content, leaving only plain text
 * @param html - The HTML content to strip
 * @returns Plain text with all HTML removed
 */
export function stripHTML(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });
}

/**
 * Check if a string contains potentially dangerous HTML
 * @param html - The HTML content to check
 * @returns True if the HTML contains potentially dangerous content
 */
export function containsDangerousHTML(html: string): boolean {
  const sanitized = DOMPurify.sanitize(html, DEFAULT_CONFIG);
  return sanitized !== html;
}
