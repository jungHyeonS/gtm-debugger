import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    // 팝업이 열릴 때마다 전체 이벤트를 가져옴
    chrome.runtime.sendMessage({ type: "GET_DATA_LAYER_EVENTS" }, (res) => {
      if (res?.events) setEvents(res.events);
    });

    // 실시간 메시지 수신 (옵션)
    const handler = (msg: any) => {
      if (msg.type === "DATA_LAYER_EVENT") {
        setEvents((prev) => [...prev, msg.payload]);
      }
    };
    chrome.runtime.onMessage.addListener(handler);
    return () => chrome.runtime.onMessage.removeListener(handler);
  }, []);
  return (
    <>
      {events ? (
        <div className="card">
          <h1>GTM Debugger</h1>
          <p>Received dataLayer event:</p>
          <pre>{JSON.stringify(events)}</pre>
        </div>
      ) : (
        <div className="card">
          <h1>GTM Debugger</h1>
          <p>No dataLayer events received yet.</p>
        </div>
      )}
    </>
  );
}

export default App;
