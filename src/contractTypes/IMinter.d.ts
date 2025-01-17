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
  PayableOverrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface IMinterInterface extends ethers.utils.Interface {
  functions: {
    "isEthRequired()": FunctionFragment;
    "mint(address,uint256)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "isEthRequired",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "mint",
    values: [string, BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "isEthRequired",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "mint", data: BytesLike): Result;

  events: {};
}

export class IMinter extends Contract {
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

  interface: IMinterInterface;

  functions: {
    isEthRequired(overrides?: CallOverrides): Promise<[boolean]>;

    "isEthRequired()"(overrides?: CallOverrides): Promise<[boolean]>;

    mint(
      _token: string,
      _amount: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "mint(address,uint256)"(
      _token: string,
      _amount: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  isEthRequired(overrides?: CallOverrides): Promise<boolean>;

  "isEthRequired()"(overrides?: CallOverrides): Promise<boolean>;

  mint(
    _token: string,
    _amount: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "mint(address,uint256)"(
    _token: string,
    _amount: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    isEthRequired(overrides?: CallOverrides): Promise<boolean>;

    "isEthRequired()"(overrides?: CallOverrides): Promise<boolean>;

    mint(
      _token: string,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "mint(address,uint256)"(
      _token: string,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    isEthRequired(overrides?: CallOverrides): Promise<BigNumber>;

    "isEthRequired()"(overrides?: CallOverrides): Promise<BigNumber>;

    mint(
      _token: string,
      _amount: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "mint(address,uint256)"(
      _token: string,
      _amount: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    isEthRequired(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "isEthRequired()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    mint(
      _token: string,
      _amount: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "mint(address,uint256)"(
      _token: string,
      _amount: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
