import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDateSafe, formatNumberSafe, formatCurrencySafe, generateSafeId } from '../core/shared/utils/hydration-safe';
import { 
  safeDelay, 
  safeDebounce,
  validateEmail as secureValidateEmail,
  validateSaudiPhone as secureValidateSaudiPhone,
  sanitizeString 
} from './security-utils';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return formatDateSafe(date, { format: 'long' });
}

export function formatCurrency(amount: number, currency = 'SAR'): string {
  return formatCurrencySafe(amount);
}

export function formatNumber(number: number): string {
  return formatNumberSafe(number);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateId(): string {
  return generateSafeId('id');
}

export function isValidEmail(email: string): boolean {
  // Use secure email validation to prevent ReDoS
  return secureValidateEmail(email) !== null;
}

export function isValidSaudiPhone(phone: string): boolean {
  // Use secure phone validation with safe regex
  return secureValidateSaudiPhone(phone) !== null;
}

export function sleep(ms: number): Promise<void> {
  // Use safe delay function that validates input
  return safeDelay(ms);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  // Use secure debounce function with input validation
  return safeDebounce(func, wait);
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default {
  cn,
  formatDate,
  formatCurrency,
  formatNumber,
  truncateText,
  slugify,
  generateId,
  isValidEmail,
  isValidSaudiPhone,
  sleep,
  debounce,
  capitalizeFirst,
  getInitials,
};


