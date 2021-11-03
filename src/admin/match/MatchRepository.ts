import { InterfaceMatch } from "../../models/match";
import { Match } from "./MatchService";
import MongoMatch from "../../models/match"

export interface MatchRepository {
    saveMatches(matches: Array<Match>): void
}

export class MongoMatchRepository implements MatchRepository {
    async saveMatches(matches: Match[]): Promise<unknown[]> {
        const promises = matches.map(async ({participant_1: person_1, participant_2: person_2}) => {
            await new MongoMatch({person_1, person_2}).save()
        })

        return Promise.all(promises)
    }
}