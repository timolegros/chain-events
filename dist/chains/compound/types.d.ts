import { TypedEvent } from '../../contractTypes/commons';
import { GovernorAlpha } from '../../contractTypes';
declare type UnPromisify<T> = T extends Promise<infer U> ? U : T;
export declare type Proposal = UnPromisify<ReturnType<GovernorAlpha['functions']['proposals']>>;
export declare enum ProposalState {
    Pending = 0,
    Active = 1,
    Canceled = 2,
    Defeated = 3,
    Succeeded = 4,
    Queued = 5,
    Expired = 6,
    Executed = 7
}
export declare type Api = GovernorAlpha;
export declare const EventChains: readonly ["compound", "marlin-local", "marlin", "uniswap"];
export interface ListenerOptions {
    url: string;
    skipCatchup: boolean;
    contractAddress: string;
}
export declare type RawEvent = TypedEvent<any>;
export declare enum EntityKind {
    Proposal = "proposal"
}
export declare enum EventKind {
    ProposalExecuted = "proposal-executed",
    ProposalCreated = "proposal-created",
    ProposalCanceled = "proposal-canceled",
    ProposalQueued = "proposal-queued",
    VoteCast = "vote-cast"
}
interface IEvent {
    kind: EventKind;
}
declare type Address = string;
declare type Balance = string;
export interface IProposalCanceled extends IEvent {
    kind: EventKind.ProposalCanceled;
    id: number;
}
export interface IProposalCreated extends IEvent {
    kind: EventKind.ProposalCreated;
    id: number;
    proposer: Address;
    startBlock: number;
    endBlock: number;
    description: string;
}
export interface IProposalExecuted extends IEvent {
    kind: EventKind.ProposalExecuted;
    id: number;
}
export interface IProposalQueued extends IEvent {
    kind: EventKind.ProposalQueued;
    id: number;
    eta: number;
}
export interface IVoteCast extends IEvent {
    kind: EventKind.VoteCast;
    voter: Address;
    id: number;
    support: boolean;
    votes: Balance;
}
export declare type IEventData = IProposalCanceled | IProposalCreated | IProposalExecuted | IProposalQueued | IVoteCast;
export declare const EventKinds: EventKind[];
export {};
