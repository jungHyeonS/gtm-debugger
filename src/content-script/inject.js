(function () {
  if (window.top !== window.self) {
    console.log("inject.js: Not running in top frame. Skipping.");
    return;
  }

  if (window.__myExtensionDataLayerInjected) return;
  window.__myExtensionDataLayerInjected = true;

  // retry 10번만
  let retryCount = 0;
  const maxRetries = 10;
  function hookDataLayer() {
    if (!window.dataLayer) {
      console.log("dataLayer not found yet, retrying...");
      return false;
    }

    const originalPush = window.dataLayer.push.bind(window.dataLayer);

    window.dataLayer.push = function () {
      const args = Array.from(arguments)
        .map((arg) => {
          try {
            return JSON.parse(JSON.stringify(arg));
          } catch {
            return undefined;
          }
        })
        .filter((arg) => arg !== undefined);

      window.postMessage({ source: "my-extension-dataLayer", data: args }, "*");
      return originalPush.apply(this, arguments);
    };

    window.dataLayer.forEach((event) => {
      console.log("Initial dataLayer event:", event);
      window.postMessage(
        { source: "my-extension-dataLayer", data: [event] },
        "*"
      );
    });

    return true;
  }

  // 처음 실행 시 시도하고, 실패하면 500ms 간격으로 재시도
  if (!hookDataLayer()) {
    const interval = setInterval(() => {
      if (retryCount >= maxRetries) {
        console.warn(
          "Max retries reached, stopping attempts to hook dataLayer"
        );
        clearInterval(interval);
        return;
      }
      retryCount++;
      if (hookDataLayer()) {
        clearInterval(interval);
      }
    }, 500);
  }
})();
