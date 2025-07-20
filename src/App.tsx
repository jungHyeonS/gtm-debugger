import { useEffect, useState } from "react";
import "./App.css";

interface GtmEvent {
  event: string;
  "gtm.start"?: number;
  "gtm.uniqueEventId"?: number;
  "gtm.triggers"?: any[];
  [key: string]: any;
}

interface GtagCommand {
  0: string;
  1?: any;
  2?: any;
  3?: any;
  [key: number]: any;
}

type DataLayerEvent = GtmEvent | GtagCommand;

function App() {
  const [events, setEvents] = useState<DataLayerEvent[]>([]);

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
          {/* <pre>{JSON.stringify(events)}</pre> */}

          {/* 테일윈드 기반으로 gtm debugge view 처럼 리스트 형태*/}
          <ul className="space-y-4">
            {events.map((event, index) => (
              <li
                key={index}
                className="bg-white border rounded-2xl shadow p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block px-2 py-1 rounded text-xs font-mono font-bold bg-blue-100 text-blue-700">
                    {isGtmEvent(event)
                      ? "GTM Event"
                      : isGtagCommand(event)
                      ? "gtag.js"
                      : "Unknown"}
                  </span>
                  <span className="text-lg font-semibold">
                    {eventLabel(event)}
                  </span>
                  {isGtmEvent(event) && event.gtm.uniqueEventId && (
                    <span className="text-xs ml-2 text-gray-500">
                      (#{event.gtm.uniqueEventId})
                    </span>
                  )}
                </div>
                {/* 주요 필드 하이라이트 */}
                <div className="mb-1">
                  {isGtmEvent(event) && (
                    <span className="text-gray-600">
                      <b>Event:</b> {event.event}
                      {event["gtm.uniqueEventId"] && (
                        <>
                          {" "}
                          <b> | ID:</b> {event["gtm.uniqueEventId"]}{" "}
                        </>
                      )}
                    </span>
                  )}
                  {isGtagCommand(event) && (
                    <span className="text-gray-600">
                      <b>Command:</b> {event[0]}
                      {event[1] !== undefined && (
                        <>
                          {" "}
                          <b> | Arg:</b> {JSON.stringify(event[1])}{" "}
                        </>
                      )}
                    </span>
                  )}
                </div>
                {/* 전체 원본 JSON */}
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto mt-2">
                  {JSON.stringify(event, null, 2)}
                </pre>
              </li>
            ))}
          </ul>
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

function isGtmEvent(obj: DataLayerEvent): obj is GtmEvent {
  return !!obj && typeof obj === "object" && "event" in obj;
}

function isGtagCommand(obj: DataLayerEvent): obj is GtagCommand {
  return (
    !!obj && typeof obj === "object" && "0" in obj && typeof obj[0] === "string"
  );
}

function eventLabel(event: DataLayerEvent) {
  if (isGtmEvent(event)) return event.event;
  if (isGtagCommand(event)) return `[gtag] ${event[0]}`;
  return "[Unknown]";
}
