import { IDisconnectedRange, IEventProcessor, IEventSubscriber, IStorageFetcher } from './interfaces';
import { EnricherConfig } from './chains/substrate';
import { Listener } from './Listener';
/**
 * Creates a listener instance and returns it if no error occurs. This function throws on error.
 * @param chain The chain to create a listener for
 * @param options The listener options for the specified chain
 * @param customChainBase Used to override the base system the chain is from if it does not yet exist in EventChains
 */
export declare function createListener(chain: string, options: {
    address?: string;
    tokenAddresses?: string[];
    tokenNames?: string[];
    MolochContractVersion?: 1 | 2;
    verbose?: boolean;
    skipCatchup?: boolean;
    startBlock?: number;
    archival?: boolean;
    spec?: {};
    url?: string;
    enricherConfig?: EnricherConfig;
    discoverReconnectRange?: (chain: string) => Promise<IDisconnectedRange>;
}, customChainBase?: string): Promise<Listener<any, IStorageFetcher<any>, IEventProcessor<any, any>, IEventSubscriber<any, any>, any>>;
