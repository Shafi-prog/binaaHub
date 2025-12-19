/**
 * Unit tests for HTML sanitization utilities
 */

import {
  sanitizeHTML,
  sanitizeBasicHTML,
  sanitizeUserContent,
  stripHTML,
  containsDangerousHTML,
} from './html-sanitizer';

describe('HTML Sanitization', () => {
  describe('sanitizeHTML', () => {
    it('should remove script tags', () => {
      const malicious = '<script>alert("xss")</script><p>Safe content</p>';
      const result = sanitizeHTML(malicious);
      expect(result).not.toContain('<script>');
      expect(result).toContain('Safe content');
    });

    it('should remove onclick handlers', () => {
      const malicious = '<button onclick="alert(\'xss\')">Click me</button>';
      const result = sanitizeHTML(malicious);
      expect(result).not.toContain('onclick');
    });

    it('should remove javascript: URLs', () => {
      const malicious = '<a href="javascript:alert(\'xss\')">Click me</a>';
      const result = sanitizeHTML(malicious);
      expect(result).not.toContain('javascript:');
    });

    it('should preserve allowed tags', () => {
      const safe = '<p>This is <b>bold</b> and <i>italic</i> text</p>';
      const result = sanitizeHTML(safe);
      expect(result).toContain('<b>bold</b>');
      expect(result).toContain('<i>italic</i>');
    });

    it('should respect custom allowed tags', () => {
      const html = '<p>Paragraph</p><h1>Heading</h1>';
      const result = sanitizeHTML(html, ['h1']);
      expect(result).toContain('<h1>Heading</h1>');
      expect(result).not.toContain('<p>');
    });

    it('should remove data attributes by default', () => {
      const html = '<div data-user-id="123">Content</div>';
      const result = sanitizeHTML(html);
      expect(result).not.toContain('data-user-id');
    });
  });

  describe('sanitizeBasicHTML', () => {
    it('should allow basic formatting tags', () => {
      const html = '<p>Text with <b>bold</b> and <i>italic</i></p>';
      const result = sanitizeBasicHTML(html);
      expect(result).toContain('<b>bold</b>');
      expect(result).toContain('<i>italic</i>');
    });

    it('should allow safe links', () => {
      const html = '<a href="https://example.com">Link</a>';
      const result = sanitizeBasicHTML(html);
      expect(result).toContain('href="https://example.com"');
    });

    it('should remove disallowed tags', () => {
      const html = '<div><p>Text</p></div>';
      const result = sanitizeBasicHTML(html);
      expect(result).not.toContain('<div>');
    });
  });

  describe('sanitizeUserContent', () => {
    it('should allow lists', () => {
      const html = '<ul><li>Item 1</li><li>Item 2</li></ul>';
      const result = sanitizeUserContent(html);
      expect(result).toContain('<ul>');
      expect(result).toContain('<li>Item 1</li>');
    });

    it('should allow class attribute', () => {
      const html = '<p class="text-red-500">Colored text</p>';
      const result = sanitizeUserContent(html);
      expect(result).toContain('class=');
    });

    it('should remove dangerous content', () => {
      const malicious = '<p>Safe</p><script>alert("xss")</script>';
      const result = sanitizeUserContent(malicious);
      expect(result).not.toContain('<script>');
      expect(result).toContain('Safe');
    });
  });

  describe('stripHTML', () => {
    it('should remove all HTML tags', () => {
      const html = '<p>This is <b>bold</b> text</p>';
      const result = stripHTML(html);
      expect(result).toBe('This is bold text');
    });

    it('should handle nested tags', () => {
      const html = '<div><p><span>Nested</span> text</p></div>';
      const result = stripHTML(html);
      expect(result).toBe('Nested text');
    });

    it('should remove malicious content completely', () => {
      const malicious = '<script>alert("xss")</script>Safe text';
      const result = stripHTML(malicious);
      expect(result).not.toContain('<script>');
      expect(result).toContain('Safe text');
    });
  });

  describe('containsDangerousHTML', () => {
    it('should detect script tags', () => {
      const malicious = '<script>alert("xss")</script>';
      expect(containsDangerousHTML(malicious)).toBe(true);
    });

    it('should detect onclick handlers', () => {
      const malicious = '<button onclick="alert(\'xss\')">Click</button>';
      expect(containsDangerousHTML(malicious)).toBe(true);
    });

    it('should detect javascript: URLs', () => {
      const malicious = '<a href="javascript:alert(\'xss\')">Link</a>';
      expect(containsDangerousHTML(malicious)).toBe(true);
    });

    it('should return false for safe HTML', () => {
      const safe = '<p>This is <b>safe</b> content</p>';
      expect(containsDangerousHTML(safe)).toBe(false);
    });

    it('should return true for disallowed tags', () => {
      const html = '<iframe src="http://evil.com"></iframe>';
      expect(containsDangerousHTML(html)).toBe(true);
    });
  });

  describe('XSS Prevention', () => {
    it('should prevent XSS via img onerror', () => {
      const malicious = '<img src="x" onerror="alert(\'xss\')">';
      const result = sanitizeHTML(malicious);
      expect(result).not.toContain('onerror');
    });

    it('should prevent XSS via SVG', () => {
      const malicious = '<svg onload="alert(\'xss\')"></svg>';
      const result = sanitizeHTML(malicious);
      expect(result).not.toContain('onload');
    });

    it('should prevent XSS via style attribute', () => {
      const malicious = '<div style="background:url(javascript:alert(\'xss\'))">Text</div>';
      const result = sanitizeHTML(malicious);
      expect(result).not.toContain('javascript:');
    });

    it('should prevent DOM clobbering', () => {
      const malicious = '<form><input name="parentNode"></form>';
      const result = sanitizeHTML(malicious);
      // DOMPurify should handle this safely
      expect(result).not.toContain('parentNode');
    });
  });
});
