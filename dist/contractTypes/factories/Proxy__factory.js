"use strict";
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Proxy__factory = void 0;
const ethers_1 = require("ethers");
class Proxy__factory {
    static connect(address, signerOrProvider) {
        return new ethers_1.Contract(address, _abi, signerOrProvider);
    }
}
exports.Proxy__factory = Proxy__factory;
const _abi = [
    {
        stateMutability: "payable",
        type: "fallback",
    },
];
//# sourceMappingURL=Proxy__factory.js.map