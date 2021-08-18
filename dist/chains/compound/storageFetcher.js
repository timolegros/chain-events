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
exports.StorageFetcher = void 0;
const interfaces_1 = require("../../interfaces");
const logging_1 = require("../../logging");
const enricher_1 = require("./filters/enricher");
const types_1 = require("./types");
const log = logging_1.factory.getLogger(logging_1.formatFilename(__filename));
class StorageFetcher extends interfaces_1.IStorageFetcher {
    constructor(_api) {
        super(_api);
        this._api = _api;
    }
    fetchOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            this._currentBlock = +(yield this._api.provider.getBlockNumber());
            log.info(`Current block: ${this._currentBlock}.`);
            if (!this._currentBlock) {
                log.error('Failed to fetch current block! Aborting fetch.');
                return [];
            }
            // TODO: can we make this more efficient?
            const allProposals = yield this.fetch();
            return allProposals.filter((v) => v.data.id === +id);
        });
    }
    /**
     * Fetches all CW events relating to ChainEntities from chain (or in this case contract),
     *   by quering available chain/contract storage and reconstructing events.
     *
     * NOTE: throws on error! Make sure to wrap in try/catch!
     *
     * @param range Determines the range of blocks to query events within.
     */
    fetch(range, fetchAllCompleted = false) {
        return __awaiter(this, void 0, void 0, function* () {
            this._currentBlock = yield this._api.provider.getBlockNumber();
            log.info(`Current block: ${this._currentBlock}.`);
            if (!this._currentBlock) {
                log.error('Failed to fetch current block! Aborting fetch.');
                return [];
            }
            // populate range fully if not given
            if (!range) {
                range = { startBlock: 0, endBlock: this._currentBlock };
            }
            else if (!range.startBlock) {
                range.startBlock = 0;
            }
            else if (range.startBlock >= this._currentBlock) {
                log.error(`Start block ${range.startBlock} greater than current block ${this._currentBlock}!`);
                return [];
            }
            if (range.endBlock && range.startBlock >= range.endBlock) {
                log.error(`Invalid fetch range: ${range.startBlock}-${range.endBlock}.`);
                return [];
            }
            if (!range.endBlock) {
                range.endBlock = this._currentBlock;
            }
            log.info(`Fetching Aave entities for range: ${range.startBlock}-${range.endBlock}.`);
            const proposalCreatedEvents = yield this._api.queryFilter(this._api.filters.ProposalCreated(null, null, null, null, null, null, null, null, null), range.startBlock, range.endBlock);
            // sort in descending order (newest first)
            proposalCreatedEvents.sort((a, b) => b.blockNumber - a.blockNumber);
            log.info(`Found ${proposalCreatedEvents.length} proposals!`);
            const voteCastEvents = yield this._api.queryFilter(this._api.filters.VoteCast(null, null, null, null), range.startBlock, range.endBlock);
            const proposalQueuedEvents = yield this._api.queryFilter(this._api.filters.ProposalQueued(null, null), range.startBlock, range.endBlock);
            const proposalCanceledEvents = yield this._api.queryFilter(this._api.filters.ProposalCanceled(null), range.startBlock, range.endBlock);
            const proposalExecutedEvents = yield this._api.queryFilter(this._api.filters.ProposalExecuted(null), range.startBlock, range.endBlock);
            const proposals = yield Promise.all(proposalCreatedEvents.map((p) => __awaiter(this, void 0, void 0, function* () {
                const createdEvent = (yield enricher_1.Enrich(this._api, p.blockNumber, types_1.EventKind.ProposalCreated, p));
                const voteRawEvents = voteCastEvents.filter((v) => +v.args.proposalId === createdEvent.data.id);
                const voteEvents = yield Promise.all(voteRawEvents.map((evt) => enricher_1.Enrich(this._api, evt.blockNumber, types_1.EventKind.VoteCast, evt)));
                const proposalEvents = [
                    createdEvent,
                    ...voteEvents,
                ];
                const cancelledRawEvent = proposalCanceledEvents.find((evt) => +evt.args.id === createdEvent.data.id);
                if (cancelledRawEvent) {
                    const cancelledEvent = (yield enricher_1.Enrich(this._api, cancelledRawEvent.blockNumber, types_1.EventKind.ProposalCanceled, cancelledRawEvent));
                    proposalEvents.push(cancelledEvent);
                }
                const queuedRawEvent = proposalQueuedEvents.find((evt) => +evt.args.id === createdEvent.data.id);
                if (queuedRawEvent) {
                    const queuedEvent = (yield enricher_1.Enrich(this._api, queuedRawEvent.blockNumber, types_1.EventKind.ProposalQueued, queuedRawEvent));
                    proposalEvents.push(queuedEvent);
                }
                const executedRawEvent = proposalExecutedEvents.find((evt) => +evt.args.id === createdEvent.data.id);
                if (executedRawEvent) {
                    const executedEvent = (yield enricher_1.Enrich(this._api, executedRawEvent.blockNumber, types_1.EventKind.ProposalExecuted, executedRawEvent));
                    proposalEvents.push(executedEvent);
                }
                return proposalEvents;
            })));
            if (range.maxResults) {
                return proposals.slice(0, range.maxResults).flat();
            }
            return proposals.flat();
        });
    }
}
exports.StorageFetcher = StorageFetcher;
//# sourceMappingURL=storageFetcher.js.map