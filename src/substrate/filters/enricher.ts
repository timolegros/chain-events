import { ApiPromise } from '@polkadot/api';
import {
  Event, ReferendumInfoTo239, AccountId, TreasuryProposal, Balance, PropIndex, Proposal,
  ReferendumIndex, ProposalIndex, VoteThreshold, Hash, BlockNumber, Votes, Extrinsic,
  ReferendumInfo, SessionIndex, ValidatorId, Exposure, EraIndex, AuthorityId, IdentificationTuple,
  EraRewardPoints, AccountVote, Bounty, BountyIndex,
} from '@polkadot/types/interfaces';
import { DeriveStakingElected } from '@polkadot/api-derive/types';
import BN from 'bn.js';
import { ProposalRecord, VoteRecord } from '@edgeware/node-types';
import { Option, bool, Vec, u32, u64, Compact } from '@polkadot/types';
import { Codec } from '@polkadot/types/types';
import { filter } from 'lodash';
import { Kind, OpaqueTimeSlot, OffenceDetails } from '@polkadot/types/interfaces/offences';
import { CWEvent } from '../../interfaces';
import { EventKind, IEventData, isEvent, parseJudgement, IdentityJudgement } from '../types';

/**
 * This is an "enricher" function, whose goal is to augment the initial event data
 * received from the "system.events" query with additional useful information, as
 * described in the event's interface in our "types.ts" file.
 *
 * Once fetched, the function marshalls the event data and the additional information
 * into the interface, and returns a fully-formed event, ready for database storage.
 */

