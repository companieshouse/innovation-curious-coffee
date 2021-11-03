import { Participant } from "../../participant/ParticipantModel";
import "./array_utils"
import logger from '../../logger';


export interface MatchService {
    createMatches(participants: Array<Participant>): MatchResult
}

export interface MatchResult {
    matches: Array<Match>,
    unmatched: Array<Participant>,
}

export type Match = {
    participant_1: Participant,
    participant_2: Participant,
}

export type MatchRule = {
    debugMessage: string, 
    predicate: (participant1: Participant, participant2: Participant) => boolean,
}

export class GreedyMatchService implements MatchService {
    private rules: Array<MatchRule>

    constructor(rules: Array<MatchRule>) {
        this.rules = rules
    }

    createMatches(participants: Array<Participant>): MatchResult {
        // shuffle
        participants.shuffle();

        const result : MatchResult = {
            matches: [],
            unmatched: [],
        }

        for (let i = 0; i < participants.length; i++) {
            const currentParticipant = participants.remove(i);
            if (currentParticipant === undefined) {
                break;
            }

            logger.debug(`Attempting to find match for ${currentParticipant.email}`)

            // Find match from remaining participants
            // WARNING: this runs in O(n) time within a loop, making this method run in O(n^2). This could easily cause performance issues
            const maybeMatch = participants.find(this.combineRulePrecicates(currentParticipant))
            if (maybeMatch !== undefined) {
                logger.debug(`Matched with: ${maybeMatch.email}`)
                // Remove match so they're not matched with anyone else
                participants.removeElem(maybeMatch)
                result.matches.push({
                    participant_1: currentParticipant, 
                    participant_2: maybeMatch,
                })
            } else {
                logger.debug(`No match found for ${currentParticipant.email}`)
                result.unmatched.push(currentParticipant)
            }
        }

        return result
    }

    private combineRulePrecicates(currentParticipant: Participant): (participant: Participant) => boolean {
        return otherParticipant => {
            for (let rule of this.rules) {
                if (!rule.predicate(currentParticipant, otherParticipant)) {
                    logger.debug(`Unable to match because: ${rule.debugMessage}`)
                    return false
                }
            }

            return true
        }
    }
}

export const defaultRules : Array<MatchRule> = [
    {
        debugMessage: "Particpants connot match within the same department are in the same department",
        predicate: (p1, p2) => p1.department !== p2.department,
    },
    {
        debugMessage: "Participants cannot be matched with someone they have previously matched with",
        predicate: (p1, p2) => !p1.matches.contains(p2.email),
    },
    {
        debugMessage: "Participants can only match someone who is in a common network",
        predicate: (p1, p2) => p1.networks.intersection(p2.networks).length > 0, // TODO: this
    }
]


export const matchService = new GreedyMatchService(defaultRules)