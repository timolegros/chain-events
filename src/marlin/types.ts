import { Event } from 'ethers';
import { ISubscribeOptions } from '../interfaces';
import { Comp } from './contractTypes/Comp';
import { GovernorAlpha } from './contractTypes/GovernorAlpha';
import { Timelock } from './contractTypes/Timelock';

// Used to unwrap promises returned by contract functions
// TODO: What functions do I need to UnPromisify?
type UnPromisify<T> = T extends Promise<infer U> ? U : T;
// export type CompSOMETHING= UnPromisify<ReturnType<Comp['functions'][]>>

// API is imported contracts classes
export type Api = Comp | GovernorAlpha | Timelock;

export const EventChains = ['marlin', 'marlin-local'] as const;

export type RawEvent = Event;

// TODO: is necessary?
// export enum EntityKind {
//   Proposal = 'proposal',
// }

export enum EventKind {
  // Comp Events
  Approval = 'approval',
  DelegateChanged = 'delegate-changed',
  DelegateVotesChanged = 'delegate-votes-changed',
  Transfer = 'transfer',
  // TODO: GovernorAlpha Events
  ProposalExecuted = 'proposal-executed',
  ProposalCreated = 'proposal-created',
  ProposalCanceled = 'proposal-canceled',
  ProposalQueued = 'proposal-queued',
  VoteCast = 'vote-cast',
  // TODO: Timelock Events
  CancelTransaction = 'cancel-transaction',
  ExecuteTransaction = 'execute-transactions',
}

interface IEvent {
  kind: EventKind;
}

type Address = string;
type Balance = string;

// Comp Event Interfaces
export interface IApproval extends IEvent {
  kind: EventKind.Approval,
  owner: Address,
  spender: Address,
  amount: Balance,
}

export interface IDelegateChanged extends IEvent {
  kind: EventKind.DelegateChanged,
  delegator: Address,
  fromDelegate: Address,
  toDelegate: Address,
}

export interface IDelegateVotesChanged extends IEvent {
  kind: EventKind.DelegateVotesChanged,
  delegate: Address,
  previousBalance: Balance,
  newBalance: Balance,
}

export interface ITransfer extends IEvent {
  kind: EventKind.Transfer,
  from: Address,
  to: Address,
  amount: Balance,
}

// TODO: GovernorAlpha Event Interfaces
export interface IProposalCanceled extends IEvent {
  kind: EventKind.ProposalCanceled,
  id: number,
}

export interface IProposalCreated extends IEvent {
  kind: EventKind.ProposalCreated,
  id: number,
  proposer: Address | null,
  targets: Address[], // in function, encoding string[]
  values: number[], // BigNumberish[]
  signatures: Address[], // string[]
  calldatas: string[], // Arrayish[], TODO: decide on type
  startBlock: number,
  endBlock: number,
  description: string,
}

export interface IProposalExecuted extends IEvent {
  kind: EventKind.ProposalExecuted,
  id: number,
}

export interface IProposalQueued extends IEvent {
  kind: EventKind.ProposalQueued,
  id: number,
  eta: number,
}

export interface IVoteCast extends IEvent {
  kind: EventKind.VoteCast,
  voter: Address,
  proposalId: number,
  support: boolean, 
  votes: Balance, // TODO: or just number?
}


// TODO: Timelock Event Interfaces
export interface ICancelTransaction extends IEvent {
  kind: EventKind.CancelTransaction,
  txHash: [], // Arrayish, TODO: decide type
  target: Address,
  value: Balance,// TODO: or just number?
  signature: string,
  data: [], // Arrayish, TODO: decide type
  eta: number,
}

export interface IExecuteTransaction extends IEvent {
  kind: EventKind.ExecuteTransaction,
  txHash: [], // Arrayish, TODO: decide type
  target: Address,
  value: Balance,// TODO: or just number?
  signature: string,
  data: [], // Arrayish, TODO: decide type
  eta: number,
}

export type IEventData =
  // Comp
  IApproval
  | IDelegateChanged
  | IDelegateVotesChanged
  | ITransfer
  // GovernorAlpha
  | IProposalCanceled
  | IProposalCreated
  | IProposalExecuted
  | IProposalQueued
  | IVoteCast
  // Timelock
  | ICancelTransaction
  | IExecuteTransaction
  // eslint-disable-next-line semi-style
;

export const EventKinds: EventKind[] = Object.values(EventKind);