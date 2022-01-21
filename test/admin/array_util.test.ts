import chai from "chai";
import sinonChai from "sinon-chai";
import '../../src/admin/match/array_utils'
import logger from '../../src/logger'

const expect = chai.expect;
chai.use(sinonChai);

describe("array.remove", function() {
    it("returns undefined when out of range", function() {
        const a = [1, 2, 3]

        const r = a.remove(4)

        expect(r).to.be.undefined
    })

    it("returns the value removed", function() {
        const a = [1, 2, 3]
        const r = a.remove(0)

        expect(r).to.equal(1)
    })

    it("removes the value from the array", function() {
        const a = [1, 2, 3]
        a.remove(0)

        expect(a).to.be.deep.equal([2, 3])
    })
})

describe("array.removeElem", function() {
    it("returns undefined when the elem is not found", function() {
        const a = [1, 2, 3]
        const r = a.removeElem(42)

        expect(r).to.be.undefined
    })

    it("returns the value removed", function() {
        const a = [1, 2, 3]
        const r = a.removeElem(2)

        expect(r).to.equal(2)
    })

    it("removes the element from the array", function() {
        const a = [1, 2, 3]
        a.removeElem(2)

        expect(a).to.deep.equal([1, 3])
    })

    it("compares equality of reference types be reference by default", function() {
        const a = [{a: 1}]
        const r = a.removeElem({...a[0]})
        expect(r).to.be.undefined
        expect(a.removeElem(a[0])).to.not.be.undefined
    })

    it("can compare equality with a predicate", function() {
        const a = [{a: 1}]
        const r = a.removeElem({a: 1}, (e1, e2) => JSON.stringify(e1) === JSON.stringify(e2))

        expect(r).to.deep.equal({a: 1})
    })
})

describe("array.shuffle", function() {
    it("changes the order of the array", function() {
        // If the order changes the JSON will not match
        const a = Array.from({length: 100}, (_, i) => i)
        const before = JSON.stringify(a)
        a.shuffle()
        expect(JSON.stringify(a)).to.not.equal(before)
    })

    it("it modifies the array in place", function() {
        const a = [1, 2, 3]
        
        const r = a.shuffle()

        expect(r).equal(a)
    })
})

describe("array.intersection", function() {
    it("calculates the elements common in both arrays", function() {
        const a = [1, 2, 3]
        const b = [3, 4, 5]

        expect(a.intersection(b)).to.deep.equal([3])
    })

    it("creates a new copy of the array", function() {
        const a = [1, 2, 3]
        const b = [3, 4, 5]

        const r = a.intersection(b)
        
        expect(a).to.not.eq(r)
        expect(b).to.not.eq(r)
    })

    it("compares reference objects be reference by default", function() {
        const a = [{a: 1}]
        const b = [{...a[0]}]

        const r = a.intersection(b)

        expect(r.length).to.equal(0)
        expect(a.intersection(a).length).to.equal(1)
    })

    it("can use a predicate to compare element equality", function() {
        const a = [{a: 1}]
        const b = [{a: 1}]

        const r = a.intersection(b, (e1, e2) => JSON.stringify(e1) === JSON.stringify(e2))

        expect(r.length).to.equal(1)
    })
})

describe("array.copy", function() {
    it("creates a new copy of the array", function() {
        const a = [1, 2, 3]
        const c = a.copy()

        expect(a).to.not.eq(c)
    })

    it("maintains the order of the array", function() {
        const a = [1, 2, 3]
        const c = a.copy()

        expect(JSON.stringify(a)).to.equal(JSON.stringify(c))
    })
})

describe("array.contains", function() {
    it("returns true if the element is in the array", function() {
        const a = [1, 2, 3]
        const c = a.contains(2)

        expect(c).to.be.true
    })

    it("returns false if the element is not in the array", function*() {
        const a = [1, 2, 3]
        const c = a.contains(42)

        expect(c).to.be.false
    })

    it("compares references for reference types", function() {
        const a = [{a: 1}, {b: 2}, {c: 3}]

        expect(a.contains({...a[0]})).to.be.false
        expect(a.contains(a[0])).to.be.true
    })

    it("can use a predicate to compare elements", function() {
        const a: Object[] = [{a: 1}, {b: 2}, {c: 3}]

        function predicate(a1: Object, a2: Object): boolean {
            return JSON.stringify(a1) === JSON.stringify(a2)
        }

        expect(a.contains({a: 1})).to.be.false 
        expect(a.contains({a: 1}, predicate)).to.be.true
    })
})

describe("array.randomElement", function() {
    it("returns an element from the array", function() {
        const a = [1, 2, 3]
        const re = a.randomElement()

        expect(a.contains(re)).to.be.true
    })
})

describe("array.hasIntersection", function() {
    it("returns true when there is a common element in both arrays", function() {
        const a = [1, 2, 3]
        const b = [3, 4, 5]

        expect(a.hasIntersection(b)).to.be.true
    })

    it("returns false when the elements do not have a common element", function() {
        const a = [1, 2, 3]
        const b = [4, 5, 6]

        expect(a.hasIntersection(b)).to.be.false
    })

    function randomInt(to: number) {
        return Math.floor(Math.random() * to)
    }

    function randomIntArray(l: number) {
        return Array.from({length: l}, () => randomInt(Number.MAX_SAFE_INTEGER))
    }

    it("completes quickly", function() {
        const a = randomIntArray(10_000)
        const b = randomIntArray(10_000)

        const timerName = "array.hasIntersection"
        console.time(timerName)

        a.hasIntersection(b)

        console.timeEnd(timerName)
    })
})