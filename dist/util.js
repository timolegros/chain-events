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
exports.createListener = void 0;
const interfaces_1 = require("./interfaces");
const types_1 = require("./chains/substrate/types");
const substrate_1 = require("./chains/substrate");
const types_2 = require("./chains/moloch/types");
const Listener_1 = require("./chains/moloch/Listener");
const types_3 = require("./chains/compound/types");
const Listener_2 = require("./chains/compound/Listener");
const types_4 = require("./chains/erc20/types");
const erc20_1 = require("./chains/erc20");
const types_5 = require("./chains/aave/types");
const aave_1 = require("./chains/aave");
const index_1 = require("./index");
const logging_1 = require("./logging");
const log = logging_1.factory.getLogger(logging_1.formatFilename(__filename));
/**
 * Creates a listener instance and returns it if no error occurs. This function throws on error.
 * @param chain The chain to create a listener for
 * @param options The listener options for the specified chain
 * @param customChainBase Used to override the base system the chain is from if it does not yet exist in EventChains
 */
function createListener(chain, options, customChainBase) {
    return __awaiter(this, void 0, void 0, function* () {
        let listener;
        // checks chain compatibility or overrides
        function basePicker(chain, base) {
            if (customChainBase == base)
                return true;
            else {
                switch (base) {
                    case 'substrate':
                        return interfaces_1.chainSupportedBy(chain, types_1.EventChains);
                    case 'moloch':
                        return interfaces_1.chainSupportedBy(chain, types_2.EventChains);
                    case 'compound':
                        return interfaces_1.chainSupportedBy(chain, types_3.EventChains);
                    case 'erc20':
                        return interfaces_1.chainSupportedBy(chain, types_4.EventChains);
                    case 'aave':
                        return interfaces_1.chainSupportedBy(chain, types_5.EventChains);
                }
            }
        }
        if (basePicker(chain, 'substrate')) {
            // start a substrate listener
            listener = new substrate_1.Listener(chain, options.url || index_1.networkUrls[chain], options.spec, !!options.archival, options.startBlock || 0, !!options.skipCatchup, options.enricherConfig, !!options.verbose, !!customChainBase, options.discoverReconnectRange);
        }
        else if (basePicker(chain, 'moloch')) {
            listener = new Listener_1.Listener(chain, options.MolochContractVersion ? options.MolochContractVersion : 2, options.address, options.url || index_1.networkUrls[chain], !!options.skipCatchup, !!options.verbose, options.discoverReconnectRange);
        }
        else if (basePicker(chain, 'compound')) {
            listener = new Listener_2.Listener(chain, options.address, options.url || index_1.networkUrls[chain], !!options.skipCatchup, !!options.verbose, options.discoverReconnectRange);
        }
        else if (basePicker(chain, 'erc20')) {
            listener = new erc20_1.Listener(chain, options.tokenAddresses || [options.address], options.url || 'wss://mainnet.infura.io/ws/v3/', Array.isArray(options.tokenNames) ? options.tokenNames : undefined, !!options.verbose, !!customChainBase);
        }
        else if (basePicker(chain, 'aave')) {
            listener = new aave_1.Listener(chain, options.address, options.url, !!options.skipCatchup, !!options.verbose, !!customChainBase, options.discoverReconnectRange);
        }
        else {
            throw new Error(customChainBase
                ? `No listener built for ${customChainBase}`
                : "The given chain's base does not match any built in listener");
        }
        try {
            if (!listener)
                throw new Error('Listener is still null');
            yield listener.init();
        }
        catch (error) {
            log.error(`[${chain}]: Failed to initialize the listener`);
            throw error;
        }
        return listener;
    });
}
exports.createListener = createListener;
//# sourceMappingURL=util.js.map