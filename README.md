# @commonwealth/chain-events

"@commonwealth/chain-events" is a library for subscribing and processing synthetic blockchain events.

## Installation

Available on [npm](https://www.npmjs.com/package/@commonwealth/chain-events) and designed to work both in browser and with nodejs.

```bash
yarn add @commonwealth/chain-events
```

For developing on this project itself, first you must build the project to replicate the npm package structure (using the typescript compiler), and then you can install your local version via `yarn link`:

```bash
~/chain-events$ yarn build
~/chain-events$ yarn link
~/chain-events$ cd ~/project-name
~/project-name$ yarn link @commonwealth/chain-events
```

Be sure to call `yarn unlink` once development has been completed and the new changes have been published.

Please submit any enhancements or bug fixes as a Pull Request on the [project's github page](https://github.com/hicommonwealth/chain-events).

## Usage

The easiest usage of the package involves calling `subscribeEvents` directly, which initializes the various components automatically. Do this for Substrate as follows.

```typescript
import { Mainnet } from '@edgeware/node-types';
import { SubstrateEvents, CWEvent, IEventHandler } from '@commonwealth/chain-events';

// This is an example event handler that processes events as they are emitted.
// Add logic in the `handle()` method to take various actions based on the events.
class ExampleEventHandler extends IEventHandler {
  public async handle(event: CWEvent): Promise<void> {
    console.log(`Received event: ${JSON.stringify(event, null, 2)}`);
  }
}

async function subscribe(url) {
  // Populate with chain-specific types
  const types = Mainnet.types;
  const typesAlias = Mainnet.typesAlias;
  const api = await SubstrateEvents.createApi(url, types, typesAlias);

  const handlers = [ new ExampleEventHandler() ];
  const subscriber = await SubstrateEvents.subscribeEvents({
    api,
    chain: 'edgeware',
    handlers,

    // print more output
    verbose: true,

    // if set to false, will attempt to poll past events at setup time
    skipCatchup: true,

    // if not skipping catchup, this function should "discover" the most
    // recently seen block, in order to limit how far back we attempt to "catch-up"
    discoverReconnectRange: undefined,
  });
  return subscriber;
}
```

Alternatively, the individual `Subscriber`, `Poller`, `StorageFetcher`, and `Processor` objects can be accessed directly on the `SubstrateEvents` object, and
can be set up directly. For an example of this, see the initialization procedure in [subscribeFunc.ts](./src/substrate/subscribeFunc.ts).

## Class Details

The top level `@commonwealth/chain-events` import exposes various abstract types from the [interfaces.ts](./src/interfaces.ts) file, as well as "per-chain" modules, e.g. for Substrate, `SubstrateTypes` and `SubstrateEvents`, with the former containing interfaces and the latter containing classes and functions.

The two main concepts used in the project are "ChainEvents" and "ChainEntities".
* A "ChainEvent" represents a single event or extrinsic call performed on the chain, although it may be augmented with additional chain data at production time. ChainEvents are the main outputs generated by this project.
* A "ChainEntity" represents a stateful object on chain, subject to one or more "ChainEvents" which manipulate its state. The most common usage of ChainEntity is to represent on-chain proposals, which may have a pre-voting phase, a voting phase, and a period post-voting before the proposal is marked completed, each phase transition represented by events that relate to the same object. **This project defines types and simple utilities for ChainEntities but does not provide any specific tools for managing them.**

Each chain implements several abstract classes, described in [interfaces.ts](./src/interfaces.ts). The list for Substrate is as follows:

* `Subscriber` exposes a `subscribe()` method, which listens to the chain via the API and constructs a synthetic `Block` type when events occur, containing necessary data for later processing.
* `Poller` exposes a `poll()` method, which attempts to fetch a range of past blocks and returns an Array of synthetic `Block`s. This is used for "catching up" on past events.
* `StorageFetcher` exposes a `fetch()` method, which queries chain storage and constructs "fake" `Block`s, that represent what the original events may have looked like. This is used to quickly catch up on stateful Chain Entities from chains that prune past blocks (as most do).
* `Processor` exposes a `process()` method, which takes a synthetic `Block` and attempts to convert it into a `CWEvent` (aka a ChainEvent), by running it through various "filters", found in the [filters](./src/substrate/filters) directory. The primary filter types used are as follows:
  * `ParseType` uses data from the chain to detect the ChainEvent kind of a `Block`. It is used to quickly filter out blocks that do not represent any kind of ChainEvent.
  * `Enrich` uses the API to query additional data about a ChainEvent that did not appear in the original `Block`, and constructs the final `CWEvent` object. This is used because many "events" on chains provide only minimal info, which we may want to augment for application purposes.
  * Two other filters exist, which are not used by the `Processor`, but may be useful in an application:
    * `Title` takes a kind of ChainEvent and produces an object with a title and description, useful for enumerating a human-readable list of possible ChainEvents.
    * `Label` takes a specific ChainEvent and produces an object with a heading, a label, and a linkUrl, useful for creating human-readable UIs around particular events. The `linkUrl` property in particular is currently specific to [Commonwealth](https://commonwealth.im/), but may in the future be generalized.

Note that every item on this list may not be implemented for every chain (e.g. Moloch does not have a `Poller`), but the combination of these components provides the pieces to create a more usable application-usable event stream than what is exposed on the chain.
