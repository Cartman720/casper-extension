import { storage } from 'wxt/storage';

export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });

  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getStorage') {
      storage.getItem(message.key).then((value) => {
        sendResponse({ value });
      });
    } else if (message.action === 'setStorage') {
      storage.setItem(message.key, message.value).then(() => {
        sendResponse({ success: true });
      });
    }

    return true;
  });
});
