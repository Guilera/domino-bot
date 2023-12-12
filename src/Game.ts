import { Action } from "./models/Action";
import { Hand } from "./models/Hand";
import { NumberMatrix } from "./models/NumberMatrix";
import { Possibility } from "./models/Possibility";
import { Rock } from "./models/Rock";
import { Table } from "./models/Table";
import { openCornerStrategy } from "./strategies/openCorner";
import { Side } from "./types";

export interface IGame {
    play(): Action | undefined
}

export class Game implements IGame {
    private readonly partnerId: number;
    private readonly opponentAfterMe: number;
    private readonly opponentBeforeMe: number;
    private readonly numberMatrix: NumberMatrix = new NumberMatrix();
    private readonly playersMissingNumbers: {
        opponentBefore: Set<number>;
        opponentAfter: Set<number>;
        partner: Set<number>;
    } = {
        opponentBefore: new Set(),
        opponentAfter: new Set(),
        partner: new Set()
    }
    private partnerLastNumberOpened: number | undefined = undefined;
    private currentTurn = 0;
    private openOnLeft = 6;
    private openOnRight = 6;
    private isFirstRound;
    private table: Table;
    private readonly playerPosition: {
        [playerId: number]: number;
    } = {
        1: -1,
        2: -1,
        3: -1,
        4: -1
    }

    constructor(
        private readonly playerId: number,
        private readonly hand: Hand,
        table: Table
    ) {
        this.partnerId = Game.getPartnerId(playerId);
        this.opponentAfterMe = Game.getNextPlayer(playerId);
        this.opponentBeforeMe = Game.getOpponentBeforeMe(playerId);
        this.isFirstRound = this.openOnLeft === 6 && this.openOnRight === 6;
        this.table = table;
        this.analyzePlays();
    }

    setTable(table: Table) {
        this.table = table;
        this.analyzePlays();
    }

    play(): Action | undefined {
        const options = this.getPossibilities();

        console.log("OPTIONS", options);

        if (options.length === 0) {
            return;
        }

        const possibility = this.chooseBetweenStrategy(options);

        if (possibility) {
            return {
                rock: possibility.rock,
                side: possibility.side
            }
        }
    }

    private chooseBetweenStrategy(options: Possibility[]): Possibility | undefined  {
        if (options.length === 1) {
            return options[0];
        }

        const openCorner = openCornerStrategy(options, this.numberMatrix, this.hand);

        if (openCorner) {
            return openCorner;
        }

        return options[0];
    }

    private getPossibilities(): Possibility[] {
        return [
            ...this.hand.getRocksWithNumber(this.openOnLeft)
                .map(rock => Game.rockToPossibility(rock, this.openOnLeft, "left")),
            ...this.hand.getRocksWithNumber(this.openOnRight)
                .map(rock => Game.rockToPossibility(rock, this.openOnRight, "right"))
        ]
    }

    private decideWhichSide(rock: Rock): Action {
        const side = rock.haveNumber(this.table.openOnLeft)
            ? "left"
            : "right";

        return {
            rock,
            side
        }
    }

    private haveAllRemainingRocks(n: number): boolean {
        const manyOnMyHand = this.hand.howManyWithNumber(n);

        if (manyOnMyHand === 0) {
            return false;
        }

        const manyPlayed = this.numberMatrix.alreadyPlayed(n);

        const doIHaveAll = manyOnMyHand + manyPlayed === 7;

        if (doIHaveAll) {
            console.log(`HAVE_ALL_REMAINING_ROCKS FROM ${n} WITH ${manyOnMyHand} ON HAND AND ${manyPlayed} PLAYED`);
        }

        return doIHaveAll;
    }

