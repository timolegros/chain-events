"use strict";
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Erc20TokenUrls = exports.contracts = exports.networkSpecs = exports.networkUrls = exports.Listener = exports.AaveTypes = exports.AaveEvents = exports.Erc20Types = exports.Erc20Events = exports.SubstrateTypes = exports.SubstrateEvents = exports.CompoundTypes = exports.CompoundEvents = exports.MolochTypes = exports.MolochEvents = void 0;
const clover_1 = require("./specs/clover");
const kulupu_1 = require("./specs/kulupu");
const hydraDX_1 = require("./specs/hydraDX");
const stafi_1 = require("./specs/stafi");
const node_types_1 = require("@edgeware/node-types");
__exportStar(require("./interfaces"), exports);
exports.MolochEvents = __importStar(require("./chains/moloch/index"));
exports.MolochTypes = __importStar(require("./chains/moloch/types"));
exports.CompoundEvents = __importStar(require("./chains/compound/index"));
exports.CompoundTypes = __importStar(require("./chains/compound/types"));
exports.SubstrateEvents = __importStar(require("./chains/substrate/index"));
exports.SubstrateTypes = __importStar(require("./chains/substrate/types"));
exports.Erc20Events = __importStar(require("./chains/erc20/index"));
exports.Erc20Types = __importStar(require("./chains/erc20/types"));
exports.AaveEvents = __importStar(require("./chains/aave/index"));
exports.AaveTypes = __importStar(require("./chains/aave/types"));
var Listener_1 = require("./Listener");
Object.defineProperty(exports, "Listener", { enumerable: true, get: function () { return Listener_1.Listener; } });
__exportStar(require("./handlers"), exports);
__exportStar(require("./util"), exports);
// defaults
exports.networkUrls = {
    clover: 'wss://api.clover.finance',
    hydradx: 'wss://rpc-01.snakenet.hydradx.io',
    edgeware: 'ws://mainnet2.edgewa.re:9944',
    'edgeware-local': 'ws://localhost:9944',
    'edgeware-testnet': 'wss://beresheet1.edgewa.re',
    kusama: 'wss://kusama-rpc.polkadot.io',
    polkadot: 'wss://rpc.polkadot.io',
    kulupu: 'ws://rpc.kulupu.corepaper.org/ws',
    stafi: 'wss://scan-rpc.stafi.io/ws',
    moloch: 'wss://mainnet.infura.io/ws',
    'moloch-local': 'ws://127.0.0.1:9545',
    marlin: 'wss://mainnet.infura.io/ws',
    'marlin-local': 'ws://127.0.0.1:9545',
    uniswap: 'wss://mainnet.infura.io/ws',
    aave: 'wss://mainnet.infura.io/ws',
    'aave-local': 'ws://127.0.0.1:9545',
    'dydx-ropsten': 'wss://ropsten.infura.io/ws',
    dydx: 'wss://mainnet.infura.io/ws',
    erc20: 'wss://mainnet.infura.io/ws',
};
exports.networkSpecs = {
    clover: clover_1.CloverSpec,
    hydradx: hydraDX_1.HydraDXSpec,
    kulupu: kulupu_1.KulupuSpec,
    edgeware: node_types_1.spec,
    'edgeware-local': node_types_1.spec,
    'edgeware-testnet': node_types_1.spec,
    stafi: stafi_1.StafiSpec,
};
exports.contracts = {
    moloch: '0x1fd169A4f5c59ACf79d0Fd5d91D1201EF1Bce9f1',
    'moloch-local': '0x9561C133DD8580860B6b7E504bC5Aa500f0f06a7',
    marlin: '0x777992c2E4EDF704e49680468a9299C6679e37F6',
    aave: '0xEC568fffba86c094cf06b22134B23074DFE2252c',
    'aave-local': '0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9',
    'dydx-ropsten': '0x6938240Ba19cB8a614444156244b658f650c8D5c',
    dydx: '0x7E9B1672616FF6D6629Ef2879419aaE79A9018D2',
    uniswap: '0x5e4be8Bc9637f0EAA1A755019e06A68ce081D58F',
};
exports.Erc20TokenUrls = [
    'https://wispy-bird-88a7.uniswap.workers.dev/?url=http://tokenlist.aave.eth.link',
    'https://gateway.ipfs.io/ipns/tokens.uniswap.org',
    'https://wispy-bird-88a7.uniswap.workers.dev/?url=http://defi.cmc.eth.link',
];
//# sourceMappingURL=index.js.map