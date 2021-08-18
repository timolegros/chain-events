import { Block, ISubstrateListenerOptions } from './types';
import { EnricherConfig, Processor, StorageFetcher, Subscriber } from './index';
import { ApiPromise } from '@polkadot/api';
import { EventSupportingChainT, IDisconnectedRange } from '../../interfaces';
import { Listener as BaseListener } from '../../Listener';
import { EventKind } from './types';
import { RegisteredTypes } from '@polkadot/types/types';
export declare class Listener extends BaseListener<ApiPromise, StorageFetcher, Processor, Subscriber, EventKind> {
    private readonly _options;
    private _poller;
    discoverReconnectRange: (chain: string) => Promise<IDisconnectedRange>;
    constructor(chain: EventSupportingChainT, url?: string, spec?: RegisteredTypes | {}, archival?: boolean, startBlock?: number, skipCatchup?: boolean, enricherConfig?: EnricherConfig, verbose?: boolean, ignoreChainType?: boolean, discoverReconnectRange?: (chain: string) => Promise<IDisconnectedRange>);
    init(): Promise<void>;
    subscribe(): Promise<void>;
    private processMissedBlocks;
    getBlocks(startBlock: number, endBlock?: number): Promise<Block[]>;
    updateSpec(spec: {}): Promise<void>;
    updateUrl(url: string): Promise<void>;
    protected processBlock(block: Block): Promise<void>;
    get options(): ISubstrateListenerOptions;
}
