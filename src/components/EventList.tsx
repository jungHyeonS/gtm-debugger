import type { GroupedEvents } from '../types/event';
import EventListItem from './EvnetListItem';

interface EventListProps {
  grouped: GroupedEvents;
}

function EventList({ grouped }: EventListProps) {
  if (Object.keys(grouped).length === 0) {
    return (
      <div className='text-gray-400 text-center mt-12'>
        No dataLayer events yet.
      </div>
    );
  }

  return (
    <div className='w-full flex flex-col gap-6'>
      {Object.entries(grouped).map(([pageKey, eventList]) => (
        <EventListItem key={pageKey} pageKey={pageKey} eventList={eventList} />
      ))}
    </div>
  );
}
export default EventList;
