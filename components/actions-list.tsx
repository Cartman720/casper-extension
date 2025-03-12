import { Action } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useClose } from "@headlessui/react";
import { contentClient } from "@/lib/content-service";

interface ActionsListProps {
  onActionSelect: (actionId: string) => void;
}

export function ActionsList({ onActionSelect }: ActionsListProps) {
  const [actions, setActions] = useState<Action[]>([]);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingActions, setIsLoadingActions] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // close the popover when the action is selected
  const closePopover = useClose();

  // Fetch actions when component mounts
  useEffect(() => {
    setIsLoadingActions(true);
    contentClient
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
        setIsLoadingActions(false);
      });
  }, []);

  const handleActionSelect = async (action: Action) => {
    setIsLoading(true);
    setSelectedAction(action.name);

    try {
      await onActionSelect(action.prompt);
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
    setSelectedAction(null);

    // close the popover
    closePopover();
  };

  if (isLoadingActions) {
    return (
      <div className="flex justify-center items-center py-4">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-3 text-sm text-red-500">
        {error}
      </div>
    );
  }

  if (actions.length === 0) {
    return (
      <div className="px-4 py-3 text-sm text-gray-500">
        No actions available.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 pb-2">
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={() => handleActionSelect(action)}
          data-selected={selectedAction === action.id}
          className={cn(
            "px-4 py-1.5 text-left group bg-white w-full flex items-center gap-1",
            "hover:!bg-[#FE2C55] transition-all duration-200",
            "data-[selected=true]:!bg-[#FE2C55] data-[selected=true]:!text-white",
            "disabled:!cursor-not-allowed disabled:not-[data-selected=true]:!opacity-50"
          )}
          disabled={isLoading}
        >
          <div className="flex flex-col gap-1">
            <span
              className={cn(
                "text-sm group-hover:text-white inline-flex items-center gap-1",
                "text-left font-medium text-black transition-colors duration-150",
                "group-data-[selected=true]:!text-white"
              )}
            >
              {action.name}
            </span>
            <span
              className={cn(
                "text-xs text-left text-gray-500 group-hover:text-white",
                "transition-colors duration-150",
                "group-data-[selected=true]:!text-white"
              )}
            >
              {action.description}
            </span>
          </div>

          {selectedAction === action.id && isLoading && (
            <Loader2 className="ml-auto w-4 h-4 animate-spin" />
          )}
        </button>
      ))}
    </div>
  );
} 