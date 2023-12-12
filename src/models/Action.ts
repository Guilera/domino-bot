import { Side } from "../types"
import { Rock } from "./Rock"

export interface Action {
    rock: Rock
    side: Side
}
