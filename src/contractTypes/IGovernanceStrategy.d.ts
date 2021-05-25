/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  Contract,
  ContractTransaction,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface IGovernanceStrategyInterface extends ethers.utils.Interface {
  functions: {
    "AAVE()": FunctionFragment;
    "STK_AAVE()": FunctionFragment;
    "getPropositionPowerAt(address,uint256)": FunctionFragment;
    "getTotalPropositionSupplyAt(uint256)": FunctionFragment;
    "getTotalVotingSupplyAt(uint256)": FunctionFragment;
    "getVotingPowerAt(address,uint256)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "AAVE", values?: undefined): string;
  encodeFunctionData(functionFragment: "STK_AAVE", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getPropositionPowerAt",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getTotalPropositionSupplyAt",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getTotalVotingSupplyAt",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getVotingPowerAt",
    values: [string, BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "AAVE", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "STK_AAVE", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getPropositionPowerAt",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTotalPropositionSupplyAt",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTotalVotingSupplyAt",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getVotingPowerAt",
    data: BytesLike
  ): Result;

  events: {};
}

export class IGovernanceStrategy extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: IGovernanceStrategyInterface;

  functions: {
    AAVE(overrides?: CallOverrides): Promise<[string]>;

    "AAVE()"(overrides?: CallOverrides): Promise<[string]>;

    STK_AAVE(overrides?: CallOverrides): Promise<[string]>;

    "STK_AAVE()"(overrides?: CallOverrides): Promise<[string]>;

    getPropositionPowerAt(
      user: string,
      blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    "getPropositionPowerAt(address,uint256)"(
      user: string,
      blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getTotalPropositionSupplyAt(
      blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    "getTotalPropositionSupplyAt(uint256)"(
      blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getTotalVotingSupplyAt(
      blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    "getTotalVotingSupplyAt(uint256)"(
      blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getVotingPowerAt(
      user: string,
      blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    "getVotingPowerAt(address,uint256)"(
      user: string,
      blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;
  };

  AAVE(overrides?: CallOverrides): Promise<string>;

  "AAVE()"(overrides?: CallOverrides): Promise<string>;

  STK_AAVE(overrides?: CallOverrides): Promise<string>;

  "STK_AAVE()"(overrides?: CallOverrides): Promise<string>;

  getPropositionPowerAt(
    user: string,
    blockNumber: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "getPropositionPowerAt(address,uint256)"(
    user: string,
    blockNumber: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getTotalPropositionSupplyAt(
    blockNumber: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "getTotalPropositionSupplyAt(uint256)"(
    blockNumber: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getTotalVotingSupplyAt(
    blockNumber: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "getTotalVotingSupplyAt(uint256)"(
    blockNumber: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getVotingPowerAt(
    user: string,
    blockNumber: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "getVotingPowerAt(address,uint256)"(
    user: string,
    blockNumber: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  callStatic: {
    AAVE(overrides?: CallOverrides): Promise<string>;

    "AAVE()"(overrides?: CallOverrides): Promise<string>;

    STK_AAVE(overrides?: CallOverrides): Promise<string>;

    "STK_AAVE()"(overrides?: CallOverrides): Promise<string>;

    getPropositionPowerAt(
      user: string,
      blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getPropositionPowerAt(address,uint256)"(
      user: string,
      blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getTotalPropositionSupplyAt(
      blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getTotalPropositionSupplyAt(uint256)"(
      blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getTotalVotingSupplyAt(
      blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getTotalVotingSupplyAt(uint256)"(
      blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getVotingPowerAt(
      user: string,
      blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getVotingPowerAt(address,uint256)"(
      user: string,
      blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    AAVE(overrides?: CallOverrides): Promise<BigNumber>;

    "AAVE()"(overrides?: CallOverrides): Promise<BigNumber>;

    STK_AAVE(overrides?: CallOverrides): Promise<BigNumber>;

    "STK_AAVE()"(overrides?: CallOverrides): Promise<BigNumber>;

    getPropositionPowerAt(
      user: string,
      blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getPropositionPowerAt(address,uint256)"(
      user: string,
      blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getTotalPropositionSupplyAt(
      blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getTotalPropositionSupplyAt(uint256)"(
      blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getTotalVotingSupplyAt(
      blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getTotalVotingSupplyAt(uint256)"(
      blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getVotingPowerAt(
      user: string,
      blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getVotingPowerAt(address,uint256)"(
      user: string,
      blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    AAVE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "AAVE()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    STK_AAVE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "STK_AAVE()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getPropositionPowerAt(
      user: string,
      blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getPropositionPowerAt(address,uint256)"(
      user: string,
      blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getTotalPropositionSupplyAt(
      blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getTotalPropositionSupplyAt(uint256)"(
      blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getTotalVotingSupplyAt(
      blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getTotalVotingSupplyAt(uint256)"(
      blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getVotingPowerAt(
      user: string,
      blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getVotingPowerAt(address,uint256)"(
      user: string,
      blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
