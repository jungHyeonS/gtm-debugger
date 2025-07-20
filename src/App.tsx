import { useEffect, useState } from "react";
import EventList from "./components/EventList";
import type { DataLayerEvent } from "./types/event";

export default function App() {
  const [events, setEvents] = useState<DataLayerEvent[]>([]);

  useEffect(() => {
    chrome.runtime.sendMessage({ type: "GET_DATA_LAYER_EVENTS" }, (res) => {
      if (res?.events) {
        setEvents(res.events.flat ? res.events.flat() : res.events);
      }
    });

    const handler = (msg: any) => {
      if (msg.type === "DATA_LAYER_EVENT") {
        setEvents((prev) => [...prev, msg.payload]);
      }
    };
    chrome.runtime.onMessage.addListener(handler);
    return () => chrome.runtime.onMessage.removeListener(handler);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 max-w-[500px] w-full p-4">
      <div className="w-full mx-auto">
        <h1 className="text-xl font-bold text-blue-600 mb-4 tracking-tight">
          GTM Debugger
        </h1>
        <EventList events={events} />
      </div>
    </div>
  );
}
