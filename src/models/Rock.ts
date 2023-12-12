export class Rock {
    readonly isDoubled: boolean;
    readonly left: number;
    readonly right: number;

    constructor(
        left: number,
        right: number
    ) {
        this.left = left;
        this.right = right;
        this.isDoubled = this.left === this.right;
    }

    equals(rock: Rock): boolean {
        return this.same(rock) || this.same(rock.revert());
    }

    toString(): string {
        return `[${this.right}-${this.left}]`;
    }

    haveNumber(n?: number): boolean {
        return this.left === n || this.right === n;
    }

    private same(rock: Rock): boolean {
        return this.left === rock.left && this.right === rock.right;
    }

    private revert(): Rock {
        return new Rock(this.right, this.left);
    }
}
