import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { client } from '@/lib/popup-service';
import { FormField } from '@/components/form-field';
import { Loader2, ArrowLeft, InfoIcon } from 'lucide-react';
import { NavLink } from 'react-router';

// Define the action form schema
const actionSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  prompt: z.string().min(10, 'Prompt must be at least 10 characters'),
});

type ActionFormValues = z.infer<typeof actionSchema>;

export function CreateActionPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ActionFormValues>({
    resolver: zodResolver(actionSchema),
    defaultValues: async () => {
      const action = isEditMode
        ? await client.get(`/actions/${id}`).catch(() => null)
        : null;
        
      return {
        name: action?.name || '',
        description: action?.description || '',
        prompt: action?.prompt || '',
      };
    },
  });

  const onSubmit = async (data: ActionFormValues) => {
    try {
      setIsLoading(true);
      setError(null);

      if (isEditMode) {
        // Update existing action
        await client.put(`/actions/${id}`, data);
      } else {
        // Create new action
        await client.post('/actions', data);
      }

      // Redirect to actions page
      navigate('/');
    } catch (err: any) {
      console.error('Action save failed:', err);
      setError(err.message || 'Failed to save action. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full px-6 pb-6">
      <div className="mb-4 flex items-center gap-2">
        <NavLink to="/" className="btn btn-ghost btn-sm">
          <ArrowLeft className="h-4 w-4" />
        </NavLink>
        <h1 className="text-2xl font-bold">
          {isEditMode ? 'Edit' : 'Create'} Action
        </h1>
      </div>

      {error && (
        <div className="alert alert-error mb-4 w-full">
          <span>{error}</span>
        </div>
      )}

      <div className="alert alert-info mb-2 p-2">
        <InfoIcon className="h-4 w-4" />
        <p>
          You can leave the name and description empty to let the AI generate
          them.
        </p>
      </div>

      {isLoading && !isEditMode ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <FormField name="prompt" label="Prompt" error={errors.prompt}>
            <textarea
              className="textarea w-full"
              placeholder="Enter action prompt"
              rows={5}
              {...register('prompt')}
            />
          </FormField>

          <FormField name="name" label="Name (Optional)" error={errors.name}>
            <input
              type="text"
              className="input w-full"
              placeholder="Enter action name or leave empty for auto-generation"
              {...register('name')}
            />
          </FormField>

          <FormField
            name="description"
            label="Description (Optional)"
            error={errors.description}
          >
            <textarea
              className="textarea w-full"
              placeholder="Enter action description or leave empty for auto-generation"
              rows={3}
              {...register('description')}
            />
          </FormField>

          <button
            type="submit"
            className="btn btn-primary mt-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                {isEditMode ? 'Updating...' : 'Creating...'}
                <Loader2 className="h-4 w-4 animate-spin" />
              </>
            ) : isEditMode ? (
              'Update Action'
            ) : (
              'Create Action'
            )}
          </button>
        </form>
      )}
    </div>
  );
}
