import type { DataLayerEvent } from '../types/event';

function getStoragKey(tabId: number, url: string): string {
  try {
    const u = new URL(url);
    return `events_${tabId}_${u.hostname}${u.pathname}`;
  } catch (e: any) {
    console.warn('Invalid URL:', url, e);
    return `events_${tabId}`;
  }
}

const injectedTabs = new Set<number>();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'RESET_DATA_LAYER_EVENTS') {
    //모든 데이터 리셋
    chrome.storage.local.clear(() => {
      sendResponse({ ok: true });
    });
    return true;
  }

  const tabId = message.tabId || sender.tab?.id;
  const url = message.url || sender.tab?.url;
  if (!tabId || !url) {
    console.warn('No tabId or url found in sender:', sender);
    return;
  }

  const key = getStoragKey(tabId, url);

  if (message.type === 'DATA_LAYER_EVENT') {
    console.log('Data Layer event received:', message.payload);

    // [key]:[] 무조건 빈 배열이다 이건 문제다

    chrome.storage.local.get([key], (res) => {
      const prev = Array.isArray(res[key]) ? res[key] : [];

      console.log('res[key]', res[key]);
      const newEvents = prev.concat(message.payload);
      chrome.storage.local.set({ [key]: newEvents });
    });
  }

  if (message.type === 'ALL_DATA_LAYER_EVENTS') {
    chrome.storage.local.get(null, (all) => {
      const grouped = Object.keys(all)
        .filter((key) => key.startsWith('events_'))
        .reduce((acc, key) => {
          acc[key.replace(/^events_/, '')] = all[key];
          return acc;
        }, {} as { [pageKey: string]: DataLayerEvent[] });
      sendResponse({ grouped });
    });
    return true;
  }

  if (message.type === 'GET_DATA_LAYER_EVENTS') {
    chrome.storage.local.get({ [key]: [] }, (res) => {
      sendResponse({ events: res[key] });
    });
    return true;
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  injectedTabs.delete(tabId);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  try {
    if (changeInfo.status === 'loading' && tab.url) {
      const key = getStoragKey(tabId, tab.url);
      chrome.storage.local.set({ [key]: [] });
    }
  } catch (e) {
    console.log('Error in onUpdated listener:', e);
  }
});
