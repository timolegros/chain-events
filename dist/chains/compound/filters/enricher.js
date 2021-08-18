"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Enrich = void 0;
const types_1 = require("../types");
function Enrich(api, blockNumber, kind, rawData) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (kind) {
            case types_1.EventKind.ProposalCanceled: {
                const { id } = rawData.args;
                return {
                    blockNumber,
                    excludeAddresses: [],
                    data: {
                        kind,
                        id: +id,
                    },
                };
            }
            case types_1.EventKind.ProposalCreated: {
                const { id, proposer, startBlock, endBlock, description, } = rawData.args;
                return {
                    blockNumber,
                    excludeAddresses: [proposer],
                    data: {
                        kind,
                        id: +id,
                        proposer,
                        startBlock: +startBlock,
                        endBlock: +endBlock,
                        description,
                    },
                };
            }
            case types_1.EventKind.ProposalExecuted: {
                const { id } = rawData.args;
                return {
                    blockNumber,
                    excludeAddresses: [],
                    data: {
                        kind,
                        id: +id,
                    },
                };
            }
            case types_1.EventKind.ProposalQueued: {
                const { id, eta } = rawData.args;
                return {
                    blockNumber,
                    excludeAddresses: [],
                    data: {
                        kind,
                        id: +id,
                        eta: +eta,
                    },
                };
            }
            case types_1.EventKind.VoteCast: {
                const { voter, proposalId, support, votes } = rawData.args;
                return {
                    blockNumber,
                    excludeAddresses: [voter],
                    data: {
                        kind,
                        voter,
                        id: +proposalId,
                        support,
                        votes: votes.toString(),
                    },
                };
            }
            default: {
                throw new Error('unknown compound event kind!');
            }
        }
        return { blockNumber: null, data: null };
    });
}
exports.Enrich = Enrich;
//# sourceMappingURL=enricher.js.map