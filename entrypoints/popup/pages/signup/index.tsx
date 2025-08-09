import { storage } from '#imports';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { client } from '@/lib/popup-service';
import { FormField } from '@/components/form-field';
import { XCircleIcon } from 'lucide-react';
import logo from '@/assets/casper-logo.png';
// Define the signup form schema
const signupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      setIsLoading(true);
      setError(null);

      // Call the signup API endpoint
      const response = await client.post('/auth/signup', {
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      // Handle successful signup
      console.log('Signup successful:', response);

      await storage.setItem('session:auth_token', response.token);

      navigate('/');
    } catch (err: any) {
      console.error('Signup failed:', err);
      setError(err.message || 'Failed to create account. Please try again.');
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
        <div className="text-sm text-gray-500">Create your account</div>
      </div>

      {error && (
        <div className="alert alert-error mb-1 w-full p-1 text-white">
          <XCircleIcon className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mb-2 flex w-full max-w-xs flex-col"
      >
        <FormField name="name" label="Full Name" error={errors.name}>
          <input
            type="text"
            className="input w-full"
            placeholder="Enter your name"
            {...register('name')}
          />
        </FormField>

        <FormField name="email" label="Email" error={errors.email}>
          <input
            type="email"
            className="input w-full"
            placeholder="Enter your email"
            {...register('email')}
          />
        </FormField>

        <FormField name="password" label="Password" error={errors.password}>
          <input
            type="password"
            className="input w-full"
            placeholder="Create a password"
            {...register('password')}
          />
        </FormField>

        <FormField
          name="confirmPassword"
          label="Confirm Password"
          error={errors.confirmPassword}
          className="mb-3"
        >
          <input
            type="password"
            className="input w-full"
            placeholder="Confirm your password"
            {...register('confirmPassword')}
          />
        </FormField>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <div className="text-sm text-gray-500">
        Already have an account?{' '}
        <NavLink to="/login" className="text-primary">
          Log in
        </NavLink>
      </div>
    </div>
  );
}
