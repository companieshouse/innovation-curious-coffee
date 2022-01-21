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

function createMatch(p1: Participant, p2: Participant): Match;
function createMatch(participants: Participant[]): Match;
function createMatch(a1: Participant | Participant[], a2?: Participant): Match {
    if (a1 instanceof Array) {
        if (a1.length < 2) throw `Need 2 participants to create match`
        return {
            participant_1: a1[0],
            participant_2: a1[1],
        }
    }

    if (a2 === undefined) throw `Need 2 participants to create match. Second argument cannot be undefined`
    return {
        participant_1: a1,
        participant_2: a2,
    }
}

export type MatchRule = {
    debugMessage: string, 
    predicate: (participant1: Participant, participant2: Participant) => boolean,
}

// GreedyMatchService is an implementation of the MatchService usign a greedy algorithm to match participants.
// The greedy algorithm matches each participant with the first other participant it finds which matches the criteria
// this isn't optimal (in terms of performance or finding the most optimal matches), but it works fine.
export class GreedyMatchService implements MatchService {
    private rules: Array<MatchRule>

    constructor(rules: Array<MatchRule>) {
        this.rules = rules
    }

    // creates matches using a greedy algorithm to find the first 
    createMatches(participants: Array<Participant>): MatchResult {
        participants = participants.shuffle().copy();

        const result : MatchResult = {
            matches: [],
            unmatched: [],
        }

        const unmatched = Array.from({length: participants.length}, (_, i) => i)
        
        outerLoop:
        while (unmatched.length > 0) {
            const idx = unmatched.pop()!
            const currentParticipant = participants[idx]
            const canMatch = this.combineRulePrecicates(currentParticipant)
            
            
            for (let i = 0; i < unmatched.length; i++) {
                if (canMatch(participants[i])) {
                    result.matches.push(createMatch(currentParticipant, participants[i]))
                    const removed = unmatched.removeElem(unmatched[i])
                    if (removed === undefined) debugger
                    continue outerLoop
                }
            }

            result.unmatched.push(currentParticipant)
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


function randomInteger(from: number, to: number) {
    return Math.ceil(from) + Math.floor(Math.random() * (Math.floor(to) - from))
}

export const defaultRules : Array<MatchRule> = [
    {
        debugMessage: "Particpants connot match within the same department are in the same department",
        predicate: (p1, p2) => p1.department !== p2.department,
    },
    {
        debugMessage: "Participants cannot be matched with someone they have previously matched with",
        predicate: (p1, p2) => !p1.matches.contains(p2.email) && !p2.matches.contains(p1.email),
    },
    {
        debugMessage: "Participants can only match someone who is in a common network",
        predicate: (p1, p2) => p1.networks.hasIntersection(p2.networks), // TODO: this
    }
]


export const matchService = new GreedyMatchService(defaultRules)