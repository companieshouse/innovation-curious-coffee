import chai from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import {performance} from 'perf_hooks'

import { matchService } from "../../../src/admin/match/MatchService";
import { Participant } from "../../../src/participant/ParticipantModel";
import logger from "../../../src/logger"

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
        expect(unmatched.length).to.equal(2, "The pair should remain unmatched as they are in different departments")
    });

    it("Does not match people who have perviously matched", function() {
        const [p1, p2] = createMatchingPair()

        p1.matches.push(p2.email)

        const {matches, unmatched} = matchService.createMatches([p1, p2])
        expect(matches.length).to.equal(0, "The pair should not have matched as they have matched before")
        expect(unmatched.length).to.equal(2, "The pair should remain unmatched as they have matches before")
    })

    it("Only matches people with a common network", function() {
        const [p1, p2] = createMatchingPair()

        p1.networks = ['network1']
        p2.networks = ['network2']

        const {matches, unmatched} = matchService.createMatches([p1, p2])
        expect(matches.length).to.equal(0, "The pair should not have matched as they do not share a common network")
        expect(unmatched.length).to.equal(2, "The pair should remain unmatched as they do not share a common network")
    })
});


function createRandomParticipant() {
    const networks = ['default_network', ...Array.from({length: 3}, (_, i) => `${i}`)]
    const departments = Array.from({length: 10}, (_, i) => `${i}`)

    function randomInt(from: number, to: number) {
        return from + Math.floor(Math.random() * (to - from))
    }

    function randomChoice<T>(a: Array<T>) {
        return a[randomInt(0, a.length)]
    }

    const alpha = `abcdefghijklmnopqrstuvwxyz`
    function randomString(l: number, chars: string[] = alpha.split('')) {
        return Array.from({length: l}, () => randomChoice(chars)).join('')
    }

    function randomName() {
        const len = 5 + Math.floor(Math.random() * 5)
        return randomString(len)
    }

    function randomSelection<T>(choices: Array<T>, n: number) {
        return [...new Set(Array.from({length: n}, () => randomChoice(choices)))]
    }


    return createParticipant(randomName(), randomChoice(departments), randomSelection(networks, randomInt(1, networks.length)), [])
}

function formatTime(ms: number) {
    if (ms < 1000) return `${ms} ms`

    const units = {
        'm': 60 * 1000,
        's': 1000,
        'ms': 1,
    }

    let s = ''
    for (const [unit, nms] of Object.entries(units)) {
        const n = Math.floor(ms / nms)
        if (n === 0) continue

        s += `${n} ${unit} `
        ms = ms % nms 
    }

    return s
}

function simulateMatches(rounds: number, participants: Participant[]) {
    for (let i = 0; i < rounds; i++) {
        const {matches, unmatched} = matchService.createMatches(participants as Participant[])
        matches.forEach(({participant_1, participant_2}) => {
            participant_1.matches.push(participant_2.email)
            participant_2.matches.push(participant_1.email)
        })
    }
}

describe("matchBench", function() {
    const N = 100
    const particpants = Array.from({length: N}, () => createRandomParticipant()) as Participant[]
    // After 60 rounds the match rate will be around 20 - 30 %
    simulateMatches(60, particpants)

    it(`Can match ${N} participants in a reasonable amount of time`, function() {
        const np = particpants.length
        
        const startTime = performance.now()

        const {matches, unmatched} = matchService.createMatches(particpants)

        logger.info(`${matches.length * 2}/${particpants.length} matched ${unmatched.length}/${particpants.length}  unmatched`)
        logger.info(`${np} participants`)

        const duration = performance.now() - startTime
        logger.info(`Matched ${N} participants in ${formatTime(duration)}`)
        expect(duration).to.be.lessThan(1000, `Took over one second to match ${N} participants`)
        expect(matches.length * 2 + unmatched.length).to.equal(N, "The total number of participants should not have changed")
    })
})