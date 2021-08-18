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
exports.Listener = void 0;
const types_1 = require("./types");
const subscribeFunc_1 = require("./subscribeFunc");
const interfaces_1 = require("../../interfaces");
const index_1 = require("../../index");
const processor_1 = require("./processor");
const storageFetcher_1 = require("./storageFetcher");
const subscriber_1 = require("./subscriber");
const Listener_1 = require("../../Listener");
const logging_1 = require("../../logging");
const log = logging_1.factory.getLogger(logging_1.formatFilename(__filename));
class Listener extends Listener_1.Listener {
    constructor(chain, contractAddress, url, skipCatchup, verbose, discoverReconnectRange) {
        super(chain, verbose);
        if (!interfaces_1.chainSupportedBy(this._chain, types_1.EventChains))
            throw new Error(`${this._chain} is not a Compound contract`);
        this._options = {
            url: url || index_1.networkUrls[chain],
            skipCatchup: !!skipCatchup,
            contractAddress,
        };
        this._subscribed = false;
        this.discoverReconnectRange = discoverReconnectRange;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this._api = yield subscribeFunc_1.createApi(this._options.url, this._options.contractAddress);
            }
            catch (error) {
                log.error('Fatal error occurred while starting the API');
                throw error;
            }
            try {
                this._processor = new processor_1.Processor(this._api);
                this._subscriber = yield new subscriber_1.Subscriber(this._api, this._chain, this._verbose);
            }
            catch (error) {
                log.error('Fatal error occurred while starting the Processor, and Subscriber');
                throw error;
            }
            try {
                this.storageFetcher = new storageFetcher_1.StorageFetcher(this._api);
            }
            catch (error) {
                log.error('Fatal error occurred while starting the Ethereum dater and storage fetcher');
                throw error;
            }
        });
    }
    subscribe() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._subscriber) {
                log.info(`Subscriber for ${this._chain} isn't initialized. Please run init() first!`);
                return;
            }
            // processed blocks missed during downtime
            if (!this._options.skipCatchup)
                yield this.processMissedBlocks();
            else
                log.info('Skipping event catchup on startup!');
            try {
                log.info(`Subscribing to Compound contract: ${this._chain}, on url ${this._options.url}`);
                yield this._subscriber.subscribe(this.processBlock.bind(this));
                this._subscribed = true;
            }
            catch (error) {
                log.error(`Subscription error: ${error.message}`);
            }
        });
    }
    updateContractAddress(contractName, address) {
        return __awaiter(this, void 0, void 0, function* () {
            if (contractName != ('comp' || 'governorAlpha' || 'timelock')) {
                log.info('Contract is not supported');
                return;
            }
            this._options.contractAddress = address;
            yield this.init();
            if (this._subscribed === true)
                yield this.subscribe();
        });
    }
    processBlock(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const blockNumber = event.blockNumber;
            if (!this._lastBlockNumber || blockNumber > this._lastBlockNumber) {
                this._lastBlockNumber = blockNumber;
            }
            const cwEvents = yield this._processor.process(event);
            // process events in sequence
            for (const event of cwEvents)
                yield this.handleEvent(event);
        });
    }
    processMissedBlocks() {
        return __awaiter(this, void 0, void 0, function* () {
            log.info(`[${this._chain}]: Detected offline time, polling missed blocks...`);
            if (!this.discoverReconnectRange) {
                log.info(`[${this._chain}]: Unable to determine offline range - No discoverReconnectRange function given`);
                return;
            }
            let offlineRange;
            try {
                // fetch the block of the last server event from database
                offlineRange = yield this.discoverReconnectRange(this._chain);
                if (!offlineRange) {
                    log.warn(`[${this._chain}]: No offline range found, skipping event catchup.`);
                    return;
                }
            }
            catch (error) {
                log.error(`[${this._chain}]: Could not discover offline range: ${error.message}. Skipping event catchup.`);
                return;
            }
            // compare with default range algorithm: take last cached block in processor
            // if it exists, and is more recent than the provided algorithm
            // (note that on first run, we wont have a cached block/this wont do anything)
            if (this._lastBlockNumber &&
                (!offlineRange ||
                    !offlineRange.startBlock ||
                    offlineRange.startBlock < this._lastBlockNumber)) {
                offlineRange = { startBlock: this._lastBlockNumber };
            }
            // if we can't figure out when the last block we saw was,
            // do nothing
            // (i.e. don't try and fetch all events from block 0 onward)
            if (!offlineRange || !offlineRange.startBlock) {
                log.warn(`[${this._chain}]: Unable to determine offline time range.`);
                return;
            }
            try {
                const cwEvents = yield this.storageFetcher.fetch(offlineRange);
                for (const event of cwEvents) {
                    yield this.handleEvent(event);
                }
            }
            catch (error) {
                log.error(`Unable to fetch events from storage: ${error.message}`);
            }
        });
    }
    get options() {
        return this._options;
    }
}
exports.Listener = Listener;
//# sourceMappingURL=Listener.js.map