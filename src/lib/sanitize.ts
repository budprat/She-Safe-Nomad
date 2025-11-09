/**
 * Input Sanitization Utilities
 * Provides functions to sanitize user input and prevent XSS attacks
 */

/**
 * Sanitizes HTML content to prevent XSS attacks
 * Uses a simple approach without external dependencies
 * For production, consider using DOMPurify library
 */
export function sanitizeHTML(dirty: string): string {
  const div = document.createElement('div');
  div.textContent = dirty;
  return div.innerHTML;
}

/**
 * Sanitizes text input by removing potentially harmful characters
 * Allows basic alphanumeric, punctuation, and common symbols
 */
export function sanitizeText(text: string): string {
  if (!text) return '';

  // Remove null bytes and other control characters
  let sanitized = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // Normalize whitespace
  sanitized = sanitized.replace(/\s+/g, ' ').trim();

  return sanitized;
}

/**
 * Sanitizes user input for safe database storage
 * Prevents SQL injection by removing dangerous characters
 */
export function sanitizeForDatabase(input: string): string {
  if (!input) return '';

  // First sanitize as text
  let sanitized = sanitizeText(input);

  // Remove potential SQL injection patterns
  sanitized = sanitized.replace(/['";]/g, '');

  return sanitized;
}

/**
 * Sanitizes URLs to prevent XSS through javascript: or data: URIs
 */
export function sanitizeURL(url: string): string {
  if (!url) return '';

  const trimmed = url.trim().toLowerCase();

  // Block dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];

  for (const protocol of dangerousProtocols) {
    if (trimmed.startsWith(protocol)) {
      return '';
    }
  }

  // Only allow http, https, and mailto
  if (!trimmed.match(/^(https?:\/\/|mailto:)/i) && !trimmed.startsWith('/')) {
    return '';
  }

  return url.trim();
}

/**
 * Sanitizes email addresses
 */
export function sanitizeEmail(email: string): string {
  if (!email) return '';

  // Basic email sanitization
  const sanitized = email.trim().toLowerCase();

  // Check basic email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(sanitized)) {
    return '';
  }

  return sanitized;
}

/**
 * Sanitizes phone numbers (removes non-numeric characters except + and -)
 */
export function sanitizePhone(phone: string): string {
  if (!phone) return '';

  // Remove everything except numbers, +, -, (, ), and spaces
  return phone.replace(/[^0-9+\-() ]/g, '').trim();
}

/**
 * Truncates text to a maximum length
 */
export function truncate(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;

  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Sanitizes rich text content while preserving some formatting
 * Allows only safe HTML tags
 */
export function sanitizeRichText(html: string): string {
  if (!html) return '';

  // Create a temporary element
  const temp = document.createElement('div');
  temp.innerHTML = html;

  // List of allowed tags
  const allowedTags = ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'a'];

  // Remove all tags except allowed ones
  const walk = (node: Node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;

      // Remove if not in allowed list
      if (!allowedTags.includes(element.tagName.toLowerCase())) {
        // Replace with text content
        const textNode = document.createTextNode(element.textContent || '');
        element.parentNode?.replaceChild(textNode, element);
        return;
      }

      // For <a> tags, sanitize href
      if (element.tagName.toLowerCase() === 'a') {
        const href = element.getAttribute('href');
        if (href) {
          const sanitizedHref = sanitizeURL(href);
          if (sanitizedHref) {
            element.setAttribute('href', sanitizedHref);
            element.setAttribute('rel', 'noopener noreferrer');
            element.setAttribute('target', '_blank');
          } else {
            // Remove the link if URL is invalid
            const textNode = document.createTextNode(element.textContent || '');
            element.parentNode?.replaceChild(textNode, element);
            return;
          }
        }
      }

      // Remove all attributes except href for links
      const attrs = Array.from(element.attributes);
      attrs.forEach(attr => {
        if (!(element.tagName.toLowerCase() === 'a' &&
              ['href', 'rel', 'target'].includes(attr.name))) {
          element.removeAttribute(attr.name);
        }
      });
    }

    // Walk children
    const children = Array.from(node.childNodes);
    children.forEach(child => walk(child));
  };

  walk(temp);

  return temp.innerHTML;
}

/**
 * Validates and sanitizes form data object
 */
export function sanitizeFormData<T extends Record<string, any>>(data: T): T {
  const sanitized: any = {};

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeText(value);
    } else if (typeof value === 'number') {
      sanitized[key] = value;
    } else if (typeof value === 'boolean') {
      sanitized[key] = value;
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item =>
        typeof item === 'string' ? sanitizeText(item) : item
      );
    } else if (value === null || value === undefined) {
      sanitized[key] = value;
    } else {
      // For objects, recursively sanitize
      sanitized[key] = sanitizeFormData(value);
    }
  }

  return sanitized as T;
}
