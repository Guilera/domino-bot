import { Rock } from "./Rock";

export class NumberMatrix {
    private matrix: boolean[][];

    constructor() {
        this.matrix = new Array(7).fill(false).map(() => new Array(7).fill(false));
    }

    markRock(rock: Rock) {
        this.matrix[rock.left][rock.right] = true;
        this.matrix[rock.right][rock.left] = true;
    }

    alreadyPlayed(num: number) {
        return this.matrix[num].filter((value) => value === true).length;
    }

    availableToPlay(num: number) {
        return this.matrix[num].filter((value) => value === false).length;
    }
}
