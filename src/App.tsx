import { useEffect, useState } from 'react';
import type { GroupedEvents } from './types/event';
import EventList from './components/EventList';

export default function App() {
  // const [events, setEvents] = useState<DataLayerEvent[]>([]);

  const [grouped, setGrouped] = useState<GroupedEvents>({});

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const tab = tabs[0];
        chrome.runtime.sendMessage(
          {
            type: 'ALL_DATA_LAYER_EVENTS',
            tabId: tab.id,
            url: tab.url,
          },
          (res) => {
            if (res?.grouped) {
              setGrouped(res.grouped);
              // setEvents(res.events.flat ? res.events.flat() : res.events);
            }
          }
        );
      }
    });

    // const handler = (msg: any) => {
    //   if (msg.type === "DATA_LAYER_EVENT") {
    //     setEvents((prev) => [...prev, msg.payload]);
    //   }
    // };

    // chrome.runtime.onMessage.addListener(handler);
    // return () => chrome.runtime.onMessage.removeListener(handler);
  }, []);

  return (
    <div className='min-h-screen bg-gray-50 max-w-[500px] w-full p-4'>
      <div className='w-full mx-auto'>
        <div className='w-full flex flex-row items-center justify-between'>
          <h1 className='text-xl font-bold text-blue-600 mb-4 tracking-tight'>
            GTM Debugger
          </h1>

          {/* reset btn */}
          <button
            className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors'
            onClick={() => {
              chrome.runtime.sendMessage(
                {
                  type: 'RESET_DATA_LAYER_EVENTS',
                  tabId: chrome.tabs.TAB_ID_NONE, // 모든 탭에 대해 리셋
                  url: '*',
                },
                (res) => {
                  setGrouped({});
                  console.log('reset',res);
                }
              );
            }}
          >
            Reset
          </button>
        </div>

        <EventList grouped={grouped} />
      </div>
    </div>
  );
}
