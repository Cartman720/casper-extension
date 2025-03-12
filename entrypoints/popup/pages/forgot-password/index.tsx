import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { client } from '@/lib/popup-service';
import { FormField } from '@/components/form-field';
import { Loader2 } from 'lucide-react';
import logo from '@/assets/casper-logo.png';

// Define the forgot password form schema
const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      // Call the forgot password API endpoint
      await client.post('/auth/password/reset/request', data);

      // Show success message
      setSuccess(
        'Password reset instructions have been sent to your email. Please check your inbox.',
      );
    } catch (err: any) {
      console.error('Password reset request failed:', err);
      setError(
        err.message || 'Failed to request password reset. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto flex h-full max-w-xs flex-col items-center justify-center">
      <div className="mb-3 text-center">
        <div className="font-rift text-2xl font-bold flex items-center gap-2">
          <div className="mb-3">
            <img src={logo} alt="Casper Chat" className="h-10 w-10" />
          </div>
          Casper Chat
        </div>
        <div className="text-sm text-gray-500">Reset your password</div>
      </div>

      {error && (
        <div className="alert alert-error mb-4 w-full">
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert alert-success mb-4 w-full">
          <span>{success}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mb-2 flex w-full max-w-xs flex-col"
      >
        <FormField
          name="email"
          label="Email"
          error={errors.email}
          className="mb-3"
        >
          <input
            type="email"
            className="input w-full"
            placeholder="Enter your email"
            {...register('email')}
          />
        </FormField>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Reset Password'}
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        </button>
      </form>

      <div className="text-sm text-gray-500">
        Remember your password?{' '}
        <NavLink to="/login" className="text-primary">
          Log in
        </NavLink>
      </div>
    </div>
  );
}
