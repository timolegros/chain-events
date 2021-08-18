import { CWEvent } from '../../../interfaces';
import { EventKind, RawEvent, IEventData, Api } from '../types';
/**
 * This is an "enricher" function, whose goal is to augment the initial event data
 * received from the "system.events" query with additional useful information, as
 * described in the event's interface in our "types.ts" file.
 *
 * Once fetched, the function marshalls the event data and the additional information
 * into the interface, and returns a fully-formed event, ready for database storage.
 */
export declare function Enrich(version: 1 | 2, api: Api, blockNumber: number, kind: EventKind, rawData: RawEvent): Promise<CWEvent<IEventData>>;
