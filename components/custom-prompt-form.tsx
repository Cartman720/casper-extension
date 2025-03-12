import { cn } from "@/lib/utils";
import { Button } from "./button";
import { CrownIcon, Wand2Icon } from "lucide-react";

interface CustomPromptFormProps {
  onSubmit: (prompt: string) => void;
}

export function CustomPromptForm({ onSubmit }: CustomPromptFormProps) {
  return (
    <div className="pb-4 px-4">
      <div className="text-sm text-gray-500 mb-3 flex items-center justify-between">
        <div className="font-bold text-black flex items-center gap-2">
          <CrownIcon className="w-4 h-4 text-amber-500" />
          Premium Feature
        </div>

        <div className="text-sm font-semibold text-green-600 bg-green-200 px-3 py-1 rounded-2xl">
          Activated
        </div>
      </div>

      <div className="text-sm text-gray-500 mb-4">
        <div className="font-medium">Examples:</div>

        <ul className="list-disc list-inside">
          <li>Respond in the style of Shakespeare</li>
          <li>Respond like a pirate would</li>
          <li>Use technical language appropriate for engineers</li>
        </ul>
      </div>

      <div className="mb-2">
        <textarea
          className={cn(
            "placeholder:text-gray-500",
            "w-full rounded-sm !border !mb-2 !border-gray-300 focus:outline-none p-2",
            "focus:!border-[#FE2C55] focus:!ring-2 ring-[#FE2C55] focus:!ring-offset-2"
          )}
          placeholder="Enter your custom tone instructions..."
        />

        <Button type="submit" className="w-full">
          Generate Custom Reply <Wand2Icon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
