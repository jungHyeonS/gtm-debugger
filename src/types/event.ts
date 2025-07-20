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

// 페이지별 그룹핑: pageKey(string) → DataLayerEvent[][] (이중배열)
export type GroupedEvents = { [pageKey: string]: DataLayerEvent[][] };
