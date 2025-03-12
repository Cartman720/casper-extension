import { Tone } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ToneIcon } from "./tone-icon";
import { toneGroupColors } from "./controls";
import { Loader2 } from "lucide-react";
import { useClose } from "@headlessui/react";

interface TonesListProps {
  tones: Tone[];
  onToneSelect: (tone: string) => void;
}

export function TonesList({ tones, onToneSelect }: TonesListProps) {
  const [selectedTone, setSelectedTone] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // close the popover when the tone is selected
  const closePopover = useClose();

  const handleToneSelect = async (tone: string) => {
    setIsLoading(true);
    setSelectedTone(tone);

    try {
      await onToneSelect(tone);
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
    setSelectedTone(null);

    // close the popover
    closePopover();
  };

  return (
    <div className="flex flex-col gap-1 pb-2">
      {tones.map((tone) => (
        <button
          key={tone.value}
          onClick={() => handleToneSelect(tone.value)}
          data-selected={selectedTone === tone.value}
          className={cn(
            "px-4 py-1.5 text-left group bg-white capitalize w-full flex items-center gap-1",
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
              <ToneIcon
                icon={tone.icon}
                size={16}
                className={cn(
                  "group-hover:text-white",
                  "group-data-[selected=true]:!text-white",
                  toneGroupColors[tone.group]
                )}
              />{" "}
              {tone.label}
            </span>
            <span
              className={cn(
                "text-xs text-left text-gray-500 group-hover:text-white",
                "transition-colors duration-150",
                "group-data-[selected=true]:!text-white"
              )}
            >
              {tone.description}
            </span>
          </div>

          {selectedTone === tone.value && isLoading && (
            <Loader2 className="ml-auto w-4 h-4 animate-spin" />
          )}
        </button>
      ))}
    </div>
  );
}
