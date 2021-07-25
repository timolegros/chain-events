/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import { Contract, ContractTransaction, EventFilter, Signer } from 'ethers';
import { Listener, Provider } from 'ethers/providers';
import { Arrayish, BigNumber, BigNumberish, Interface } from 'ethers/utils';
import {
  TransactionOverrides,
  TypedEventDescription,
  TypedFunctionDescription,
} from './index';

interface Erc20Interface extends Interface {
  functions: {
    totalSupply: TypedFunctionDescription<{ encode([]: []): string }>;

    balanceOf: TypedFunctionDescription<{ encode([owner]: [string]): string }>;

    allowance: TypedFunctionDescription<{
      encode([owner, spender]: [string, string]): string;
    }>;

    transfer: TypedFunctionDescription<{
      encode([to, value]: [string, BigNumberish]): string;
    }>;

    approve: TypedFunctionDescription<{
      encode([spender, value]: [string, BigNumberish]): string;
    }>;

    transferFrom: TypedFunctionDescription<{
      encode([from, to, value]: [string, string, BigNumberish]): string;
    }>;

    increaseAllowance: TypedFunctionDescription<{
      encode([spender, addedValue]: [string, BigNumberish]): string;
    }>;

    decreaseAllowance: TypedFunctionDescription<{
      encode([spender, subtractedValue]: [string, BigNumberish]): string;
    }>;
  };

  events: {
    Approval: TypedEventDescription<{
      encodeTopics([owner, spender, value]: [
        string | null,
        string | null,
        null
      ]): string[];
    }>;

    Transfer: TypedEventDescription<{
      encodeTopics([from, to, value]: [
        string | null,
        string | null,
        null
      ]): string[];
    }>;
  };
}

export class Erc20 extends Contract {
  connect(signerOrProvider: Signer | Provider | string): Erc20;
  attach(addressOrName: string): Erc20;
  deployed(): Promise<Erc20>;

  on(event: EventFilter | string, listener: Listener): Erc20;
  once(event: EventFilter | string, listener: Listener): Erc20;
  addListener(eventName: EventFilter | string, listener: Listener): Erc20;
  removeAllListeners(eventName: EventFilter | string): Erc20;
  removeListener(eventName: any, listener: Listener): Erc20;

  interface: Erc20Interface;

