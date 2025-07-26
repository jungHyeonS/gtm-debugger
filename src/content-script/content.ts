(() => {
  const body = document.querySelector("body");
  if (body) {
    body.classList.add("content-script-loaded");
    console.log("Content script loaded successfully");
    // === inject.js 삽입 ===
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("inject.js"); // 빌드 결과물이 inject.js라면
    script.onload = () => {
      console.log("Inject script loaded successfully");
      script.remove();
    };
    (document.head || document.documentElement).appendChild(script);
  } else {
    console.error("Body element not found");
  }
})();

window.addEventListener("message", (event) => {
  if (event.source !== window) return;
  if (event.data?.source === "my-extension-dataLayer") {
    chrome.runtime.sendMessage({
      type: "DATA_LAYER_EVENT",
      payload: event.data.data,
    });
  }
});
