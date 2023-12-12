import { Rock } from "./Rock";

export class Hand {
    private readonly rocks: Rock[] = [];
    private readonly numberCounter: Map<number, number> = new Map();

    add(rock: Rock): void {
        this.rocks.push(rock);
        this.incrementNumberCounter(rock.left);

        if (!rock.isDoubled) {
            this.incrementNumberCounter(rock.right);
        }
    }

    howManyWithNumber(n: number): number {
        return this.numberCounter.get(n) || 0;
    }

    getRocksWithNumber(n: number): Rock[] {
        return this.rocks.filter(rock => rock.haveNumber(n));
    }

    popRock(rock: Rock): Rock | undefined {
        const index = this.rocks.findIndex((r) => r.equals(rock));

        if (index === -1) {
            return undefined;
        }

        return this.rocks.splice(index, 1)[0];
    }

    private incrementNumberCounter(num: number) {
        this.numberCounter.set(num, (this.numberCounter.get(num) || 0) + 1);
    }
}
