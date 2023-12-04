import { Hand } from "./models/Hand";
import { Rock } from "./models/Rock";
import { Table } from "./models/Table";

export interface IGamer {
    play(): {
        rock: Rock
        side: "left" | "right"
    } | undefined
}

export class Gamer implements IGamer {
    private readonly partnerId: number;
    constructor(
        playerId: number,
        private readonly hand: Hand,
        private readonly table: Table
    ) {
        this.partnerId = Gamer.getPartnerId(playerId);
    }

    play(): { rock: Rock; side: "left" | "right"; } | undefined {
        if (this.canPlay("left")) {
            return {
                rock: this.hand.withNumber(this.table.openOnLeft)[0],
                side: "left"
            }
        }

        if (this.canPlay("right")) {
            return {
                rock: this.hand.withNumber(this.table.openOnRight)[0],
                side: "right"
            }
        }
    }

    private canPlay(side: "left" | "right"): boolean {
        const openNumber = side === "left" ? this.table.openOnLeft : this.table.openOnRight;

        return this.hand.withNumber(openNumber).length > 0;
    }

    private partnerCalled(): number | undefined {
        if (this.table.plays.length < 3) {
            return undefined;
        }

        const lastPlay = this.table.plays[this.table.plays.length - 2];
        lastPlay.move.
    }

    private static getPartnerId(playerId: number): number {
        switch (playerId) {
            case 1:
                return 3;
            case 2:
                return 4;
            case 3:
                return 1;
            case 4:
                return 2;
            default:
                throw new Error("Invalid player id");
        }
    }

}
