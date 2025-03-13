import { createRoot } from 'react-dom/client';
import { ControlsApp } from '@/components/controls-app';
import '../styles/global.css';

// Function to inject React app near comment inputs
function injectReactApp(element: HTMLElement): void {
  console.log('injectReactApp', element);

  const containerId = `ai-assist-container-${Math.random()
    .toString(36)
    .substring(2, 9)}`;

  const container = document.createElement('div');
  container.id = containerId;

  // Insert the container into the DOM
  element.parentNode?.insertBefore(container, element.nextSibling);

  // Render React component inside the shadow DOM
  const root = createRoot(container);

  root.render(<ControlsApp targetElement={element} />);
}

// DOM observation logic
function checkElementForCommentInput(element: Node): void {
  if (
    element.nodeType === Node.ELEMENT_NODE &&
    (element as HTMLElement).getAttribute?.('data-e2e') === 'comment-input'
  ) {
    injectReactApp(element as HTMLElement);
    return;
  }

  if (element instanceof HTMLElement) {
    const commentInputs = element.querySelectorAll(
      '[data-e2e="comment-input"]',
    );
    commentInputs.forEach((input) => injectReactApp(input as HTMLElement));
  }
}

function observeDOMChanges(): () => void {
  const observer = new MutationObserver((mutations: MutationRecord[]) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
          checkElementForCommentInput(node);
        });
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  return () => observer.disconnect();
}

function initialCheck(): void {
  const existingInputs = document.querySelectorAll(
    '[data-e2e="comment-input"]',
  );
  existingInputs.forEach((input) => injectReactApp(input as HTMLElement));
}

export default defineContentScript({
  matches: ['https://www.tiktok.com/*'],
  async main(ctx) {
    try {
      // // Initialize the app
      initialCheck();

      // // Subscribe to DOM changes
      observeDOMChanges();
    } catch (error) {
      console.error('Error in content script:', error);
    }
  },
});
