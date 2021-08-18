"use strict";
/**
 * Defines general interfaces for chain event fetching and processing.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEntityCompleted = exports.eventToEntity = exports.entityToFieldName = exports.IEventPoller = exports.IStorageFetcher = exports.IEventSubscriber = exports.IEventProcessor = exports.IEventHandler = exports.EntityEventKind = exports.isSupportedChain = exports.chainSupportedBy = exports.EventSupportingChains = exports.ChainEventKinds = void 0;
const SubstrateTypes = __importStar(require("./chains/substrate/types"));
const MolochTypes = __importStar(require("./chains/moloch/types"));
const CompoundTypes = __importStar(require("./chains/compound/types"));
const Erc20Types = __importStar(require("./chains/erc20/types"));
const AaveTypes = __importStar(require("./chains/aave/types"));
exports.ChainEventKinds = [
    ...SubstrateTypes.EventKinds,
    ...MolochTypes.EventKinds,
    ...CompoundTypes.EventKinds,
    ...AaveTypes.EventKinds,
    ...Erc20Types.EventKinds,
];
exports.EventSupportingChains = [
    ...SubstrateTypes.EventChains,
    ...MolochTypes.EventChains,
    ...CompoundTypes.EventChains,
    ...AaveTypes.EventChains,
    ...Erc20Types.EventChains,
];
function chainSupportedBy(c, eventChains) {
    return eventChains.some((s) => s === c);
}
exports.chainSupportedBy = chainSupportedBy;
function isSupportedChain(chain) {
    return chainSupportedBy(chain, exports.EventSupportingChains);
}
exports.isSupportedChain = isSupportedChain;
// eslint-disable-next-line no-shadow
var EntityEventKind;
(function (EntityEventKind) {
    EntityEventKind[EntityEventKind["Create"] = 0] = "Create";
    EntityEventKind[EntityEventKind["Update"] = 1] = "Update";
    EntityEventKind[EntityEventKind["Vote"] = 2] = "Vote";
    EntityEventKind[EntityEventKind["Complete"] = 3] = "Complete";
})(EntityEventKind = exports.EntityEventKind || (exports.EntityEventKind = {}));
// handles individual events by sending them off to storage/notifying
class IEventHandler {
}
exports.IEventHandler = IEventHandler;
// parses events out of blocks into a standard format and
// passes them through to the handler
class IEventProcessor {
    constructor(_api) {
        this._api = _api;
    }
}
exports.IEventProcessor = IEventProcessor;
// fetches blocks from chain in real-time via subscription for processing
class IEventSubscriber {
    constructor(_api, _verbose = false) {
        this._api = _api;
        this._verbose = _verbose;
    }
    get api() {
        return this._api;
    }
}
exports.IEventSubscriber = IEventSubscriber;
// synthesizes events from chain storage
class IStorageFetcher {
    constructor(_api) {
        this._api = _api;
    }
}
exports.IStorageFetcher = IStorageFetcher;
// fetches historical blocks from chain for processing
class IEventPoller {
    constructor(_api) {
        this._api = _api;
    }
}
exports.IEventPoller = IEventPoller;
function entityToFieldName(chain, entity) {
    if (MolochTypes.EventChains.find((c) => c === chain)) {
        return 'proposalIndex';
    }
    if (CompoundTypes.EventChains.find((c) => c === chain)) {
        return 'id';
    }
    if (AaveTypes.EventChains.find((c) => c === chain)) {
        return 'id';
    }
    switch (entity) {
        case SubstrateTypes.EntityKind.DemocracyProposal: {
            return 'proposalIndex';
        }
        case SubstrateTypes.EntityKind.DemocracyReferendum: {
            return 'referendumIndex';
        }
        case SubstrateTypes.EntityKind.DemocracyPreimage: {
            return 'proposalHash';
        }
        case SubstrateTypes.EntityKind.TreasuryProposal: {
            return 'proposalIndex';
        }
        case SubstrateTypes.EntityKind.TreasuryBounty: {
            return 'bountyIndex';
        }
        case SubstrateTypes.EntityKind.CollectiveProposal: {
            return 'proposalHash';
        }
        case SubstrateTypes.EntityKind.SignalingProposal: {
            return 'proposalHash';
        }
        case SubstrateTypes.EntityKind.TipProposal: {
            return 'proposalHash';
        }
        case MolochTypes.EntityKind.Proposal: {
            return 'proposalIndex';
        }
        case CompoundTypes.EntityKind.Proposal: {
            return 'id';
        }
        default: {
            return null;
        }
    }
}
exports.entityToFieldName = entityToFieldName;
function eventToEntity(chain, event) {
    if (MolochTypes.EventChains.find((c) => c === chain)) {
        switch (event) {
            case MolochTypes.EventKind.SubmitProposal: {
                return [MolochTypes.EntityKind.Proposal, EntityEventKind.Create];
            }
            case MolochTypes.EventKind.SubmitVote: {
                return [MolochTypes.EntityKind.Proposal, EntityEventKind.Vote];
            }
            case MolochTypes.EventKind.ProcessProposal: {
                return [MolochTypes.EntityKind.Proposal, EntityEventKind.Complete];
            }
            case MolochTypes.EventKind.Abort: {
                return [MolochTypes.EntityKind.Proposal, EntityEventKind.Complete];
            }
            default: {
                return null;
            }
        }
    }
    if (CompoundTypes.EventChains.find((c) => c === chain)) {
        switch (event) {
            case CompoundTypes.EventKind.ProposalCanceled: {
                return [CompoundTypes.EntityKind.Proposal, EntityEventKind.Complete];
            }
            case CompoundTypes.EventKind.ProposalCreated: {
                return [CompoundTypes.EntityKind.Proposal, EntityEventKind.Create];
            }
            case CompoundTypes.EventKind.ProposalExecuted: {
                return [CompoundTypes.EntityKind.Proposal, EntityEventKind.Complete];
            }
            case CompoundTypes.EventKind.ProposalQueued: {
                return [CompoundTypes.EntityKind.Proposal, EntityEventKind.Update];
            }
            case CompoundTypes.EventKind.VoteCast: {
                return [CompoundTypes.EntityKind.Proposal, EntityEventKind.Vote];
            }
            default: {
                return null;
            }
        }
    }
    if (AaveTypes.EventChains.find((c) => c === chain)) {
        switch (event) {
            case AaveTypes.EventKind.ProposalCreated: {
                return [AaveTypes.EntityKind.Proposal, EntityEventKind.Create];
            }
            case AaveTypes.EventKind.VoteEmitted: {
                return [AaveTypes.EntityKind.Proposal, EntityEventKind.Vote];
            }
            case AaveTypes.EventKind.ProposalQueued: {
                return [AaveTypes.EntityKind.Proposal, EntityEventKind.Update];
            }
            case AaveTypes.EventKind.ProposalExecuted:
            case AaveTypes.EventKind.ProposalCanceled: {
                return [AaveTypes.EntityKind.Proposal, EntityEventKind.Complete];
            }
            default: {
                return null;
            }
        }
    }
    switch (event) {
        // Democracy Events
        case SubstrateTypes.EventKind.DemocracyProposed: {
            return [
                SubstrateTypes.EntityKind.DemocracyProposal,
                EntityEventKind.Create,
            ];
        }
        case SubstrateTypes.EventKind.DemocracyTabled: {
            return [
                SubstrateTypes.EntityKind.DemocracyProposal,
                EntityEventKind.Complete,
            ];
        }
        case SubstrateTypes.EventKind.DemocracyStarted: {
            return [
                SubstrateTypes.EntityKind.DemocracyReferendum,
                EntityEventKind.Create,
            ];
        }
        case SubstrateTypes.EventKind.DemocracyVoted: {
            return [
                SubstrateTypes.EntityKind.DemocracyReferendum,
                EntityEventKind.Vote,
            ];
        }
        case SubstrateTypes.EventKind.DemocracyPassed: {
            return [
                SubstrateTypes.EntityKind.DemocracyReferendum,
                EntityEventKind.Update,
            ];
        }
        case SubstrateTypes.EventKind.DemocracyNotPassed:
        case SubstrateTypes.EventKind.DemocracyCancelled:
        case SubstrateTypes.EventKind.DemocracyExecuted: {
            return [
                SubstrateTypes.EntityKind.DemocracyReferendum,
                EntityEventKind.Complete,
            ];
        }
        // Preimage Events
        case SubstrateTypes.EventKind.PreimageNoted: {
            return [
                SubstrateTypes.EntityKind.DemocracyPreimage,
                EntityEventKind.Create,
            ];
        }
        case SubstrateTypes.EventKind.PreimageUsed:
        case SubstrateTypes.EventKind.PreimageInvalid:
        case SubstrateTypes.EventKind.PreimageReaped: {
            return [
                SubstrateTypes.EntityKind.DemocracyPreimage,
                EntityEventKind.Complete,
            ];
        }
        // Tip Events
        case SubstrateTypes.EventKind.NewTip: {
            return [SubstrateTypes.EntityKind.TipProposal, EntityEventKind.Create];
        }
        case SubstrateTypes.EventKind.TipVoted:
        case SubstrateTypes.EventKind.TipClosing: {
            return [SubstrateTypes.EntityKind.TipProposal, EntityEventKind.Update];
        }
        case SubstrateTypes.EventKind.TipClosed:
        case SubstrateTypes.EventKind.TipRetracted:
        case SubstrateTypes.EventKind.TipSlashed: {
            return [SubstrateTypes.EntityKind.TipProposal, EntityEventKind.Complete];
        }
        // Treasury Events
        case SubstrateTypes.EventKind.TreasuryProposed: {
            return [
                SubstrateTypes.EntityKind.TreasuryProposal,
                EntityEventKind.Create,
            ];
        }
        case SubstrateTypes.EventKind.TreasuryRejected:
        case SubstrateTypes.EventKind.TreasuryAwarded: {
            return [
                SubstrateTypes.EntityKind.TreasuryProposal,
                EntityEventKind.Complete,
            ];
        }
        // Bounty Events
        case SubstrateTypes.EventKind.TreasuryBountyProposed: {
            return [SubstrateTypes.EntityKind.TreasuryBounty, EntityEventKind.Create];
        }
        case SubstrateTypes.EventKind.TreasuryBountyAwarded: {
            return [SubstrateTypes.EntityKind.TreasuryBounty, EntityEventKind.Update];
        }
        case SubstrateTypes.EventKind.TreasuryBountyBecameActive: {
            return [SubstrateTypes.EntityKind.TreasuryBounty, EntityEventKind.Update];
        }
        case SubstrateTypes.EventKind.TreasuryBountyCanceled: {
            return [
                SubstrateTypes.EntityKind.TreasuryBounty,
                EntityEventKind.Complete,
            ];
        }
        case SubstrateTypes.EventKind.TreasuryBountyClaimed: {
            return [
                SubstrateTypes.EntityKind.TreasuryBounty,
                EntityEventKind.Complete,
            ];
        }
        case SubstrateTypes.EventKind.TreasuryBountyExtended: {
            return [SubstrateTypes.EntityKind.TreasuryBounty, EntityEventKind.Update];
        }
        case SubstrateTypes.EventKind.TreasuryBountyRejected: {
            return [
                SubstrateTypes.EntityKind.TreasuryBounty,
                EntityEventKind.Complete,
            ];
        }
        // Collective Events
        case SubstrateTypes.EventKind.CollectiveProposed: {
            return [
                SubstrateTypes.EntityKind.CollectiveProposal,
                EntityEventKind.Create,
            ];
        }
        case SubstrateTypes.EventKind.CollectiveVoted: {
            return [
                SubstrateTypes.EntityKind.CollectiveProposal,
                EntityEventKind.Vote,
            ];
        }
        case SubstrateTypes.EventKind.CollectiveApproved: {
            return [
                SubstrateTypes.EntityKind.CollectiveProposal,
                EntityEventKind.Update,
            ];
        }
        case SubstrateTypes.EventKind.CollectiveDisapproved:
        case SubstrateTypes.EventKind.CollectiveExecuted: {
            return [
                SubstrateTypes.EntityKind.CollectiveProposal,
                EntityEventKind.Complete,
            ];
        }
        // Signaling Events
        case SubstrateTypes.EventKind.SignalingNewProposal: {
            return [
                SubstrateTypes.EntityKind.SignalingProposal,
                EntityEventKind.Create,
            ];
        }
        case SubstrateTypes.EventKind.SignalingCommitStarted:
        case SubstrateTypes.EventKind.SignalingVotingStarted: {
            return [
                SubstrateTypes.EntityKind.SignalingProposal,
                EntityEventKind.Update,
            ];
        }
        case SubstrateTypes.EventKind.SignalingVotingCompleted: {
            return [
                SubstrateTypes.EntityKind.SignalingProposal,
                EntityEventKind.Complete,
            ];
        }
        default: {
            return null;
        }
    }
}
exports.eventToEntity = eventToEntity;
function isEntityCompleted(chain, entityEvents) {
    return entityEvents.some(({ data: { kind } }) => {
        const entityData = eventToEntity(chain, kind);
        return entityData && entityData[1] === EntityEventKind.Complete;
    });
}
exports.isEntityCompleted = isEntityCompleted;
//# sourceMappingURL=interfaces.js.map