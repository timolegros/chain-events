"use strict";
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitializableUpgradeabilityProxy__factory = void 0;
const ethers_1 = require("ethers");
class InitializableUpgradeabilityProxy__factory extends ethers_1.ContractFactory {
    constructor(signer) {
        super(_abi, _bytecode, signer);
    }
    deploy(overrides) {
        return super.deploy(overrides || {});
    }
    getDeployTransaction(overrides) {
        return super.getDeployTransaction(overrides || {});
    }
    attach(address) {
        return super.attach(address);
    }
    connect(signer) {
        return super.connect(signer);
    }
    static connect(address, signerOrProvider) {
        return new ethers_1.Contract(address, _abi, signerOrProvider);
    }
}
exports.InitializableUpgradeabilityProxy__factory = InitializableUpgradeabilityProxy__factory;
const _abi = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "implementation",
                type: "address",
            },
        ],
        name: "Upgraded",
        type: "event",
    },
    {
        stateMutability: "payable",
        type: "fallback",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_logic",
                type: "address",
            },
            {
                internalType: "bytes",
                name: "_data",
                type: "bytes",
            },
        ],
        name: "initialize",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
];
const _bytecode = "0x608060405234801561001057600080fd5b50610338806100206000396000f3fe60806040526004361061001e5760003560e01c8063d1f5789414610028575b6100266100de565b005b6100266004803603604081101561003e57600080fd5b6001600160a01b03823516919081019060408101602082013564010000000081111561006957600080fd5b82018360208201111561007b57600080fd5b8035906020019184600183028401116401000000008311171561009d57600080fd5b91908080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152509295506100f8945050505050565b6100e66100f6565b6100f66100f16101da565b6101ff565b565b60006101026101da565b6001600160a01b03161461011557600080fd5b61011e82610223565b8051156101d6576000826001600160a01b0316826040518082805190602001908083835b602083106101615780518252601f199092019160209182019101610142565b6001836020036101000a038019825116818451168082178552505050505050905001915050600060405180830381855af49150503d80600081146101c1576040519150601f19603f3d011682016040523d82523d6000602084013e6101c6565b606091505b50509050806101d457600080fd5b505b5050565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc5490565b3660008037600080366000845af43d6000803e80801561021e573d6000f35b3d6000fd5b61022c8161028b565b6102675760405162461bcd60e51b815260040180806020018281038252603b8152602001806102c8603b913960400191505060405180910390fd5b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc55565b6000813f7fc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a4708181148015906102bf57508115155b94935050505056fe43616e6e6f742073657420612070726f787920696d706c656d656e746174696f6e20746f2061206e6f6e2d636f6e74726163742061646472657373a2646970667358221220aa32735aa664625d1e2d81fcbe14e56195c0226346644d92aefb3ac6c39971e164736f6c63430007050033";
//# sourceMappingURL=InitializableUpgradeabilityProxy__factory.js.map