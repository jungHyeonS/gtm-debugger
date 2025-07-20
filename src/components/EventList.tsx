import { useState } from "react";
import type { DataLayerEvent } from "../types/event";
import { eventLabel, isGtagCommand, isGtmEvent } from "../uitls/eventUtils";

interface EventListProps {
  events: DataLayerEvent[];
}

function EventList({ events }: EventListProps) {
  const [openIdxList, setOpenIdxList] = useState<number[]>([]);

  const handleToggle = (idx: number) => {
    setOpenIdxList((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };
  // const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <ul className="w-full flex flex-col gap-4 items-center justify-center">
      {events.length === 0 && (
        <li className="text-gray-400 text-center mt-12">
          No dataLayer events yet.
        </li>
      )}
      {events.map((event, idx) => (
        <li
          key={idx}
          className="w-full bg-white border border-gray-200 rounded-2xl shadow transition hover:shadow-lg cursor-pointer"
          onClick={() => handleToggle(idx)}
        >
          {/* 카드 헤더 */}
          <div className="flex items-center gap-2 p-4">
            <span
              className={`inline-block px-2 py-1 rounded text-xs font-mono font-bold
                  ${
                    isGtmEvent(event)
                      ? "bg-blue-100 text-blue-700"
                      : isGtagCommand(event)
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
            >
              {isGtmEvent(event)
                ? "GTM"
                : isGtagCommand(event)
                ? "gtag.js"
                : "Unknown"}
            </span>
            <span className="text-base font-semibold flex-1 truncate">
              {eventLabel(event)}
            </span>
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${
                openIdxList.includes(idx) ? "rotate-90" : "rotate-270"
              } text-gray-400`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
          {/* 아코디언 바디 */}
          <div
            className={`overflow-hidden transition-all duration-200 px-4 ${
              openIdxList.includes(idx) ? "max-h-96" : "max-h-0"
            }`}
          >
            {openIdxList.includes(idx) && (
              <div className="pb-4">
                {/* 주요 필드(간단 하이라이트) */}
                <div className="text-xs mb-1 text-gray-600">
                  {isGtmEvent(event) && (
                    <>
                      <b>Event:</b> {event.event}
                      {event["gtm.uniqueEventId"] && (
                        <>
                          {" "}
                          <b>| ID:</b> {event["gtm.uniqueEventId"]}
                        </>
                      )}
                    </>
                  )}
                  {isGtagCommand(event) && (
                    <>
                      <b>Command:</b> {event[0]}
                      {event[1] !== undefined && (
                        <>
                          {" "}
                          <b>| Arg:</b> {JSON.stringify(event[1])}
                        </>
                      )}
                    </>
                  )}
                </div>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto border border-gray-200 max-h-[300px] overflow-y-auto">
                  {JSON.stringify(event, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
export default EventList;
