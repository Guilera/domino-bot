import { Hand } from "./Hand";
import { NumberMatrix } from "./NumberMatrix";
import { Possibility } from "./Possibility";

export type Strategy = (
    Possibilities: Possibility[],
    numberMatrix: NumberMatrix,
    hand: Hand
) => Possibility | undefined;
