import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { FieldError } from 'react-hook-form';

interface FormFieldProps {
  name: string;
  label: string;
  description?: string;
  error?: FieldError;
  children: ReactNode;
  className?: string;
}

export function FormField({
  label,
  description,
  error,
  children,
  className,
}: FormFieldProps) {
  return (
    <fieldset className={cn('fieldset', className)}>
      <legend className="fieldset-legend">{label}</legend>
      {description && <p className="text-sm text-balance text-gray-500">{description}</p>}
      {children}
      {error && <p className="text-error mt-1 text-sm">{error.message}</p>}
    </fieldset>
  );
}
