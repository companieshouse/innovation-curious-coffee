import chai from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import { matchService } from "../../../src/admin/match/MatchService";
import { Participant } from "../../../src/participant/ParticipantModel";

const expect = chai.expect;
chai.use(sinonChai);

function createParticipant(
    name: string,
    department: string,
    networks: string[],
    perviouslyMatchedEmails: string[]
): Partial<Participant> {
    return {
        name: name,
        email: `${name}@email.com`,
        department: department,
        networks: networks,
        matches: perviouslyMatchedEmails,
    };
}

function createMatchingPair(): [Participant, Participant] {
    return [
        createParticipant("P1", "departmentA", ['default'], []),
        createParticipant("P2", "departmentB", ['default'], [])
    ] as [Participant, Participant]
}

describe("matchService", function () {
    // This test just ensures that a a pair that should match, do. 
    // Therefore, other tests cna modify a single aspect of the participants and test it 
    // in isolation, knowing that the only thing that could have prevented a match is the
    // thing that was changed.
    it("Matches people it should", function() {
        const matchingPair = createMatchingPair() 

        const {matches, unmatched} = matchService.createMatches(matchingPair)
        expect(matches.length).to.equal(1, "The pair should fit all rules and so should match")
        expect(unmatched.length).to.equal(0, "There should be no unmatched pairs")
    })

    it("Does not match people in the same department", function () {
        const [p1, p2] = createMatchingPair()

        p2.department = p1.department

        const {matches, unmatched} = matchService.createMatches([p1, p2])
        expect(matches.length).to.equal(0, "The pair should not have matched as they are in different departments")
        expect(unmatched.length).to.equal(1, "The pair should remain unmatched as they are in different departments")
    });

    it("Does not match people who have perviously matched", function() {
        const [p1, p2] = createMatchingPair()

        p1.matches.push(p2.email)

        const {matches, unmatched} = matchService.createMatches([p1, p2])
        expect(matches.length).to.equal(0, "The pair should not have matched as they have matched before")
        expect(unmatched.length).to.equal(1, "The pair should remain unmatched as they have matches before")
    })

    it("Only matches people with a common network", function() {
        const [p1, p2] = createMatchingPair()

        p1.networks = ['network1']
        p2.networks = ['network2']

        const {matches, unmatched} = matchService.createMatches([p1, p2])
        expect(matches.length).to.equal(0, "The pair should not have matched as they do not share a common network")
        expect(unmatched.length).to.equal(1, "The pair should remain unmatched as they do not share a common network")
    })
});
