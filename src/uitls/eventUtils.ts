import type { DataLayerEvent, GtagCommand, GtmEvent } from "../types/event";

export function isGtmEvent(obj: DataLayerEvent): obj is GtmEvent {
  return (
    !!obj &&
    typeof obj === "object" &&
    "event" in obj &&
    typeof obj.event === "string"
  );
}
export function isGtagCommand(obj: DataLayerEvent): obj is GtagCommand {
  return (
    !!obj && typeof obj === "object" && "0" in obj && typeof obj[0] === "string"
  );
}
export function eventLabel(event: DataLayerEvent) {
  console.log("eventLabel", event);
  if (isGtmEvent(event)) return event.event;
  if (isGtagCommand(event)) return `[gtag] ${event[0]}`;
  return "[Unknown]";
}
