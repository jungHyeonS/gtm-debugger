const injectedTabs = new Set<number>();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const tabId = sender.tab?.id;
  console.log("Background received message:", message, sender);
  console.log("Sender tab id:", tabId);

  if (message.type === "DATA_LAYER_EVENT") {
    chrome.storage.local.get({ events: [] }, (res) => {
      const newEvents = res.events.concat([message.payload]);
      chrome.storage.local.set({ events: newEvents });

      chrome.runtime.sendMessage({
        type: "DATA_LAYER_EVENT",
        payload: message.payload,
      });
    });
  }

  if (message.type === "GET_DATA_LAYER_EVENTS") {
    console.log("Fetching dataLayer events for tab:", tabId);
    chrome.storage.local.get({ events: [] }, (res) => {
      sendResponse({ events: res.events });
    });
    return true;
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  injectedTabs.delete(tabId);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  console.log("Tab updated:", tabId, changeInfo);
  if (changeInfo.status === "loading") {
    chrome.storage.local.set({ events: [] });
  }
});
