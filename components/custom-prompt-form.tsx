import { cn } from '@/lib/utils';
import { Button } from './button';
import { CrownIcon, Loader2, Wand2Icon } from 'lucide-react';

interface CustomPromptFormProps {
  onSubmit: (prompt: string) => Promise<void>;
}

export function CustomPromptForm({ onSubmit }: CustomPromptFormProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSubmit(prompt);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 pb-4">
      <div className="mb-3 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-2 font-bold text-black">
          <CrownIcon className="h-4 w-4 text-amber-500" />
          Premium Feature
        </div>

        <div className="rounded-2xl bg-green-200 px-3 py-1 text-sm font-semibold text-green-600">
          Activated
        </div>
      </div>

      <div className="mb-4 text-sm text-gray-500">
        <div className="font-medium">Examples:</div>

        <ul className="list-inside list-disc">
          <li>Respond in the style of Shakespeare</li>
          <li>Respond like a pirate would</li>
          <li>Use technical language appropriate for engineers</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="mb-2">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className={cn(
            'placeholder:text-gray-500 text-black',
            '!mb-2 w-full rounded-sm !border !border-gray-300 p-2 focus:outline-none',
            'ring-[#FE2C55] focus:!border-[#FE2C55] focus:!ring-2 focus:!ring-offset-2',
          )}
          placeholder="Enter your custom tone instructions..."
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          Generate Custom Reply{' '}
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Wand2Icon className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
}
