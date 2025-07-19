(function () {
  if (window.__myExtensionDataLayerInjected) return;
  window.__myExtensionDataLayerInjected = true;

  // retry 10번만
  let retryCount = 0;
  const maxRetries = 10;
  function hookDataLayer() {
    console.log(window);
    if (!window.dataLayer) {
      console.log('dataLayer not found yet, retrying...');
      return false;
    }

    const originalPush = window.dataLayer.push.bind(window.dataLayer);

    window.dataLayer.push = function () {
      console.log('dataLayer push called with arguments:', arguments);
      const args = Array.from(arguments);
      window.postMessage({ source: 'my-extension-dataLayer', data: args }, '*');
      return originalPush(...args);
    };

    window.dataLayer.forEach((event) => {
      console.log('Initial dataLayer event:', event);
      window.postMessage(
        { source: 'my-extension-dataLayer', data: [event] },
        '*'
      );
    });

    console.log('dataLayer hooked successfully');

    return true;
  }

  // 처음 실행 시 시도하고, 실패하면 500ms 간격으로 재시도
  if (!hookDataLayer()) {
    const interval = setInterval(() => {
      if (retryCount >= maxRetries) {
        console.warn(
          'Max retries reached, stopping attempts to hook dataLayer'
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
