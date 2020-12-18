/* eslint-disable dot-notation */
import { ApiPromise } from '@polkadot/api';
import { Option } from '@polkadot/types';
import { IdentityJudgement, AccountVote } from '@polkadot/types/interfaces';
import { Codec } from '@polkadot/types/types';
import { IdentityJudgement as JudgementEnum } from '../../../src/substrate/types';

export function constructOption<T extends Codec>(value?: T): Option<T> {
  if (value) {
    return {
      isSome: true,
      isNone: false,
      isEmpty: false,
      value,
      unwrap: () => value,
    } as unknown as Option<T>;
  } else {
    return {
      isSome: false,
      isNone: true,
      isEmpty: true,
      value: undefined,
      unwrap: () => { throw new Error('option is null'); }
    } as unknown as Option<T>;
  }
}

export function constructIdentityJudgement(j: JudgementEnum): IdentityJudgement {
  const obj = {
    isUnknown: false,
    isFeePaid: false,
    isReasonable: false,
    isKnownGood: false,
    isOutOfDate: false,
    isLowQuality: false,
    isErroneous: false,
  };
  switch (j) {
    case JudgementEnum.Unknown:
      obj.isUnknown = true;
      break;
    case JudgementEnum.Reasonable:
      obj.isReasonable = true;
      break;
    case JudgementEnum.OutOfDate:
      obj.isOutOfDate = true;
      break;
    case JudgementEnum.LowQuality:
      obj.isLowQuality = true;
      break;
    case JudgementEnum.KnownGood:
      obj.isKnownGood = true;
      break;
    case JudgementEnum.FeePaid:
      obj.isFeePaid = true;
      break;
    case JudgementEnum.Erroneous:
      obj.isErroneous = true;
      break;
  }
  return obj as unknown as IdentityJudgement;
}

export function constructAccountVote(
  isAye: boolean,
  conviction: number,
  balance: string,
  isSplit = false,
): AccountVote {
  if (isSplit) {
    return { isSplit: true, asSplit: {}, isStandard: false } as AccountVote;
  } else {
    return {
      isSplit: false,
      isStandard: true,
      asStandard: {
        balance,
        vote: {
          isAye,
          isNay: !isAye,
          conviction: {
            index: conviction,
          }
        }
      }
    } as unknown as AccountVote;
  }
}

export function constructFakeApi(
  callOverrides: { [name: string]: (...args: any[]) => Promise<any> }
): ApiPromise {
  // TODO: auto-multi everything here
  const identityOf = function (...args) { return callOverrides['identityOf'](...args); };
  identityOf.multi = callOverrides['identityOfMulti'];

  const proposals = function (...args) { return callOverrides['treasuryProposals'](...args); };
  proposals.multi = callOverrides['treasuryProposalsMulti'];

  const bounties = function (...args) { return callOverrides['treasuryBounties'](...args); };
  bounties.multi = callOverrides['treasuryBountiesMulti'];

  return {
    createType: (name, value) => value,
    queryMulti: (queries) => {
      return Promise.all(queries.map((q: any[]) => {
        const qFunc = q[0];
        const qArgs = q.slice(1);
        return qFunc(...qArgs);
      }));
    },
    rpc: {
      chain: {
        subscribeNewHeads: callOverrides['subscribeNewHeads'],
        getHeader: callOverrides['getHeader'],
        getBlock: callOverrides['getBlock'],
        getBlockHash: callOverrides['getBlockHash'],
      },
      state: {
        getRuntimeVersion: callOverrides['getRuntimeVersion'],
        subscribeRuntimeVersion: callOverrides['subscribeRuntimeVersion'],
      }
    },
    query: {
      system: {
        blockHash: {
          multi: callOverrides['blockHash.multi'],
        },
        events: {
          at: callOverrides['events.at'],
        }
      },
      session: {
        nextKeys: callOverrides['nextKeys']
      },
      staking: {
        bonded: callOverrides['bonded'],
        currentPoints: callOverrides['currentPoints'],
        currentEra: callOverrides['currentEra'],
        stakers: callOverrides['stakers'],
        activeEra: callOverrides['activeEra'],
      },
      democracy: {
        referendumInfoOf: callOverrides['referendumInfoOf'],
        publicProps: callOverrides['publicProps'],
        depositOf: callOverrides['depositOf'],
      },
      electionsPhragmen: {
        members: callOverrides['electionMembers'],
        electionRounds: callOverrides['electionRounds'],
      },
      treasury: {
        proposals,
        bounties,
        approvals: callOverrides['treasuryApprovals'],
        proposalCount: callOverrides['treasuryProposalCount'],
        bountyCount: callOverrides['treasuryBountyCount'],
      },
      council: {
        voting: {
          multi: callOverrides['votingMulti'],
        },
        proposals: callOverrides['collectiveProposals'],
        proposalOf: callOverrides['collectiveProposalOf'],
      },
      signaling: {
        proposalOf: callOverrides['signalingProposalOf'],
        inactiveProposals: callOverrides['inactiveProposals'],
        activeProposals: callOverrides['activeProposals'],
        completedProposals: callOverrides['completedProposals'],
      },
      voting: {
        voteRecords: callOverrides['voteRecords'],
      },
      offences: {
        concurrentReportsIndex: callOverrides['concurrentReportsIndex'],
        reports: {
          multi: callOverrides['reports.multi'],
        }
      },
      identity: {
        identityOf,
        registrars: callOverrides['registrars'],
      }
    },
    derive: {
      chain: {
        bestNumber: callOverrides['bestNumber'],
      },
      staking: {
        validators: callOverrides['validators'],
        electedInfo: callOverrides['electedInfo'],
      },
      democracy: {
        dispatchQueue: callOverrides['dispatchQueue'],
        preimage: callOverrides['preimage'],
        preimages: callOverrides['preimages'],
        referendumsActive: callOverrides['referendumsActive'],
      },
      treasury: {
        proposals: callOverrides['treasuryProposalsDerive'],
      },
      council: {
        proposals: callOverrides['councilProposalsDerive'],
      }
    }
  } as unknown as ApiPromise;
}
