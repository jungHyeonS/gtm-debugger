import { useState } from "react";
import type { GroupedEvents, DataLayerEvent } from "../types/event";
import { eventLabel, isGtagCommand, isGtmEvent } from "../uitls/eventUtils";

interface EventListProps {
  grouped: GroupedEvents;
}

function EventList({ grouped }: EventListProps) {
  const [openPageKeys, setOpenPageKeys] = useState<Set<string>>(new Set());
  const [openEventKeys, setOpenEventKeys] = useState<Set<string>>(new Set());

  const handleTogglePage = (pageKey: string) => {
    setOpenPageKeys((prev) => {
      const next = new Set(prev);
      if (next.has(pageKey)) next.delete(pageKey);
      else next.add(pageKey);
      return next;
    });
  };

  const handleToggleEvent = (pageKey: string, eventIdx: number) => {
    const key = `${pageKey}__${eventIdx}`;
    setOpenEventKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  if (Object.keys(grouped).length === 0) {
    return (
      <div className="text-gray-400 text-center mt-12">
        No dataLayer events yet.
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      {Object.entries(grouped).map(([pageKey, eventList]) => {
        // eventList: DataLayerEvent[][]
        const events: DataLayerEvent[] = eventList.flat().filter(Boolean);

        if (events.length === 0) return null;

        return (
          <div
            key={pageKey}
            className="w-full border rounded-2xl bg-white shadow"
          >
            {/* 페이지 헤더 */}
            <div
              className="flex items-center cursor-pointer px-4 py-3 select-none"
              onClick={() => handleTogglePage(pageKey)}
            >
              <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-700 mr-2">
                {pageKey}
              </span>
              <span className="ml-auto text-xs text-gray-500">
                {events.length} events
              </span>
              <svg
                className={`w-4 h-4 ml-2 transition-transform ${
                  openPageKeys.has(pageKey) ? "rotate-90" : ""
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
            {/* 페이지별 이벤트 리스트 */}
            <div
              className={`transition-all duration-200 overflow-hidden ${
                openPageKeys.has(pageKey) ? "max-h-[800px]" : "max-h-0"
              }`}
            >
              {openPageKeys.has(pageKey) && (
                <ul className="space-y-2 px-4 py-2">
                  {events.map((event, eventIdx) => {
                    const eventKey = `${pageKey}__${eventIdx}`;
                    return (
                      <li
                        key={eventKey}
                        className="border border-gray-200 bg-gray-50 rounded-lg p-2"
                      >
                        {/* 이벤트 헤더 */}
                        <div
                          className="flex items-center cursor-pointer"
                          onClick={() => handleToggleEvent(pageKey, eventIdx)}
                        >
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-bold mr-2
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
                          <span className="text-sm font-semibold flex-1">
                            {eventLabel(event)}
                          </span>
                          <svg
                            className={`w-4 h-4 ml-2 transition-transform ${
                              openEventKeys.has(eventKey) ? "rotate-90" : ""
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
                        {/* 이벤트 바디 */}
                        <div
                          className={`transition-all duration-200 overflow-hidden ${
                            openEventKeys.has(eventKey) ? "max-h-96" : "max-h-0"
                          }`}
                        >
                          {openEventKeys.has(eventKey) && (
                            <div className="pt-2">
                              <div className="text-xs mb-1 text-gray-600">
                                {isGtmEvent(event) && (
                                  <>
                                    {/* <b>Event:</b> {event.event}
                                    {event["gtm.uniqueEventId"] && (
                                      <>
                                        {" "}
                                        <b>| ID:</b>{" "}
                                        {event["gtm.uniqueEventId"]}
                                      </>
                                    )} */}
                                    <p>aa</p>
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
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
export default EventList;
