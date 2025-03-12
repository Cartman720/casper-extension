import { useState, useEffect } from 'react';
import { client } from '@/lib/service';
import { NavLink } from 'react-router';
import { Edit, Trash2, Plus, Sparkles } from 'lucide-react';

interface Action {
  id: string;
  name: string;
  description: string;
  prompt: string;
  createdAt: string;
  updatedAt: string;
}

export function ActionsPage() {
  const [actions, setActions] = useState<Action[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setIsLoading(true);
    client
      .get('/actions')
      .then((data) => {
        setActions(data);
        setError(null);
      })
      .catch((err) => {
        console.error('Failed to fetch actions:', err);
        setError('Failed to load actions. Please try again.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleDeleteAction = async (id: string) => {
    if (confirm('Are you sure you want to delete this action?')) {
      try {
        await client.delete(`/actions/${id}`);
        setActions(actions.filter((action) => action.id !== id));
      } catch (err) {
        console.error('Failed to delete action:', err);
        alert('Failed to delete action. Please try again.');
      }
    }
  };

  const filteredActions = searchQuery
    ? actions.filter(
        (action) =>
          action.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (action.description &&
            action.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase())),
      )
    : actions;

  return (
    <div className="h-full px-6 pb-6">
      <div className="mb-4 flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Actions</h1>
        <div className="text-sm text-gray-500">
          Actions are predefined prompts in the app that let users quickly start
          tasks. They streamline interactions for greater convenience and
          efficiency.
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <input
            type="text"
            className="input input-sm w-full"
            placeholder="Search actions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <NavLink to="/actions/create" className="btn btn-sm btn-primary">
            <Plus className="mr-1 h-4 w-4" />
            Create
          </NavLink>
        </div>

        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <div className="loading loading-spinner"></div>
          </div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : filteredActions.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            {searchQuery
              ? 'No actions found matching your search.'
              : 'No actions found. Create your first action!'}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filteredActions.map((action) => (
              <ActionCard
                key={action.id}
                action={action}
                onDelete={handleDeleteAction}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface ActionCardProps {
  action: Action;
  onDelete: (id: string) => void;
}

function ActionCard({ action, onDelete }: ActionCardProps) {
  return (
    <div key={action.id} className="card bg-base-200">
      <div className="card-body p-2">
        <div className="flex flex-col items-start justify-between">
          <div className="mb-1 flex w-full justify-between">
            <h3 className="flex items-center gap-1 font-bold">
              {action.name}
              <Sparkles className="text-primary h-3 w-3" />
            </h3>

            <div className="ml-auto flex gap-1">
              <NavLink
                to={`/actions/${action.id}`}
                className="btn btn-circle btn-sm btn-ghost"
              >
                <Edit className="h-4 w-4" />
              </NavLink>
              <button
                className="btn btn-circle btn-sm btn-ghost text-error"
                onClick={() => onDelete(action.id)}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div>
            {action.description && (
              <p className="flex items-center gap-1 text-sm text-gray-500">
                {action.description}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-700">
              Created: {new Date(action.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
