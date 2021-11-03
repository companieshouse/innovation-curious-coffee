declare global {
    interface Array<T> {
        remove(idx: number): T | undefined;
        removeElem(elem: T): T | undefined;
        shuffle(): Array<T>;
        intersection(other: Array<T>): Array<T>;
        copy(): Array<T>;
        contains(elem: T): boolean;
    }
}

  
Array.prototype.remove = function<T>(idx: number): T | undefined {
    if (idx >= this.length) {
        return undefined
    }

    return this.splice(idx, 1)[0]
}

Array.prototype.removeElem = function<T>(elem: T): T | undefined {
    const idx = this.indexOf(elem)
    return this.remove(idx)
}

Array.prototype.shuffle = function<T>(): Array<T> {
    let currentIndex = this.length,
        temporaryValue,
        randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = this[currentIndex];
        this[currentIndex] = this[randomIndex];
        this[randomIndex] = temporaryValue;
    }

    return this;
}

// intersection([1, 2], [2, 3]) => [2]
export function intersection<T>(a1: Array<T>, a2: Array<T>): Array<T> {
    return a1.filter(v => a2.includes(v))
}

Array.prototype.intersection = function<T>(other: Array<T>): Array<T> {
    return intersection(this, other)
}

Array.prototype.copy = function<T>(): Array<T> {
    return [...this]
}

Array.prototype.contains = function<T>(elem: T): boolean {
    return this.find(v => elem === v) !== undefined
}