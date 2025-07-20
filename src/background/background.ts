const injectedTabs = new Set<number>();

chrome.runtime.onMessage.addListener((message, sender) => {
  const tabId = sender.tab?.id;
  console.log("Background received message:", message, sender);
  console.log("Sender tab id:", tabId);

  if (message.type === "DATA_LAYER_EVENT") {
    console.log("Background received dataLayer event:", message.payload);
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  injectedTabs.delete(tabId);
});
