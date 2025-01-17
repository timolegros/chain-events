import chai from 'chai';

import { Processor } from '../../../src/compound/processor';
import { Api, RawEvent, EventKind } from '../../../src/compound/types';

const { assert } = chai;

const toHex = (n: number | string) => ({ _hex: `0x${n.toString(16)}` });
const blockNumber = 10000;

const constructEvent = (data): RawEvent => {
  return {
    args: data,
  } as RawEvent;
};

describe('Compound Event Processor Tests', () => {
  it('should process a raw event into a CWEvent', async () => {
    const processor = new Processor(({} as unknown) as Api);
    const kind = EventKind.ProposalQueued;
    const id = 5;
    const eta = 10;
    const event = constructEvent({ id, eta });

    event.blockNumber = blockNumber;
    event.event = 'ProposalQueued';

    const result = await processor.process(event);
    assert.deepEqual(result, [
      {
        blockNumber,
        excludeAddresses: [],
        data: {
          kind,
          id,
          eta,
        },
      },
    ]);
  });

  it('should gracefully fail to process an event with invalid type', async () => {
    const processor = new Processor({} as Api);
    const event = ({
      event: 'NothingHappened',
      blockNumber,
      args: {
        proposalIndex: toHex(1),
      },
    } as unknown) as RawEvent;
    const result = await processor.process(event);
    assert.isEmpty(result);
  });
});
