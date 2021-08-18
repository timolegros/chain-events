import { Listener as BaseListener } from '../../Listener';
import { ListenerOptions as AaveListenerOptions, EventKind, RawEvent, Api } from './types';
import { EventSupportingChainT, IDisconnectedRange } from '../../interfaces';
import { Subscriber } from './subscriber';
import { Processor } from './processor';
import { StorageFetcher } from './storageFetcher';
export declare class Listener extends BaseListener<Api, StorageFetcher, Processor, Subscriber, EventKind> {
    discoverReconnectRange: (chain: string) => Promise<IDisconnectedRange>;
    private readonly _options;
    constructor(chain: EventSupportingChainT, govContractAddress: string, url?: string, skipCatchup?: boolean, verbose?: boolean, ignoreChainType?: boolean, discoverReconnectRange?: (chain: string) => Promise<IDisconnectedRange>);
    init(): Promise<void>;
    subscribe(): Promise<void>;
    updateAddress(): Promise<void>;
    private processMissedBlocks;
    protected processBlock(event: RawEvent): Promise<void>;
    get options(): AaveListenerOptions;
}