  functions: {
    /**
     * Total number of tokens in existence
     */
    totalSupply(): Promise<BigNumber>;

    /**
     * Gets the balance of the specified address.
     * @param owner The address to query the balance of.
     * @returns An uint256 representing the amount owned by the passed address.
     */
    balanceOf(owner: string): Promise<BigNumber>;

    /**
     * Function to check the amount of tokens that an owner allowed to a spender.
     * @param owner address The address which owns the funds.
     * @param spender address The address which will spend the funds.
     * @returns A uint256 specifying the amount of tokens still available for the spender.
     */
    allowance(owner: string, spender: string): Promise<BigNumber>;

    /**
     * Transfer token for a specified address
     * @param to The address to transfer to.
     * @param value The amount to be transferred.
     */
    transfer(
      to: string,
      value: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    /**
     * Approve the passed address to spend the specified amount of tokens on behalf of msg.sender. Beware that changing an allowance with this method brings the risk that someone may use both the old and the new allowance by unfortunate transaction ordering. One possible solution to mitigate this race condition is to first reduce the spender's allowance to 0 and set the desired value afterwards: https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     * @param spender The address which will spend the funds.
     * @param value The amount of tokens to be spent.
     */
    approve(
      spender: string,
      value: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    /**
     * Transfer tokens from one address to another. Note that while this function emits an Approval event, this is not required as per the specification, and other compliant implementations may not emit the event.
     * @param from address The address which you want to send tokens from
     * @param to address The address which you want to transfer to
     * @param value uint256 the amount of tokens to be transferred
     */
    transferFrom(
      from: string,
      to: string,
      value: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    /**
     * Increase the amount of tokens that an owner allowed to a spender. approve should be called when allowed_[_spender] == 0. To increment allowed value is better to use this function to avoid 2 calls (and wait until the first transaction is mined) From MonolithDAO Token.sol Emits an Approval event.
     * @param addedValue The amount of tokens to increase the allowance by.
     * @param spender The address which will spend the funds.
     */
    increaseAllowance(
      spender: string,
      addedValue: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    /**
     * Decrease the amount of tokens that an owner allowed to a spender. approve should be called when allowed_[_spender] == 0. To decrement allowed value is better to use this function to avoid 2 calls (and wait until the first transaction is mined) From MonolithDAO Token.sol Emits an Approval event.
     * @param spender The address which will spend the funds.
     * @param subtractedValue The amount of tokens to decrease the allowance by.
     */
    decreaseAllowance(
      spender: string,
      subtractedValue: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;
  };

  /**
   * Total number of tokens in existence
   */
  totalSupply(): Promise<BigNumber>;

  /**
   * Gets the balance of the specified address.
   * @param owner The address to query the balance of.
   * @returns An uint256 representing the amount owned by the passed address.
   */
  balanceOf(owner: string): Promise<BigNumber>;

  /**
   * Function to check the amount of tokens that an owner allowed to a spender.
   * @param owner address The address which owns the funds.
   * @param spender address The address which will spend the funds.
   * @returns A uint256 specifying the amount of tokens still available for the spender.
   */
  allowance(owner: string, spender: string): Promise<BigNumber>;

  /**
   * Transfer token for a specified address
   * @param to The address to transfer to.
   * @param value The amount to be transferred.
   */
  transfer(
    to: string,
    value: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  /**
   * Approve the passed address to spend the specified amount of tokens on behalf of msg.sender. Beware that changing an allowance with this method brings the risk that someone may use both the old and the new allowance by unfortunate transaction ordering. One possible solution to mitigate this race condition is to first reduce the spender's allowance to 0 and set the desired value afterwards: https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
   * @param spender The address which will spend the funds.
   * @param value The amount of tokens to be spent.
   */
  approve(
    spender: string,
    value: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  /**
   * Transfer tokens from one address to another. Note that while this function emits an Approval event, this is not required as per the specification, and other compliant implementations may not emit the event.
   * @param from address The address which you want to send tokens from
   * @param to address The address which you want to transfer to
   * @param value uint256 the amount of tokens to be transferred
   */
  transferFrom(
    from: string,
    to: string,
    value: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  /**
   * Increase the amount of tokens that an owner allowed to a spender. approve should be called when allowed_[_spender] == 0. To increment allowed value is better to use this function to avoid 2 calls (and wait until the first transaction is mined) From MonolithDAO Token.sol Emits an Approval event.
   * @param addedValue The amount of tokens to increase the allowance by.
   * @param spender The address which will spend the funds.
   */
  increaseAllowance(
    spender: string,
    addedValue: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  /**
   * Decrease the amount of tokens that an owner allowed to a spender. approve should be called when allowed_[_spender] == 0. To decrement allowed value is better to use this function to avoid 2 calls (and wait until the first transaction is mined) From MonolithDAO Token.sol Emits an Approval event.
   * @param spender The address which will spend the funds.
   * @param subtractedValue The amount of tokens to decrease the allowance by.
   */
  decreaseAllowance(
    spender: string,
    subtractedValue: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  filters: {
    Approval(
      owner: string | null,
      spender: string | null,
      value: null
    ): EventFilter;

    Transfer(from: string | null, to: string | null, value: null): EventFilter;
  };

  estimate: {
    totalSupply(): Promise<BigNumber>;

    balanceOf(owner: string): Promise<BigNumber>;

    allowance(owner: string, spender: string): Promise<BigNumber>;

    transfer(to: string, value: BigNumberish): Promise<BigNumber>;

    approve(spender: string, value: BigNumberish): Promise<BigNumber>;

    transferFrom(
      from: string,
      to: string,
      value: BigNumberish
    ): Promise<BigNumber>;

    increaseAllowance(
      spender: string,
      addedValue: BigNumberish
    ): Promise<BigNumber>;

    decreaseAllowance(
      spender: string,
      subtractedValue: BigNumberish
    ): Promise<BigNumber>;
  };
}