    private dominateSideStrategy(options: Rock[]): Action | undefined {
        const [rockToDominate] = options.filter(rock => {
            const willOpenOnLeft = this.table.openOnLeft === rock.left ? rock.right : rock.left;
            this.haveAllRemainingRocks(rock.left)
            || this.haveAllRemainingRocks(rock.right)
        }
            );

        if (rockToDominate) {
            return this.decideWhichSide(rockToDominate)
        }
    }

    private assistStrategy(options: Rock[]): Action | undefined {
        if (this.partnerLastNumberOpened) {
            const [rockToAssist] = options.filter(rock => rock.haveNumber(this.partnerLastNumberOpened));

            if (rockToAssist) {
                return this.decideWhichSide(rockToAssist)
            }
        }
    }

    private forceOpponentToPassStrategy(options: Rock[]): Action | undefined {
        const passOptions = options.filter(rock =>
            this.playersMissingNumbers.opponentAfter.has(rock.left)
                || this.playersMissingNumbers.opponentAfter.has(rock.right)
                || this.playersMissingNumbers.opponentBefore.has(rock.left)
                || this.playersMissingNumbers.opponentBefore.has(rock.right)
        )

        if (passOptions.length) {

            passOptions.sort((a, b) =>
                Math.min(this.numberMatrix.availableToPlay(a.left), this.numberMatrix.availableToPlay(a.right))
                    - Math.min(this.numberMatrix.availableToPlay(b.left), this.numberMatrix.availableToPlay(b.right))
            );

            return this.decideWhichSide(passOptions[0]);
        }
    }

    private manyRocksStrategy(options: Rock[]): Action | undefined {
        options.sort((a, b) =>
            this.hand.howManyWithNumber(b.left) + this.hand.howManyWithNumber(b.right)
            - this.hand.howManyWithNumber(a.left) - this.hand.howManyWithNumber(a.right)
        )

        return this.decideWhichSide(options[0]);
    }

    private analyzePlays() {
        let supposedPlayer = this.isFirstRound ? this.table.plays[0].playerId : this.playerId;
        const turnsToAnalyze = this.isFirstRound ? this.table.plays.length : 4;

        console.log("TURNSTOANALYZE", turnsToAnalyze);

        while (this.currentTurn < turnsToAnalyze) {
            const play = this.table.plays[this.currentTurn];

            if (supposedPlayer !== play?.playerId) {
                console.log(`PLAYER ${supposedPlayer} DEU UM PASSE`)

                if (supposedPlayer === this.partnerId) {
                    this.playersMissingNumbers.partner.add(this.openOnLeft);
                    this.playersMissingNumbers.partner.add(this.openOnRight);
                } else if (supposedPlayer === this.opponentAfterMe) {
                    this.playersMissingNumbers.opponentAfter.add(this.openOnLeft);
                    this.playersMissingNumbers.opponentAfter.add(this.openOnRight);
                } else if (supposedPlayer === this.opponentBeforeMe) {
                    this.playersMissingNumbers.opponentBefore.add(this.openOnLeft);
                    this.playersMissingNumbers.opponentBefore.add(this.openOnRight);
                }
            } else {
                this.numberMatrix.markRock(play.rock);

                if (play.side === "left") {
                    this.openOnLeft = play.numberOpened;
                } else if (play.side === "right") {
                    this.openOnRight = play.numberOpened;
                }
                this.currentTurn++;
            }

            supposedPlayer = Game.getNextPlayer(supposedPlayer);
        };

        this.isFirstRound = false;
        this.currentTurn = this.table.plays.length;
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

    private static getNextPlayer(playerId: number): number {
        if (playerId === 4) {
            return 1;
        }

        return playerId + 1;
    }

    private static getOpponentBeforeMe(playerId: number): number {
        if (playerId === 1) {
            return 4;
        }

        return playerId - 1;
    }

    private static rockToPossibility(rock: Rock, numberOpen: number, side: Side): Possibility {
        return {
            rock,
            willClose: numberOpen,
            willOpen: rock.left === numberOpen ? rock.right : rock.left,
            side
        }
    }
}
