import { Processor, Subscriber } from '../../../src/chains/erc20';
import { Listener } from '../../../src/chains/erc20';
import { networkUrls, EventSupportingChainT } from '../../../src';
import * as chai from 'chai';
import * as events from 'events';
import { testHandler } from '../../util';

import dotenv from 'dotenv';
dotenv.config();

const { assert } = chai;
const tokenAddresses = [
  '0xdac17f958d2ee523a2206206994597c13d831ec7',
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
];
const tokenNames = ['USDT', 'USDC'];

describe.only('Erc20 listener class tests', () => {
  let listener;
  let handlerEmitter = new events.EventEmitter();

  it('should throw if the chain is not an Aave based contract', () => {
    try {
      new Listener(
        'randomChain' as EventSupportingChainT,
        tokenAddresses,
        networkUrls['erc20'],
        tokenNames,
        false
      );
    } catch (error) {
      assert(String(error).includes('randomChain'));
    }
  });

  it('should create an Erc20 listener', () => {
    listener = new Listener(
      'erc20',
      tokenAddresses,
      networkUrls['erc20'],
      tokenNames,
      false
    );
    assert.equal(listener.chain, 'erc20');
    assert.deepEqual(listener.options, {
      url: networkUrls['erc20'],
      tokenAddresses,
      tokenNames,
    });
    assert.equal(listener.subscribed, false);
    assert.equal(listener._verbose, false);
  });

  it('should initialize the Erc20 listener', async () => {
    await listener.init();
    assert(listener._subscriber instanceof Subscriber);
    assert(listener._processor instanceof Processor);
    return;
  });

  it('should add a handler', async () => {
    listener.eventHandlers['testHandler'] = {
      handler: new testHandler(listener._verbose, handlerEmitter),
      excludedEvents: [],
    };

    assert(
      listener.eventHandlers['testHandler'].handler instanceof testHandler
    );
    return;
  });

  it('should subscribe the listener to the specified erc20 tokens', async () => {
    await listener.subscribe();
    assert.equal(listener.subscribed, true);
  });

  it('should verify that the handler handled an event successfully', (done) => {
    let counter = 0;
    const verifyHandler = () => {
      assert(listener.eventHandlers['testHandler'].handler.counter >= 1);
      ++counter;
      if (counter == 1) {
        done();
      }
    };
    handlerEmitter.on('eventHandled', verifyHandler);
  }).timeout(50000);

  xit('should update a contract address');

  xit('should verify that the handler handled an event successfully after changing contract address', (done) => {
    listener.eventHandlers['testHandler'].handler.counter = 0;
    let counter = 0;
    const verifyHandler = () => {
      assert(listener.eventHandlers['testHandler'].handler.counter >= 1);
      ++counter;
      if (counter == 1) done();
    };
    handlerEmitter.on('eventHandled', verifyHandler);
  }).timeout(20000);

  xit('should update the url the listener should connect to', async () => {});

  xit('should verify that the handler handled an event successfully after changing urls', () => {
    assert(
      listener.eventHandlers['testHandler'].handler.counter >= 1,
      'Handler was not triggered/used'
    );
    listener.eventHandlers['testHandler'].handler.counter = 0;
    return;
  });

  it('should unsubscribe from the chain', async () => {
    listener.unsubscribe();
    assert.equal(listener.subscribed, false);
  });

  it('should return the updated options', async () => {
    assert.deepEqual(listener.options, {
      url: networkUrls['erc20'],
      tokenAddresses,
      tokenNames,
    });
  });
});
