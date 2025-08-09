// background.ts
import { storage } from '#imports';

export default defineBackground(() => {
  browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    console.log('message', message);

    // GET FROM STORAGE
    if (message?.action === 'getStorage') {
      storage.getItem(message.key).then((value) => {
        sendResponse({ value });
      });
      return true; // keep channel open for async sendResponse
    }

    // SET STORAGE
    if (message?.action === 'setStorage') {
      storage.setItem(message.key, message.value).then(() => {
        sendResponse({ success: true });
      });
      return true;
    }

    // OPEN LOGIN POPUP (must be triggered by a real user gesture from content UI)
    if (message?.type === 'OPEN_LOGIN_POPUP') {
      try {
        // @ts-ignore - Chrome-only API
        if (chrome?.action?.openPopup) {
          // Must be invoked synchronously off the message; don't await.
          // @ts-ignore
          chrome.action.openPopup();
          sendResponse({ ok: true, via: 'popup' });
          return true;
        }
      } catch {
        // fall through to fallback
      }

      // Cross-browser fallback (async)
      browser.runtime.openOptionsPage().then(() => {
        sendResponse({ ok: true, via: 'options' });
      });
      return true;
    }

    // Unknown message
    sendResponse({ ok: false, error: 'unknown_message' });
    return false;
  });
});
