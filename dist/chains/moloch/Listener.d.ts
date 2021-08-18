import { EventSupportingChainT, IDisconnectedRange } from '../../interfaces';
import { EventKind, Api, RawEvent, ListenerOptions as MolochListenerOptions } from '../moloch/types';
import { Processor, StorageFetcher, Subscriber } from '../moloch';
import { Listener as BaseListener } from '../../Listener';
export declare class Listener extends BaseListener<Api, StorageFetcher, Processor, Subscriber, EventKind> {
    private readonly _options;
    constructor(chain: EventSupportingChainT, contractVersion?: 1 | 2, contractAddress?: string, url?: string, skipCatchup?: boolean, verbose?: boolean, discoverReconnectRange?: (chain: string) => Promise<IDisconnectedRange>);
    init(): Promise<void>;
    subscribe(): Promise<void>;
    protected processBlock(event: RawEvent): Promise<void>;
    private processMissedBlocks;
    updateContractVersion(version: 1 | 2): Promise<void>;
    updateContractAddress(address: string): Promise<void>;
    get options(): MolochListenerOptions;
}
