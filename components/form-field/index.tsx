import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { FieldError } from 'react-hook-form';

interface FormFieldProps {
  name: string;
  label: string;
  error?: FieldError;
  children: ReactNode;
  className?: string;
}

export function FormField({
  name,
  label,
  error,
  children,
  className,
}: FormFieldProps) {
  return (
    <fieldset className={cn('fieldset', className)}>
      <legend className="fieldset-legend">{label}</legend>
      {children}
      {error && <p className="text-error text-sm mt-1">{error.message}</p>}
    </fieldset>
  );
}
