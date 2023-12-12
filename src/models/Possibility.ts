import { Side } from "../types"
import { Rock } from "./Rock"

export interface Possibility {
    rock: Rock
    willOpen: number
    willClose: number
    side: Side
}
