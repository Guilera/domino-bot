import { Strategy } from "../models/Strategy";

export const openCornerStrategy: Strategy = (
    possibilities,
    numberMatrix,
    hand
) => {
    return possibilities.find(possibility => {
        const manyOnTable = numberMatrix.alreadyPlayed(possibility.willOpen)
        const manyOnHand = hand.howManyWithNumber(possibility.willOpen)

        const result = manyOnTable + manyOnHand === 7
            && manyOnHand > 1

        if (result) {
            console.log(`HAVE_ALL_REMAINING_ROCKS FROM ${possibility.willOpen} WITH ${manyOnHand} ON HAND AND ${manyOnTable} PLAYED. OPENING A CORNER ON ${possibility.side}`);
        }
        return result;
    })
}
