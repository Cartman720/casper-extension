import { browser } from 'wxt/browser';

export async function getStorageValue(key: string) {
  const response: any = await browser.runtime.sendMessage({
    action: 'getStorage',
    key,
  });

  return response.value;
}

export async function setStorageValue(key: string, value: string) {
  await browser.runtime.sendMessage({ action: 'setStorage', key, value });
}
