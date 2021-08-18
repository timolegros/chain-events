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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Listener = void 0;
const interfaces_1 = require("../../interfaces");
const index_1 = require("../../index");
const types_1 = require("../moloch/types");
const moloch_1 = require("../moloch");
const ethereum_block_by_date_1 = __importDefault(require("ethereum-block-by-date"));
const Listener_1 = require("../../Listener");
const index_2 = require("../../index");
const logging_1 = require("../../logging");
const log = logging_1.factory.getLogger(logging_1.formatFilename(__filename));
class Listener extends Listener_1.Listener {
    constructor(chain, contractVersion, contractAddress, url, skipCatchup, verbose, discoverReconnectRange) {
        super(chain, verbose);
        if (!interfaces_1.chainSupportedBy(this._chain, types_1.EventChains))
            throw new Error(`${this._chain} is not a moloch network`);
        this._options = {
            url: url || index_1.networkUrls[chain],
            skipCatchup: !!skipCatchup,
            contractAddress: contractAddress || index_2.contracts[chain],
            contractVersion: contractVersion || 1,
        };
        this.discoverReconnectRange = discoverReconnectRange;
        this._subscribed = false;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this._api = yield moloch_1.createApi(this._options.url, this._options.contractVersion, this._options.contractAddress);
            }
            catch (error) {
                console.error('Fatal error occurred while starting the API');
                throw error;
            }
            try {
                this._processor = new moloch_1.Processor(this._api, this._options.contractVersion);
                this._subscriber = yield new moloch_1.Subscriber(this._api, this._chain, this._verbose);
            }
            catch (error) {
                console.error('Fatal error occurred while starting the Processor, and Subscriber');
                throw error;
            }
            try {
                const dater = new ethereum_block_by_date_1.default(this._api.provider);
                this.storageFetcher = new moloch_1.StorageFetcher(this._api, this._options.contractVersion, dater);
            }
            catch (error) {
                console.error('Fatal error occurred while starting the Ethereum dater and storage fetcher');
                throw error;
            }
        });
    }
    subscribe() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._subscriber) {
                console.log(`Subscriber for ${this._chain} isn't initialized. Please run init() first!`);
                return;
            }
            // processed blocks missed during downtime
            if (!this._options.skipCatchup)
                yield this.processMissedBlocks();
            else
                console.log('Skipping event catchup on startup!');
            try {
                console.info(`Subscribing Moloch contract: ${this._chain}, on url ${this._options.url}`);
                yield this._subscriber.subscribe(this.processBlock.bind(this));
                this._subscribed = true;
            }
            catch (error) {
                console.error(`Subscription error: ${error.message}`);
            }
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
            for (const cwEvent of cwEvents)
                yield this.handleEvent(cwEvent);
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
                // process events in sequence
                for (const event of cwEvents) {
                    yield this.handleEvent(event);
                }
            }
            catch (e) {
                console.error(`Unable to fetch events from storage: ${e.message}`);
            }
        });
    }
    updateContractVersion(version) {
        return __awaiter(this, void 0, void 0, function* () {
            if (version === this._options.contractVersion) {
                console.log(`The contract version is already set to ${version}`);
                return;
            }
            this._options.contractVersion = version;
            yield this.init();
            // only subscribe if the listener was already subscribed before the version change
            if (this._subscribed === true)
                yield this.subscribe();
        });
    }
    updateContractAddress(address) {
        return __awaiter(this, void 0, void 0, function* () {
            if (address === this._options.contractAddress) {
                console.log(`The contract address is already set to ${address}`);
                return;
            }
            this._options.contractAddress = address;
            yield this.init();
            if (this._subscribed === true)
                yield this.subscribe();
        });
    }
    get options() {
        return this._options;
    }
}
exports.Listener = Listener;
//# sourceMappingURL=Listener.js.map