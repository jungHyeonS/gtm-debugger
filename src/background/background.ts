const injectedTabs = new Set<number>();

chrome.runtime.onMessage.addListener((message, sender) => {
  const tabId = sender.tab?.id;
  console.log('Background received message:', message, sender);
  console.log('Sender tab id:', tabId);

  if (message.action === 'injectDataLayerScript' && tabId) {
    if (!injectedTabs.has(tabId)) {
      chrome.scripting
        .executeScript({
          target: { tabId },
          files: ['inject.js'],
        })
        .then(() => {
          console.log(`inject.js injected into tab ${tabId}`);
          injectedTabs.add(tabId);
        })
        .catch((error) => {
          console.error('Failed to inject script:', error);
        });
    } else {
      console.log(`inject.js already injected into tab ${tabId}, skipping`);
    }
  }

  if (message.type === 'DATA_LAYER_EVENT') {
    console.log('Background received dataLayer event:', message.payload);
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  injectedTabs.delete(tabId);
});
