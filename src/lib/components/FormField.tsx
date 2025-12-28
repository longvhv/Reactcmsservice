/**
 * FormField Component
 * Reusable form field with label, error, and helper text
 */

import React from 'react';

interface FormFieldProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}

export function FormField({
  label,
  error,
  helperText,
  required,
  children,
  htmlFor,
  className = '',
}: FormFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-sm font-medium text-foreground"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {children}
      
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function TextInput({ error, className = '', ...props }: TextInputProps) {
  return (
    <input
      className={`
        w-full px-4 py-2 rounded-xl
        bg-secondary border border-border
        text-foreground placeholder:text-muted-foreground
        focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors
        ${error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''}
        ${className}
      `}
      {...props}
    />
  );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function TextArea({ error, className = '', ...props }: TextAreaProps) {
  return (
    <textarea
      className={`
        w-full px-4 py-2 rounded-xl
        bg-secondary border border-border
        text-foreground placeholder:text-muted-foreground
        focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors resize-y
        ${error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''}
        ${className}
      `}
      {...props}
    />
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export function Select({ error, className = '', children, ...props }: SelectProps) {
  return (
    <select
      className={`
        w-full px-4 py-2 rounded-xl
        bg-secondary border border-border
        text-foreground
        focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors
        ${error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </select>
  );
}
