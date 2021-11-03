import { InterfaceMatch } from "../../models/match";
import { Match } from "./MatchService";
import MongoMatch from "../../models/match"

export interface MatchRepository {
    saveMatches(matches: Array<Match>): void
}

export class MongoMatchRepository implements MatchRepository {
    saveMatches(matches: Match[]): void {
        matches.forEach((match) => {
            new MongoMatch(match).save()
        })
    }
}