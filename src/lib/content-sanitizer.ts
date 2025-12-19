/**
 * Content sanitization utilities for XSS prevention
 * Uses DOMPurify for HTML sanitization with safe defaults
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param dirty - Potentially unsafe HTML string
 * @param config - Optional DOMPurify configuration
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(
  dirty: string,
  config?: any
): string {
  if (typeof dirty !== 'string') {
    return '';
  }
  
  const defaultConfig: any = {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'code', 'pre', 'span', 'div'
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id'],
    ALLOW_DATA_ATTR: false,
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  };
  
  return String(DOMPurify.sanitize(dirty, { ...defaultConfig, ...config }));
}

/**
 * Sanitize user input for display (strips all HTML)
 * @param input - User input string
 * @returns Plain text without HTML
 */
export function sanitizeUserInput(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  // Remove all HTML tags and decode HTML entities
  return String(DOMPurify.sanitize(input, { ALLOWED_TAGS: [] }));
}

/**
 * Sanitize markdown-like content with limited HTML
 * @param content - Content string
 * @returns Sanitized content
 */
export function sanitizeMarkdown(content: string): string {
  if (typeof content !== 'string') {
    return '';
  }
  
  const markdownConfig: any = {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'a', 'blockquote', 'code', 'pre'
    ],
    ALLOWED_ATTR: ['href'],
  };
  
  return String(DOMPurify.sanitize(content, markdownConfig));
}

/**
 * Sanitize URL to prevent javascript: and data: injection
 * @param url - URL string
 * @returns Safe URL or empty string if invalid
 */
export function sanitizeUrl(url: string): string {
  if (typeof url !== 'string') {
    return '';
  }
  
  const cleaned = url.trim().toLowerCase();
  
  // Block dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
  if (dangerousProtocols.some(protocol => cleaned.startsWith(protocol))) {
    return '';
  }
  
  // Only allow http, https, mailto, tel
  const allowedProtocols = ['http://', 'https://', 'mailto:', 'tel:'];
  const hasProtocol = allowedProtocols.some(protocol => cleaned.startsWith(protocol));
  
  if (!hasProtocol && cleaned.includes(':')) {
    // Has a protocol but it's not in the allowed list
    return '';
  }
  
  return url.trim();
}

/**
 * Escape HTML special characters
 * @param text - Text to escape
 * @returns Escaped text
 */
export function escapeHtml(text: string): string {
  if (typeof text !== 'string') {
    return '';
  }
  
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  
  return text.replace(/[&<>"'/]/g, (char) => htmlEscapes[char]);
}

/**
 * Unescape HTML entities
 * @param text - Text with HTML entities
 * @returns Unescaped text
 */
export function unescapeHtml(text: string): string {
  if (typeof text !== 'string') {
    return '';
  }
  
  const htmlUnescapes: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#x27;': "'",
    '&#x2F;': '/',
  };
  
  return text.replace(/&(?:amp|lt|gt|quot|#x27|#x2F);/g, (entity) => htmlUnescapes[entity]);
}

/**
 * Sanitize JSON string input to prevent injection
 * @param jsonString - JSON string
 * @returns Parsed and sanitized object or null if invalid
 */
export function sanitizeJsonInput(jsonString: string): any | null {
  if (typeof jsonString !== 'string') {
    return null;
  }
  
  try {
    // Parse JSON
    const parsed = JSON.parse(jsonString);
    
    // Sanitize object keys to prevent prototype pollution
    if (typeof parsed === 'object' && parsed !== null) {
      return sanitizeObjectKeys(parsed);
    }
    
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Recursively sanitize object keys to prevent prototype pollution
 * @param obj - Object to sanitize
 * @returns Sanitized object
 */
function sanitizeObjectKeys(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObjectKeys(item));
  }
  
  if (typeof obj === 'object' && obj !== null) {
    const dangerous = ['__proto__', 'constructor', 'prototype'];
    const result: any = {};
    
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key) && !dangerous.includes(key)) {
        result[key] = sanitizeObjectKeys(obj[key]);
      }
    }
    
    return result;
  }
  
  return obj;
}

/**
 * Sanitize file name to prevent path traversal
 * @param fileName - File name
 * @returns Safe file name
 */
export function sanitizeFileName(fileName: string): string {
  if (typeof fileName !== 'string') {
    return '';
  }
  
  // Remove path separators and dangerous characters
  return fileName
    .replace(/[\/\\]/g, '')
    .replace(/\.\./g, '')
    .replace(/[<>:"|?*\x00-\x1f]/g, '')
    .trim()
    .substring(0, 255); // Limit length
}

/**
 * Sanitize CSS class name
 * @param className - Class name
 * @returns Safe class name
 */
export function sanitizeClassName(className: string): string {
  if (typeof className !== 'string') {
    return '';
  }
  
  // Only allow alphanumeric, hyphen, underscore
  return className.replace(/[^a-zA-Z0-9_-]/g, '').substring(0, 100);
}

/**
 * Create safe attributes object for React components
 * @param attributes - Attributes object
 * @returns Sanitized attributes
 */
export function sanitizeAttributes(
  attributes: Record<string, any>
): Record<string, any> {
  const safe: Record<string, any> = {};
  const allowedAttrs = ['className', 'id', 'title', 'alt', 'aria-label', 'aria-hidden'];
  
  for (const key of allowedAttrs) {
    if (key in attributes) {
      if (key === 'className') {
        safe[key] = sanitizeClassName(attributes[key]);
      } else if (typeof attributes[key] === 'string') {
        safe[key] = escapeHtml(attributes[key]);
      }
    }
  }
  
  return safe;
}

export default {
  sanitizeHtml,
  sanitizeUserInput,
  sanitizeMarkdown,
  sanitizeUrl,
  escapeHtml,
  unescapeHtml,
  sanitizeJsonInput,
  sanitizeFileName,
  sanitizeClassName,
  sanitizeAttributes,
};
