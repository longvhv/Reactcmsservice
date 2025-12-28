/**
 * Validation Utilities
 * Common validation functions
 */

export const validators = {
  required: (value: any, fieldName: string = 'Field'): string | null => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return `${fieldName} is required`;
    }
    return null;
  },

  email: (value: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Invalid email address';
    }
    return null;
  },

  url: (value: string): string | null => {
    try {
      new URL(value);
      return null;
    } catch {
      return 'Invalid URL';
    }
  },

  minLength: (value: string, min: number): string | null => {
    if (value.length < min) {
      return `Must be at least ${min} characters`;
    }
    return null;
  },

  maxLength: (value: string, max: number): string | null => {
    if (value.length > max) {
      return `Must be at most ${max} characters`;
    }
    return null;
  },

  slug: (value: string): string | null => {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(value)) {
      return 'Invalid slug format (lowercase, numbers, hyphens only)';
    }
    return null;
  },

  integer: (value: any): string | null => {
    if (!Number.isInteger(Number(value))) {
      return 'Must be an integer';
    }
    return null;
  },

  positive: (value: number): string | null => {
    if (value <= 0) {
      return 'Must be positive';
    }
    return null;
  },

  dateAfter: (date: string, afterDate: string): string | null => {
    if (new Date(date) <= new Date(afterDate)) {
      return `Must be after ${afterDate}`;
    }
    return null;
  },

  dateBefore: (date: string, beforeDate: string): string | null => {
    if (new Date(date) >= new Date(beforeDate)) {
      return `Must be before ${beforeDate}`;
    }
    return null;
  },
};

export function validate<T extends Record<string, any>>(
  data: T,
  rules: Record<keyof T, ((value: any) => string | null)[]>
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const field in rules) {
    const fieldRules = rules[field];
    const value = data[field];

    for (const rule of fieldRules) {
      const error = rule(value);
      if (error) {
        errors[field] = error;
        break; // Only show first error for each field
      }
    }
  }

  return errors;
}
