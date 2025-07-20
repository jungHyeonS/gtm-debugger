export interface GtmEvent {
  event: string;
  "gtm.start"?: number;
  "gtm.uniqueEventId"?: number;
  "gtm.triggers"?: any[];
  [key: string]: any;
}
export interface GtagCommand {
  0: string;
  1?: any;
  2?: any;
  3?: any;
  [key: number]: any;
}
export type DataLayerEvent = GtmEvent | GtagCommand;
