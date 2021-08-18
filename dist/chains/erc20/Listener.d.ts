import { ListenerOptions as Erc20ListenerOptions, RawEvent, Api, EventKind } from './types';
import { CWEvent, EventSupportingChainT } from '../../interfaces';
import { Processor } from './processor';
import { Subscriber } from './subscriber';
import { Listener as BaseListener } from '../../Listener';
export declare class Listener extends BaseListener<Api, any, Processor, Subscriber, EventKind> {
    private readonly _options;
    constructor(chain: EventSupportingChainT, tokenAddresses: string[], url?: string, tokenNames?: string[], verbose?: boolean, ignoreChainType?: boolean);
    init(): Promise<void>;
    subscribe(): Promise<void>;
    updateTokenList(tokenAddresses: string[]): Promise<void>;
    protected handleEvent(event: CWEvent): Promise<void>;
    protected processBlock(event: RawEvent, tokenName?: string): Promise<void>;
    get options(): Erc20ListenerOptions;
}
