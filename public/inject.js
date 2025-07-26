(function () {
  if (window.top !== window.self) {
    console.log('inject.js: Not running in top frame. Skipping.');
    return;
  }

  if (window.__myExtensionDataLayerInjected) return;
  window.__myExtensionDataLayerInjected = true;

  // retry 10번만
  let retryCount = 0;
  const maxRetries = 10;

  // Arguments 객체를 일반 객체로 변환하는 함수
  function convertArgumentsToObject(args) {
    if (args && typeof args === 'object' && args.callee) {
      // Arguments 객체인 경우
      const result = {};
      for (let i = 0; i < args.length; i++) {
        result[i] = args[i];
      }
      // 추가 속성들도 복사
      Object.keys(args).forEach((key) => {
        if (
          key !== 'length' &&
          key !== 'callee' &&
          key !== 'Symbol(Symbol.iterator)'
        ) {
          result[key] = args[key];
        }
      });
      return result;
    }
    return args;
  }

  // 객체를 안전하게 직렬화하는 함수
  function safeStringify(obj) {
    try {
      if (obj && typeof obj === 'object' && obj.callee) {
        // Arguments 객체인 경우
        return JSON.stringify(convertArgumentsToObject(obj));
      }
      return JSON.stringify(obj);
    } catch (e) {
      console.warn('Failed to stringify object:', e);
      return null;
    }
  }

  function safeClone(obj) {
    const seen = new WeakSet();
    function clone(val) {
      if (typeof val === 'object' && val !== null) {
        if (seen.has(val)) return '[Circular]';
        seen.add(val);
        if (val instanceof HTMLElement) {
          // HTML 요소는 selector 또는 outerHTML로 변환
          return val.outerHTML || val.tagName;
        }
        const out = Array.isArray(val) ? [] : {};
        for (const key in val) {
          out[key] = clone(val[key]);
        }
        return out;
      }
      return val;
    }
    return clone(obj);
  }

  function hookDataLayer() {
    if (!window.dataLayer) {
      console.log('dataLayer not found yet, retrying...');
      return false;
    }

    const originalPush = window.dataLayer.push.bind(window.dataLayer);

    window.dataLayer.push = function () {
      const args = Array.from(arguments)
        .map((arg) => {
          try {
            if (arg && arg.event === 'gtm.click') {
              const cloned = safeClone(arg);
              return cloned;
            }
            if (arg && typeof arg === 'object' && arg.callee) {
              // Arguments 객체인 경우
              return convertArgumentsToObject(arg);
            }
            return JSON.parse(JSON.stringify(arg));
          } catch (e) {
            console.warn('Failed to process argument:', e);
            return undefined;
          }
        })
        .filter((arg) => arg !== undefined);

      window.postMessage({ source: 'my-extension-dataLayer', data: args }, '*');
      return originalPush.apply(this, arguments);
    };

    // 기존 dataLayer 이벤트들을 처리
    window.dataLayer.forEach((event, index) => {
      try {
        let processedEvent;
        if (event && typeof event === 'object' && event.callee) {
          // Arguments 객체인 경우
          processedEvent = convertArgumentsToObject(event);
        } else {
          processedEvent = event;
        }

        // 안전하게 직렬화
        const serialized = safeStringify(processedEvent);

        console.log('serialized11', serialized);
        if (serialized) {
          window.postMessage(
            { source: 'my-extension-dataLayer', data: [processedEvent] },
            '*'
          );
        }
      } catch (e) {
        console.warn('Failed to process initial event:', e);
      }
    });

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
