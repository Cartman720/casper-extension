import { createRoot } from "react-dom/client";
import "../styles/global.css";
import { client } from "@/lib/service";
import { Tone } from "@/lib/types";

// Function to inject React app near comment inputs
function injectReactApp(element: HTMLElement, tones: Tone[]): void {
  console.log("injectReactApp", element);

  const containerId = `ai-assist-container-${Math.random()
    .toString(36)
    .substring(2, 9)}`;

  const container = document.createElement("div");
  container.id = containerId;

  // Insert the container into the DOM
  element.parentNode?.insertBefore(container, element.nextSibling);

  // Render React component inside the shadow DOM
  const root = createRoot(container);

  root.render(<Controls targetElement={element} tones={tones} />);
}

// DOM observation logic
function checkElementForCommentInput(element: Node, tones: Tone[]): void {
  if (
    element.nodeType === Node.ELEMENT_NODE &&
    (element as HTMLElement).getAttribute?.("data-e2e") === "comment-input"
  ) {
    injectReactApp(element as HTMLElement, tones);
    return;
  }

  if (element instanceof HTMLElement) {
    const commentInputs = element.querySelectorAll(
      '[data-e2e="comment-input"]'
    );
    commentInputs.forEach((input) =>
      injectReactApp(input as HTMLElement, tones)
    );
  }
}

function observeDOMChanges(tones: Tone[]): () => void {
  const observer = new MutationObserver((mutations: MutationRecord[]) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
          checkElementForCommentInput(node, tones);
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

function initialCheck(tones: Tone[]): void {
  const existingInputs = document.querySelectorAll(
    '[data-e2e="comment-input"]'
  );
  existingInputs.forEach((input) =>
    injectReactApp(input as HTMLElement, tones)
  );
}

export default defineContentScript({
  matches: ["https://www.tiktok.com/*"],
  async main(ctx) {
    try {
      const tones = await client.get("/messages/tones");

      // Initialize the app
      initialCheck(tones);

      // Subscribe to DOM changes
      observeDOMChanges(tones);
    } catch (error) {
      console.error("Error in content script:", error);
    }
  },
});
