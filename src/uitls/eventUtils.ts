import type { DataLayerEvent, GtmEvent, GtagCommand } from "../types/event";

export function isGtmEvent(obj: any): obj is GtmEvent {
  return (
    !!obj && typeof obj === "object" && !Array.isArray(obj) && "event" in obj
  );
}
export function isGtagCommand(obj: any): obj is GtagCommand {
  return (
    !!obj &&
    typeof obj === "object" &&
    !Array.isArray(obj) &&
    "0" in obj &&
    typeof obj[0] === "string"
  );
}
export function eventLabel(event: DataLayerEvent) {
  if (isGtmEvent(event)) return event.event;
  if (isGtagCommand(event)) return `[gtag] ${event[0]}`;
  return "[Unknown]";
}
