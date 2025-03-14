import { Controls } from './controls';
import { useAuth } from '@/lib/hooks/useAuth';
import { Loader2, SparkleIcon } from 'lucide-react';

interface ControlsAppProps {
  targetElement: HTMLElement;
}

export function ControlsApp({ targetElement }: ControlsAppProps) {
  const { isAuthenticated, isLoading, refreshAuthState } = useAuth();

  if (!isAuthenticated || isLoading) {
    return (
      <div className="relative mt-2">
        <Button onClick={refreshAuthState}>
          Login to Casper to Continue
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <SparkleIcon className="h-4 w-4" />
          )}
        </Button>
      </div>
    );
  }

  return <Controls targetElement={targetElement} />;
}
