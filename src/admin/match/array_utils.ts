declare global {
    interface Array<T> {
        remove(idx: number): T | undefined;
        removeElem(elem: T, predicate?: (e1: T, e2: T) => boolean): T | undefined;
        shuffle(): Array<T>;
        intersection(other: Array<T>, predicate?: (e1: T, e2: T) => boolean): Array<T>;
        copy(): Array<T>;
        contains(elem: T, predicate?: (e1: T, e2: T) => boolean): boolean;
        randomElement(): T;
    }
}

  
Array.prototype.remove = function<T>(idx: number): T | undefined {
    if (idx >= this.length) {
        return undefined
    }

    return this.splice(idx, 1)[0]
}

Array.prototype.removeElem = function<T>(elem: T, predicate?: (e1: T, e2: T) => boolean): T | undefined {
    const idx = predicate !== undefined 
        ? this.find(v => predicate(v, elem))
        : this.indexOf(elem)
        
    if (idx === -1) return undefined
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
export function intersection<T>(a1: Array<T>, a2: Array<T>, predicate?: (e1: T, e2: T) => boolean): Array<T> {
    return a1.filter(v => a2.contains(v, predicate))
}

Array.prototype.intersection = function<T>(other: Array<T>, predicate?: (e1: T, e2: T) => boolean): Array<T> {
    return intersection(this, other, predicate)
}

Array.prototype.copy = function<T>(): Array<T> {
    return [...this]
}

Array.prototype.contains = function<T>(elem: T, predicate?: (e1: T, e2: T) => boolean): boolean {
    if (predicate === undefined) {
        return this.find(v => elem === v) !== undefined
    } else {
        return this.find(v => predicate(elem, v)) !== undefined
    }
}

Array.prototype.randomElement = function<T>(): T {
    return this[Math.floor(Math.random() * this.length)]
}