export async function Enrich(
  api: ApiPromise,
  blockNumber: number,
  kind: EventKind,
  rawData: Event | Extrinsic,
): Promise<CWEvent<IEventData>> {
  const extractEventData = async (event: Event): Promise<{
    data: IEventData,
    includeAddresses?: string[],
    excludeAddresses?: string[],
  }> => {
    switch (kind) {
      /**
       * ImOnline Events
       */
      case EventKind.HeartbeatReceived: {
        const [ authorityId ] = event.data as unknown as [ AuthorityId ] & Codec
        return {
          data: {
            kind,
            authorityId: authorityId.toString()
          }
        }
      }
      case EventKind.SomeOffline: {
        const [ validators ] = event.data as unknown as [ Vec<IdentificationTuple> ];
        const sessionIndex = await api.query.session.currentIndex();
        return {
          data: {
            kind,
            sessionIndex: +sessionIndex - 1,
            validators: validators?.map((v) => v.toString()),
          }
        }
      }
      case EventKind.AllGood: {
        const validators = await api.derive.staking.validators();
        const sessionIndex = await api.query.session.currentIndex();
        return {
          data: {
            kind,
            sessionIndex: +sessionIndex - 1,
            validators: validators.validators?.map((v) => v.toString()),
          }
        }
      }

      /**
       * Offences Events
       */
      case EventKind.Offence: {
        const [ offenceKind, opaqueTimeSlot, applied ] = event.data as unknown as [ Kind, OpaqueTimeSlot, bool ];
        const offenceApplied = applied.isTrue;
        const reportIds = await api.query.offences.concurrentReportsIndex(offenceKind, opaqueTimeSlot);
        const offenceDetails: Option<OffenceDetails>[] = await api.query.offences.reports
          .multi(reportIds);

        const allOffenders: Array<ValidatorId> = offenceDetails.map((offence) => {
          if(offence.isSome)
            return offence.unwrap().offender[0];
          return null;
        });
        const offenders: Array<ValidatorId> = filter(allOffenders, null);

        return {
          data: {
            kind,
            offenceKind: offenceKind.toString(),
            opaqueTimeSlot: opaqueTimeSlot.toString(),
            applied: offenceApplied,
            offenders: offenders.map((offender => offender.toString()))
          }
        };
      }
      /**
       * Session Events
       */
      case EventKind.NewSession: {
        const [sessionIndex] = event.data as unknown as [SessionIndex] & Codec
        const validators = await api.derive.staking.validators();
        const electedInfo: DeriveStakingElected = await api.derive.staking.electedInfo() as any; // validator preferences for getting commision
        const validatorEraPoints: EraRewardPoints = await api.query.staking.currentPoints() as EraRewardPoints;
        const currentEra = (Number)(await api.query.staking.currentEra<Option<EraIndex>>());
        const eraPointsIndividual = validatorEraPoints.individual;
        let active: Array<ValidatorId>
        let waiting: Array<ValidatorId>
        const validatorInfo = {};
        electedInfo.info.forEach(async ({ accountId, controllerId, validatorPrefs, rewardDestination }) => {
          const commissionPer = (Number)(validatorPrefs.commission || new BN(0)) / 10_000_000;
          const key = accountId.toString();
          validatorInfo[key] = {}
          validatorInfo[key] = {
            commissionPer,
            controllerId,
            rewardDestination,
            nextSessionIds: await (await api.query.session.nextKeys(key)).toString(),
            eraPoints: Number(eraPointsIndividual[key])
          };
        });
        // erasStakers(EraIndex, AccountId): Exposure -> api.query.staking.erasStakers // KUSAMA
        // stakers(AccountId): Exposure -> api.query.staking.stakers // EDGEWARE
        const stakersCall = (api.query.staking.stakers)
          ? api.query.staking.stakers
          : api.query.staking.erasStakers;
        const stakersCallArgs = (account) => (api.query.staking.stakers)
          ? [account]
          : [currentEra as unknown as EraIndex, account];
        let activeExposures: { [key: string]: any } = {}
        if (validators && currentEra) { // if currentEra isn't empty
          active = validators.validators;
          waiting = validators.nextElected;
          await Promise.all(active.map(async (validator) => {
            const tmp_exposure = (await stakersCall(...stakersCallArgs(validator))) as Exposure;
            const exposure = {
              own: tmp_exposure.own,
              total: tmp_exposure.total,
              others: tmp_exposure.others
            }
            activeExposures[validator.toString()] = exposure;
          }));
        }
        return {
          data: {
            kind,
            activeExposures,
            active: active?.map((v) => v.toString()),
            waiting: waiting?.map((v) => v.toString()),
            sessionIndex: +sessionIndex,
            currentEra: +currentEra,
            validatorInfo,
          }
        }
      }

       /**
       * Staking Events
       */
      case EventKind.Reward: {
        if (event.data.typeDef[0].type === 'Balance') {
          // edgeware/old event
          const [ amount, remainder ] = event.data as unknown as [ Balance, Balance ] & Codec;
          return {
            data: {
              kind,
              amount: amount.toString(),
            }
          };
        } else {
          // kusama/new event
          const [ validator, amount ] = event.data as unknown as [ AccountId, Balance ] & Codec;
          return {
            includeAddresses: [ validator.toString() ],
            data: {
              kind,
              validator: validator.toString(),
              amount: amount.toString(),
            }
          };
        }
      }
      case EventKind.Slash: {
        const [ validator, amount ] = event.data as unknown as [ AccountId, Balance ] & Codec;
        return {
          includeAddresses: [ validator.toString() ],
          data: {
            kind,
            validator: validator.toString(),
            amount: amount.toString(),
          }
        };
      }

      case EventKind.Bonded:
      case EventKind.Unbonded: {
        const [ stash, amount ] = event.data as unknown as [ AccountId, Balance ] & Codec;
        const controllerOpt = await api.query.staking.bonded<Option<AccountId>>(stash);
        if (!controllerOpt.isSome) {
          throw new Error(`could not fetch staking controller for ${stash.toString()}`);
        }
        return {
          includeAddresses: [ stash.toString() ],
          data: {
            kind,
            stash: stash.toString(),
            amount: amount.toString(),
            controller: controllerOpt.unwrap().toString(),
          }
        };
      }
      case EventKind.StakingElection: {
        const era = await api.query.staking.activeEra();
        const validators = await api.derive.staking.validators();
        return {
          data: {
            kind,
            era: +era,
            validators: validators.validators?.map((v) => v.toString()),
          }
        };
      }

      /**
       * Democracy Events
       */
      case EventKind.VoteDelegated: {
        const [ who, target ] = event.data as unknown as [ AccountId, AccountId ] & Codec;
        return {
          includeAddresses: [ target.toString() ],
          data: {
            kind,
            who: who.toString(),
            target: target.toString(),
          }
        };
      }

      case EventKind.DemocracyProposed: {
        const [ proposalIndex, deposit ] = event.data as unknown as [ PropIndex, Balance ] & Codec;
        const props = await api.query.democracy.publicProps();
        const prop = props.find((p) => p.length > 0 && +p[0] === +proposalIndex);
        if (!prop) {
          throw new Error(`could not fetch info for proposal ${+proposalIndex}`);
        }
        const [ idx, hash, proposer ] = prop;
        return {
          excludeAddresses: [ proposer.toString() ],
          data: {
            kind,
            proposalIndex: +proposalIndex,
            proposalHash: hash.toString(),
            deposit: deposit.toString(),
            proposer: proposer.toString(),
          }
        };
      }

      case EventKind.DemocracyTabled: {
        const [ proposalIndex ] = event.data as unknown as [ PropIndex, Balance, Vec<AccountId> ] & Codec;
        return {
          data: {
            kind,
            proposalIndex: +proposalIndex,
          }
        };
      }

      case EventKind.DemocracyStarted: {
        const [ referendumIndex, voteThreshold ] = event.data as unknown as [ ReferendumIndex, VoteThreshold ] & Codec;
        const infoOpt = await api.query.democracy.referendumInfoOf<Option<ReferendumInfoTo239 | ReferendumInfo>>(
          referendumIndex
        );
        if (!infoOpt.isSome) {
          throw new Error(`could not find info for referendum ${+referendumIndex}`);
        }
        if ((infoOpt.unwrap() as any).isOngoing) {
          // kusama
          const info = infoOpt.unwrap() as ReferendumInfo;
          if (!info.isOngoing) {
            throw new Error(`kusama referendum ${+referendumIndex} not in ongoing state`);
          }
          return {
            data: {
              kind,
              referendumIndex: +referendumIndex,
              proposalHash: info.asOngoing.proposalHash.toString(),
              voteThreshold: voteThreshold.toString(),
              endBlock: +info.asOngoing.end,
            }
          };
        } else {
          // edgeware
          const info = infoOpt.unwrap() as ReferendumInfoTo239;
          return {
            data: {
              kind,
              referendumIndex: +referendumIndex,
              proposalHash: info.proposalHash.toString(),
              voteThreshold: voteThreshold.toString(),
              endBlock: +info.end,
            }
          };
        }
      }

      case EventKind.DemocracyPassed: {
        const [ referendumIndex ] = event.data as unknown as [ ReferendumIndex ] & Codec;
        // dispatch queue -- if not present, it was already executed
        const dispatchQueue = await api.derive.democracy.dispatchQueue();
        const dispatchInfo = dispatchQueue.find(({ index }) => +index === +referendumIndex);
        return {
          data: {
            kind,
            referendumIndex: +referendumIndex,
            dispatchBlock: dispatchInfo ? +dispatchInfo.at : null,
          }
        };
      }

      case EventKind.DemocracyNotPassed:
      case EventKind.DemocracyCancelled: {
        const [ referendumIndex ] = event.data as unknown as [ ReferendumIndex ] & Codec;
        return {
          data: {
            kind,
            referendumIndex: +referendumIndex,
          }
        };
      }

      case EventKind.DemocracyExecuted: {
        const [ referendumIndex, executionOk ] = event.data as unknown as [ ReferendumIndex, bool ] & Codec;
        return {
          data: {
            kind,
            referendumIndex: +referendumIndex,
            executionOk: executionOk.isTrue,
          }
        };
      }

      /**
       * Preimage Events
       */
      case EventKind.PreimageNoted: {
        const [ hash, noter, deposit ] = event.data as unknown as [ Hash, AccountId, Balance ] & Codec;
        const image = await api.derive.democracy.preimage(hash);
        if (!image || !image.proposal) {
          throw new Error(`could not find info for preimage ${hash.toString()}`);
        }
        return {
          excludeAddresses: [ noter.toString() ],
          data: {
            kind,
            proposalHash: hash.toString(),
            noter: noter.toString(),
            preimage: {
              method: image.proposal.methodName,
              section: image.proposal.sectionName,
              args: image.proposal.args.map((a) => a.toString()),
            }
          }
        };
      }
      case EventKind.PreimageUsed: {
        const [ hash, noter, deposit ] = event.data as unknown as [ Hash, AccountId, Balance ] & Codec;
        return {
          data: {
            kind,
            proposalHash: hash.toString(),
            noter: noter.toString(),
          }
        };
      }
      case EventKind.PreimageInvalid:
      case EventKind.PreimageMissing: {
        const [ hash, referendumIndex ] = event.data as unknown as [ Hash, ReferendumIndex ] & Codec;
        return {
          data: {
            kind,
            proposalHash: hash.toString(),
            referendumIndex: +referendumIndex,
          }
        };
      }
      case EventKind.PreimageReaped: {
        const [
          hash,
          noter,
          deposit,
          reaper,
        ] = event.data as unknown as [ Hash, AccountId, Balance, AccountId ] & Codec;
        return {
          excludeAddresses: [ reaper.toString() ],
          data: {
            kind,
            proposalHash: hash.toString(),
            noter: noter.toString(),
            reaper: reaper.toString(),
          }
        };
      }

      /**
       * Treasury Events
       */
      case EventKind.TreasuryProposed: {
        const [ proposalIndex ] = event.data as unknown as [ ProposalIndex ] & Codec;
        const proposalOpt = await api.query.treasury.proposals<Option<TreasuryProposal>>(proposalIndex);
        if (!proposalOpt.isSome) {
          throw new Error(`could not fetch treasury proposal index ${+proposalIndex}`);
        }
        const proposal = proposalOpt.unwrap();
        return {
          excludeAddresses: [ proposal.proposer.toString() ],
          data: {
            kind,
            proposalIndex: +proposalIndex,
            proposer: proposal.proposer.toString(),
            value: proposal.value.toString(),
            beneficiary: proposal.beneficiary.toString(),
            bond: proposal.bond.toString(),
          }
        };
      }

      case EventKind.TreasuryAwarded: {
        const [
          proposalIndex,
          amount,
          beneficiary,
        ] = event.data as unknown as [ ProposalIndex, Balance, AccountId ] & Codec;
        return {
          data: {
            kind,
            proposalIndex: +proposalIndex,
            value: amount.toString(),
            beneficiary: beneficiary.toString(),
          }
        };
      }

      case EventKind.TreasuryRejected: {
        const [ proposalIndex, ] = event.data as unknown as [ ProposalIndex, ] & Codec;
        return {
          data: {
            kind,
            proposalIndex: +proposalIndex,
          }
        };
      }

      case EventKind.TreasuryBountyProposed: {
        const [ bountyIndex ] = event.data as unknown as [ BountyIndex ] & Codec;
        const bountyOpt = await api.query.treasury.bounties<Option<Bounty>>(bountyIndex);
        if (!bountyOpt.isSome) {
          throw new Error(`could not fetch treasury proposal index ${+bountyIndex}`);
        }
        const bounty = bountyOpt.unwrap();
        return {
          data: {
            kind,
            bountyIndex: +bountyIndex,
            proposer: bounty.proposer.toString(),
            value: bounty.value.toString(),
            fee: bounty.fee.toString(),
            curatorDeposit: bounty.curatorDeposit.toString(),
            bond: bounty.bond.toString(),
            status: {
              isProposed: bounty.status.isProposed,
              isApproved: bounty.status.isApproved,
              isFunded: bounty.status.isFunded,
              isCuratorProposed: bounty.status.isCuratorProposed,
              asCuratorProposed: {
                curator: bounty.status.asCuratorProposed.curator.toString(),
              },
              isActive: bounty.status.isActive,
              asActive: {
                curator: bounty.status.asActive.curator.toString(),
                updateDue: +bounty.status.asActive.updateDue,
              },
              isPendingPayout: bounty.status.isPendingPayout,
              asPendingPayount: {
                curator: bounty.status.asPendingPayout.curator.toString(),
                beneficiary: bounty.status.asPendingPayout.curator.toString(),
                unlockAt: +bounty.status.asPendingPayout.unlockAt,
              }
            },
          }
        };
      }

      case EventKind.TreasuryBountyAwarded: {
        const [ bountyIndex, beneficiary ] = event.data as unknown as [ BountyIndex, AccountId ] & Codec;
        return {
          data: {
            kind,
            bountyIndex: +bountyIndex,
            beneficiary: beneficiary.toString(),
          }
        };
      }

      case EventKind.TreasuryBountyRejected: {
        const [ bountyIndex, bond ] = event.data as unknown as [ BountyIndex, Balance ] & Codec;
        return {
          data: {
            kind,
            bountyIndex: +bountyIndex,
            bond: bond.toString(),
          }
        };
      }

      case EventKind.TreasuryBountyExtended: {
        const [ bountyIndex ] = event.data as unknown as [ BountyIndex ] & Codec;
        return {
          data: {
            kind,
            bountyIndex: +bountyIndex,
          }
        };
      }

      case EventKind.TreasuryBountyClaimed: {
        const [ bountyIndex, payout, beneficiary ] = event.data as unknown as [ BountyIndex, Balance, AccountId  ] & Codec;
        return {
          data: {
            kind,
            bountyIndex: +bountyIndex,
            payout: payout.toString(),
            beneficiary: beneficiary.toString(),
          }
        };
      }

      case EventKind.TreasuryBountyCanceled: {
        const [ bountyIndex ] = event.data as unknown as [ BountyIndex ] & Codec;
        return {
          data: {
            kind,
            bountyIndex: +bountyIndex,
          }
        };
      }

      case EventKind.TreasuryBountyBecameActive: {
        const [ bountyIndex ] = event.data as unknown as [ BountyIndex ] & Codec;
        return {
          data: {
            kind,
            bountyIndex: +bountyIndex,
          }
        };
      }

      /**
       * Elections Events
       */
      case EventKind.ElectionNewTerm: {
        const [ newMembers ] = event.data as unknown as [ Vec<[ AccountId, Balance ] & Codec> ] & Codec;
        const section = api.query.electionsPhragmen ? 'electionsPhragmen' : 'elections';
        const allMembers = await api.query[section].members<Vec<[ AccountId, Balance ] & Codec>>();
        const round = await api.query[section].electionRounds<u32>();
        return {
          data: {
            kind,
            round: +round,
            newMembers: newMembers.map(([ who ]) => who.toString()),
            allMembers: allMembers.map(([ who ]) => who.toString()),
          }
        };
      }
      case EventKind.ElectionEmptyTerm: {
        const section = api.query.electionsPhragmen ? 'electionsPhragmen' : 'elections';
        const allMembers = await api.query[section].members<Vec<[ AccountId, Balance ] & Codec>>();
        const round = await api.query[section].electionRounds<u32>();
        return {
          data: {
            kind,
            round: +round,
            members: allMembers.map(([ who ]) => who.toString()),
          }
        };
      }
      case EventKind.ElectionMemberKicked:
      case EventKind.ElectionMemberRenounced: {
        const [ who ] = event.data as unknown as [ AccountId ] & Codec;
        return {
          data: {
            kind,
            who: who.toString(),
          }
        };
      }

      /**
       * Collective Events
       */
      case EventKind.CollectiveProposed: {
        const [
          proposer,
          index,
          hash,
          threshold,
        ] = event.data as unknown as [ AccountId, ProposalIndex, Hash, u32 ] & Codec;
        const proposalOpt = await api.query[event.section].proposalOf<Option<Proposal>>(hash);
        if (!proposalOpt.isSome) {
          throw new Error('could not fetch method for collective proposal');
        }
        return {
          excludeAddresses: [ proposer.toString() ],
          data: {
            kind,
            collectiveName: event.section === 'council' || event.section === 'technicalCommittee'
              ? event.section : undefined,
            proposer: proposer.toString(),
            proposalIndex: +index,
            proposalHash: hash.toString(),
            threshold: +threshold,
            call: {
              method: proposalOpt.unwrap().methodName,
              section: proposalOpt.unwrap().sectionName,
              args: proposalOpt.unwrap().args.map((c) => c.toString()),
            }
          }
        };
      }
      case EventKind.CollectiveVoted: {
        const [ voter, hash, vote ] = event.data as unknown as [ AccountId, Hash, bool ] & Codec;
        return {
          excludeAddresses: [ voter.toString() ],
          data: {
            kind,
            collectiveName: event.section === 'council' || event.section === 'technicalCommittee'
              ? event.section : undefined,
            proposalHash: hash.toString(),
            voter: voter.toString(),
            vote: vote.isTrue,
          }
        };
      }
      case EventKind.CollectiveApproved:
      case EventKind.CollectiveDisapproved: {
        const [ hash ] = event.data as unknown as [ Hash ] & Codec;
        return {
          data: {
            kind,
            collectiveName: event.section === 'council' || event.section === 'technicalCommittee'
              ? event.section : undefined,
            proposalHash: hash.toString(),
          }
        };
      }
      case EventKind.CollectiveExecuted:
      case EventKind.CollectiveMemberExecuted: {
        const [ hash, executionOk ] = event.data as unknown as [ Hash, bool ] & Codec;
        return {
          data: {
            kind,
            collectiveName: event.section === 'council' || event.section === 'technicalCommittee'
              ? event.section : undefined,
            proposalHash: hash.toString(),
            executionOk: executionOk.isTrue,
          }
        };
      }

      /**
       * Signaling Events
       */
      case EventKind.SignalingNewProposal: {
        const [ proposer, hash ] = event.data as unknown as [ AccountId, Hash ] & Codec;
        const proposalInfoOpt = await api.query.signaling.proposalOf<Option<ProposalRecord>>(hash);
        if (!proposalInfoOpt.isSome) {
          throw new Error('unable to fetch signaling proposal info');
        }
        const voteInfoOpt = await api.query.voting.voteRecords<Option<VoteRecord>>(proposalInfoOpt.unwrap().vote_id);
        if (!voteInfoOpt.isSome) {
          throw new Error('unable to fetch signaling proposal voting info');
        }
        return {
          excludeAddresses: [ proposer.toString() ],
          data: {
            kind,
            proposer: proposer.toString(),
            proposalHash: hash.toString(),
            voteId: proposalInfoOpt.unwrap().vote_id.toString(),
            title: proposalInfoOpt.unwrap().title.toString(),
            description: proposalInfoOpt.unwrap().contents.toString(),
            tallyType: voteInfoOpt.unwrap().data.tally_type.toString(),
            voteType: voteInfoOpt.unwrap().data.vote_type.toString(),
            choices: voteInfoOpt.unwrap().outcomes.map((outcome) => outcome.toString()),
          }
        };
      }
      case EventKind.SignalingCommitStarted:
      case EventKind.SignalingVotingStarted: {
        const [ hash, voteId, endBlock ] = event.data as unknown as [ Hash, u64, BlockNumber ] & Codec;
        return {
          data: {
            kind,
            proposalHash: hash.toString(),
            voteId: voteId.toString(),
            endBlock: +endBlock,
          }
        };
      }
      case EventKind.SignalingVotingCompleted: {
        const [ hash, voteId ] = event.data as unknown as [ Hash, u64 ] & Codec;
        return {
          data: {
            kind,
            proposalHash: hash.toString(),
            voteId: voteId.toString(),
          }
        };
      }

      /**
       * TreasuryReward events
       */
      case EventKind.TreasuryRewardMinting: {
        const [ pot, reward, blockNum ] = event.data as unknown as [ Balance, Balance, BlockNumber ] & Codec;
        return {
          data: {
            kind,
            pot: pot.toString(),
            reward: reward.toString(),
          }
        };
      }
      case EventKind.TreasuryRewardMintingV2: {
        const [ pot, blockNum, potAddress ] = event.data as unknown as [ Balance, BlockNumber, AccountId ] & Codec;
        return {
          data: {
            kind,
            pot: pot.toString(),
            potAddress: potAddress.toString(),
          }
        };
      }

      /**
       * Identity events
       */
      case EventKind.IdentitySet: {
        const [ who ] = event.data as unknown as [ AccountId ] & Codec;
        const registrationOpt = await api.query.identity.identityOf(who);
        if (!registrationOpt.isSome) {
          throw new Error('unable to retrieve identity info');
        }
        const { info, judgements: judgementInfo } = registrationOpt.unwrap();
        if (!info.display || !info.display.isRaw) {
          throw new Error('no display name set');
        }
        const displayName = info.display.asRaw.toUtf8();
        const judgements: [string, IdentityJudgement][] = [];
        if (judgementInfo.length > 0) {
          const registrars = await api.query.identity.registrars();
          judgements.push(...judgementInfo.map(([ id, judgement ]): [ string, IdentityJudgement ] => {
            const registrarOpt = registrars[+id];
            if (!registrarOpt || !registrarOpt.isSome) {
              throw new Error('invalid judgement!');
            }
            return [ registrarOpt.unwrap().account.toString(), parseJudgement(judgement) ];
          }));
        }
        return {
          excludeAddresses: [ who.toString() ],
          data: {
            kind,
            who: who.toString(),
            displayName,
            judgements,
          }
        };
      }
      case EventKind.JudgementGiven: {
        const [ who, registrarId ] = event.data as unknown as [ AccountId, u32 ] & Codec;
        
        // convert registrar from id to address
        const registrars = await api.query.identity.registrars();
        const registrarOpt = registrars[+registrarId];
        if (!registrarOpt || !registrarOpt.isSome) {
          throw new Error('unable to retrieve registrar info');
        }
        const registrar = registrarOpt.unwrap().account;

        // query the actual judgement provided
        const registrationOpt = await api.query.identity.identityOf(who);
        if (!registrationOpt.isSome) {
          throw new Error('unable to retrieve identity info');
        }
        const judgementTuple = registrationOpt.unwrap().judgements
          .find(([ id, value ]) => +id === +registrarId);
        if (!judgementTuple) {
          throw new Error('unable to find judgement');
        }
        const judgement = parseJudgement(judgementTuple[1]);
        return {
          data: {
            kind,
            who: who.toString(),
            registrar: registrar.toString(),
            judgement,
          }
        };
      }
      case EventKind.IdentityCleared: {
        const [ who ] = event.data as unknown as [ AccountId ] & Codec;
        return {
          excludeAddresses: [ who.toString() ],
          data: {
            kind,
            who: who.toString(),
          }
        };
      }
      case EventKind.IdentityKilled: {
        const [ who ] = event.data as unknown as [ AccountId ] & Codec;
        return {
          data: {
            kind,
            who: who.toString(),
          }
        };
      }
      default: {
        throw new Error(`unknown event type: ${kind}`);
      }
    }
  };

  const extractExtrinsicData = async (extrinsic: Extrinsic): Promise<{
    data: IEventData,
    includeAddresses?: string[],
    excludeAddresses?: string[],
  }> => {
    switch (kind) {
      case EventKind.DemocracySeconded: {
        const voter = extrinsic.signer.toString();
        const [ proposal ] = extrinsic.args as [ Compact<PropIndex> ];
        return {
          excludeAddresses: [ voter ],
          data: {
            kind,
            proposalIndex: +proposal,
            who: voter,
          }
        }
      }
      case EventKind.DemocracyVoted: {
        const voter = extrinsic.signer.toString();
        const [ idx, vote ] = extrinsic.args as [ Compact<ReferendumIndex>, AccountVote ];
        if (vote.isSplit) {
          throw new Error('split votes not supported');
        }
        return {
          excludeAddresses: [ voter ],
          data: {
            kind,
            referendumIndex: +idx,
            who: voter,
            isAye: vote.asStandard.vote.isAye,
            conviction: vote.asStandard.vote.conviction.index,
            balance: vote.asStandard.balance.toString(),
          }
        }
      }

      case EventKind.ElectionCandidacySubmitted: {
        const candidate = extrinsic.signer.toString();
        const section = api.query.electionsPhragmen ? 'electionsPhragmen' : 'elections';
        const round = await api.query[section].electionRounds<u32>();
        return {
          excludeAddresses: [ candidate ],
          data: {
            kind,
            round: +round,
            candidate,
          }
        };
      }
      default: {
        throw new Error(`unknown event type: ${kind}`);
      }
    }
  };

  const eventData = await (isEvent(rawData)
    ? extractEventData(rawData as Event)
    : extractExtrinsicData(rawData as Extrinsic)
  );
  return { ...eventData, blockNumber };
}
