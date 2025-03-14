import { storage } from 'wxt/storage';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { client } from '@/lib/popup-service';
import { FormField } from '@/components/form-field';
import { Loader2 } from 'lucide-react';
import logo from '@/assets/casper-logo.png';

// Define the login form schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Please enter your password'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      setError(null);

      // Call the login API endpoint
      const response = await client.post('/auth/login', data);

      // Store the auth token
      await storage.setItem('session:auth_token', response.token);

      // Redirect to the home page
      navigate('/');
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto flex h-full max-w-xs flex-col items-center justify-center">
      <div className="mb-3 text-center">
        <div className="mb-3">
          <img src={logo} alt="Casper Chat" className="h-24 w-24" />
        </div>
        <div className="font-rift text-2xl font-bold">Casper Chat</div>
        <div className="text-sm text-gray-500">Sign in to continue</div>
      </div>

      {error && (
        <div className="alert alert-error mb-4 w-full">
          <span>{error}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mb-2 flex w-full max-w-xs flex-col"
      >
        <FormField name="email" label="Email" error={errors.email}>
          <input
            type="email"
            className="input w-full"
            placeholder="Enter your email"
            {...register('email')}
          />
        </FormField>

        <div className="mb-3">
          <FormField name="password" label="Password" error={errors.password}>
            <input
              type="password"
              className="input w-full"
              placeholder="Enter your password"
              {...register('password')}
            />
          </FormField>
          <div className="text-sm text-gray-500">
            <NavLink to="/forgot-password" className="text-primary">
              Forgot password?
            </NavLink>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Log in'}

          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        </button>
      </form>

      <div className="text-sm text-gray-500">
        Don't have an account?{' '}
        <NavLink to="/signup" className="text-primary">
          Sign up
        </NavLink>
      </div>
    </div>
  );
}
