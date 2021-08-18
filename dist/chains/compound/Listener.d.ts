import { ListenerOptions as CompoundListenerOptions, RawEvent, Api, EventKind } from './types';
import { EventSupportingChainT, IDisconnectedRange } from '../../interfaces';
import { Processor } from './processor';
import { StorageFetcher } from './storageFetcher';
import { Subscriber } from './subscriber';
import { Listener as BaseListener } from '../../Listener';
export declare class Listener extends BaseListener<Api, StorageFetcher, Processor, Subscriber, EventKind> {
    private readonly _options;
    constructor(chain: EventSupportingChainT, contractAddress: string, url?: string, skipCatchup?: boolean, verbose?: boolean, discoverReconnectRange?: (chain: string) => Promise<IDisconnectedRange>);
    init(): Promise<void>;
    subscribe(): Promise<void>;
    updateContractAddress(contractName: string, address: string): Promise<void>;
    protected processBlock(event: RawEvent): Promise<void>;
    private processMissedBlocks;
    get options(): CompoundListenerOptions;
}
