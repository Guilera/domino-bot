import { Rock } from "./Rock";

export class Hand {
    constructor(
        readonly rocks: Rock[]
    ) {}

    add(rock: Rock): void {
        this.rocks.push(rock);
    }

    withNumber(n: number): Rock[] {
        return this.rocks.filter((r) => r.left === n || r.right === n);
    }

    pick(rock: Rock): Rock | undefined {
        const index = this.rocks.findIndex((r) => r.equals(rock));

        if (index === -1) {
            return undefined;
        }

        return this.rocks.splice(index, 1)[0];
    }
}
