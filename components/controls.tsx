import { useEffect, useState } from "react";
import { CrownIcon, Loader2, SparkleIcon } from "lucide-react";
import { Tone } from "@/lib/types";
import { client } from "@/lib/service";
import {
  Popover,
  PopoverBackdrop,
  PopoverButton,
  PopoverPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import { cn } from "@/lib/utils";
import { TonesList } from "./tones-list";
import { CustomPromptForm } from "./custom-prompt-form";

interface ControlsProps {
  targetElement: HTMLElement;
  tones: Tone[];
}

export const toneGroupColors: Record<string, string> = {
  Positive: "text-[#FF0050]", // Geist red-600: warm, upbeat energy for Friendly & Playful
  Engaging: "text-[#14D390]", // Geist green-600: fresh, lively for Trendy & Witty
  Supportive: "text-[#0070F0]", // Geist blue-600: calm, trustworthy for Sincere & Apologetic
};

export function Controls({ targetElement, tones }: ControlsProps) {
  const [commentWrapper, setCommentWrapper] = useState<HTMLElement | null>(
    null
  );
  const [content, setContent] = useState<string>("");
  const [reply, setReply] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGenerate = async (tone: string) => {
    // Open the dropdown
    setIsLoading(true);

    try {
      const response = await client.post("/messages/generate-reply", {
        originalMessage: content,
        tone,
      });

      setReply(response.reply);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithPrompt = (prompt: string) => {};

  // Function to find the parent div with class "DivCommentObjectWrapper"
  const findCommentWrapper = (element: HTMLElement): HTMLElement | null => {
    let currentElement: HTMLElement | null = element;

    while (currentElement) {
      const classes = Array.from(currentElement.classList);

      if (
        currentElement.tagName === "DIV" &&
        classes.some(
          (cls) =>
            cls.includes("DivCommentObjectWrapper") ||
            cls.includes("DivCommentItemContainer")
        )
      ) {
        return currentElement;
      }

      currentElement = currentElement.parentElement as HTMLElement | null;
    }

    return null; // Return null if no matching parent is found
  };

  // Run the search when the component mounts or targetElement changes
  useEffect(() => {
    if (targetElement) {
      const wrapper = findCommentWrapper(targetElement);
      setCommentWrapper(wrapper);

      if (targetElement.parentElement?.parentElement) {
        targetElement.parentElement.parentElement.style.alignItems = "baseline";
      }

      console.log("Found comment wrapper:", wrapper); // Debug log
    }
  }, [targetElement]);

  useEffect(() => {
    if (commentWrapper) {
      const element = commentWrapper.childNodes[0] as HTMLElement;

      // TODO: Remove this
      console.log(
        "DETAILS:",
        commentWrapper,
        commentWrapper.childNodes[0],
        element.innerText
      );

      setContent(element.innerText);
    }
  }, [commentWrapper]);

  // Simulate typing into the Draft.js editor
  // This method avoids directly manipulating innerHTML.
  function simulatePaste(element: HTMLElement, text: string) {
    // Focus the editor and remove its existing content.
    element.focus();

    // Clear existing content by selecting all.
    // As soon pasted, the content will be replaced.
    document.execCommand("selectAll", true, "");

    setTimeout(() => {
      element.focus();

      // Create clipboard data with the desired text.
      const clipboardData = new DataTransfer();
      clipboardData.setData("text/plain", text);

      // Create and dispatch a paste event carrying the clipboard data.
      const pasteEvent = new ClipboardEvent("paste", {
        bubbles: true,
        cancelable: true,
        clipboardData,
      });

      element.dispatchEvent(pasteEvent);
    }, 200);
  }

  // Update the Draft.js editor with the reply
  useEffect(() => {
    console.log("SET CONTENT EFFECT:", reply, targetElement);

    if (reply && targetElement) {
      const editorDiv = targetElement.querySelector(
        "[contenteditable='true']"
      ) as HTMLElement;

      simulatePaste(editorDiv, reply);
    }
  }, [reply, targetElement]);

  return (
    <div className="mt-2 relative">
      <Popover>
        <PopoverButton className="!bg-[#ff0050] text-white px-4 py-2 rounded-sm inline-flex items-center gap-2">
          Generate Reply{" "}
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <SparkleIcon className="w-4 h-4" />
          )}
        </PopoverButton>

        <PopoverBackdrop className="fixed inset-0  z-[9999] bg-black/40" />

        <PopoverPanel
          className="w-[375px] z-[9999] bg-white shadow-lg rounded-sm"
          anchor={{
            gap: 10,
            to: "bottom start",
          }}
        >
          <TabGroup>
            <div className="p-4 pb-2">
              <h3 className="text-black font-medium text-sm">
                Generate a reply
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Select a tone for your generated response
              </p>
            </div>

            <TabList className="rounded-sm px-2 mb-3">
              <div className="flex items-center gap-2">
                <Tab
                  className={cn(
                    "!font-medium inline-flex items-center justify-center gap-2 text-sm",
                    "!border-black/40 !border !outline-white",
                    "text-black !bg-white rounded-md p-1 flex-1",
                    "data-selected:!bg-[#ff0050] data-selected:!border-[#ff0050] data-selected:!text-white transition-colors duration-200"
                  )}
                >
                  Select Tone
                </Tab>
                <Tab
                  className={cn(
                    "!font-medium inline-flex items-center justify-center gap-2 text-sm",
                    "!border-amber-500 !border !outline-white",
                    "text-white !bg-gradient-to-r from-amber-500 to-pink-500 rounded-md p-1 flex-1",
                    "hover:from-amber-600 hover:to-pink-600",
                    "data-selected:!bg-[#ff0050] data-selected:!border-ping-500 data-selected:!text-white transition-colors duration-200"
                  )}
                >
                  Customize Prompt{" "}
                  <CrownIcon className="w-4 h-4 text-amber-white animate-pulse" />
                </Tab>
              </div>
            </TabList>

            <TabPanels>
              <TabPanel>
                <TonesList tones={tones} onToneSelect={handleGenerate} />
              </TabPanel>

              <TabPanel>
                <CustomPromptForm onSubmit={handleWithPrompt} />
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </PopoverPanel>
      </Popover>
    </div>
  );
}
