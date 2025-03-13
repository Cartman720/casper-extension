import { useEffect, useState } from 'react';
import { CrownIcon, Loader2, SparkleIcon } from 'lucide-react';
import { Action } from '@/lib/types';
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
} from '@headlessui/react';
import { cn } from '@/lib/utils';
import { ActionsList } from './actions-list';
import { CustomPromptForm } from './custom-prompt-form';
import { contentClient } from '@/lib/content-service';

interface ControlsProps {
  targetElement: HTMLElement;
}

export const toneGroupColors: Record<string, string> = {
  Positive: 'text-[#FE2C55]',
  Engaging: 'text-[#14D390]',
  Supportive: 'text-[#0070F0]',
};

export function Controls({ targetElement }: ControlsProps) {
  const [commentWrapper, setCommentWrapper] = useState<HTMLElement | null>(
    null,
  );
  const [content, setContent] = useState<string>('');
  const [reply, setReply] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGenerate = async (action: string) => {
    // Open the dropdown
    setIsLoading(true);

    try {
      const response = await contentClient.post('/messages/generate-reply', {
        originalMessage: content || '',
        action,
      });

      setReply(response.reply);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithPrompt = async (prompt: string) => {
    setIsLoading(true);

    try {
      const response = await contentClient.post('/messages/generate-reply', {
        originalMessage: content || '',
        action: prompt,
      });

      setReply(response.reply);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to find the parent div with class "DivCommentObjectWrapper"
  const findCommentWrapper = (element: HTMLElement): HTMLElement | null => {
    let currentElement: HTMLElement | null = element;

    while (currentElement) {
      const classes = Array.from(currentElement.classList);

      if (
        currentElement.tagName === 'DIV' &&
        classes.some(
          (cls) =>
            cls.includes('DivCommentObjectWrapper') ||
            cls.includes('DivCommentItemContainer'),
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
        targetElement.parentElement.parentElement.style.alignItems = 'baseline';
      }
    }
  }, [targetElement]);

  useEffect(() => {
    if (commentWrapper) {
      const element = commentWrapper.childNodes[0] as HTMLElement;

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
    document.execCommand('selectAll', true, '');

    setTimeout(() => {
      element.focus();

      // Create clipboard data with the desired text.
      const clipboardData = new DataTransfer();
      clipboardData.setData('text/plain', text);

      // Create and dispatch a paste event carrying the clipboard data.
      const pasteEvent = new ClipboardEvent('paste', {
        bubbles: true,
        cancelable: true,
        clipboardData,
      });

      element.dispatchEvent(pasteEvent);
    }, 200);
  }

  // Update the Draft.js editor with the reply
  useEffect(() => {
    console.log('SET CONTENT EFFECT:', reply, targetElement);

    if (reply && targetElement) {
      const editorDiv = targetElement.querySelector(
        "[contenteditable='true']",
      ) as HTMLElement;

      simulatePaste(editorDiv, reply);
    }
  }, [reply, targetElement]);

  return (
    <div className="relative mt-2">
      <Popover>
        <PopoverButton className="inline-flex items-center gap-2 rounded-md !bg-[#FE2C55] px-4 py-2 text-white">
          Generate Reply{' '}
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <SparkleIcon className="h-4 w-4" />
          )}
        </PopoverButton>

        <PopoverBackdrop className="fixed inset-0 z-[9999] bg-black/40" />

        <PopoverPanel
          className="z-[9999] w-[375px] rounded-sm bg-white shadow-lg"
          anchor={{
            gap: 10,
            to: 'bottom start',
          }}
        >
          <TabGroup defaultIndex={0}>
            <div className="p-4 pb-2">
              <h3 className="text-sm font-medium text-black">
                Generate a reply
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                Select a tone for your generated response
              </p>
            </div>

            <TabList className="mb-3 rounded-sm px-2">
              <div className="flex items-center gap-2">
                <Tab
                  className={cn(
                    'inline-flex items-center justify-center gap-2 text-sm !font-medium',
                    '!border !border-black/40 !outline-white',
                    'flex-1 rounded-md !bg-white p-1 text-black',
                    'transition-colors duration-200 data-selected:!border-[#FE2C55] data-selected:!bg-[#FE2C55] data-selected:!text-white',
                  )}
                >
                  Select Tone
                </Tab>
                <Tab
                  className={cn(
                    'inline-flex items-center justify-center gap-2 text-sm !font-medium',
                    '!border !border-amber-500 !outline-white',
                    'flex-1 rounded-md !bg-gradient-to-r from-amber-500 to-pink-500 p-1 text-white',
                    'hover:from-amber-600 hover:to-pink-600',
                    'data-selected:!border-ping-500 transition-colors duration-200 data-selected:!bg-[#FE2C55] data-selected:!text-white',
                  )}
                >
                  Customize Prompt{' '}
                  <CrownIcon className="text-amber-white h-4 w-4 animate-pulse" />
                </Tab>
              </div>
            </TabList>

            <TabPanels>
              <TabPanel>
                <ActionsList onActionSelect={handleGenerate} />
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
