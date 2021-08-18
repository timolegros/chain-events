"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventKinds = exports.EventKind = exports.EntityKind = exports.EventChains = exports.ProposalState = void 0;
// eslint-disable-next-line no-shadow
var ProposalState;
(function (ProposalState) {
    ProposalState[ProposalState["Pending"] = 0] = "Pending";
    ProposalState[ProposalState["Active"] = 1] = "Active";
    ProposalState[ProposalState["Canceled"] = 2] = "Canceled";
    ProposalState[ProposalState["Defeated"] = 3] = "Defeated";
    ProposalState[ProposalState["Succeeded"] = 4] = "Succeeded";
    ProposalState[ProposalState["Queued"] = 5] = "Queued";
    ProposalState[ProposalState["Expired"] = 6] = "Expired";
    ProposalState[ProposalState["Executed"] = 7] = "Executed";
})(ProposalState = exports.ProposalState || (exports.ProposalState = {}));
// TODO: clarify how this section works
exports.EventChains = [
    'compound',
    'marlin-local',
    'marlin',
    'uniswap',
];
// eslint-disable-next-line no-shadow
var EntityKind;
(function (EntityKind) {
    // eslint-disable-next-line no-shadow
    EntityKind["Proposal"] = "proposal";
})(EntityKind = exports.EntityKind || (exports.EntityKind = {}));
// eslint-disable-next-line no-shadow
var EventKind;
(function (EventKind) {
    EventKind["ProposalExecuted"] = "proposal-executed";
    EventKind["ProposalCreated"] = "proposal-created";
    EventKind["ProposalCanceled"] = "proposal-canceled";
    EventKind["ProposalQueued"] = "proposal-queued";
    EventKind["VoteCast"] = "vote-cast";
})(EventKind = exports.EventKind || (exports.EventKind = {}));
exports.EventKinds = Object.values(EventKind);
//# sourceMappingURL=types.js.map