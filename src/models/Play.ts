import { Rock } from "./Rock"

export interface Play {
    playerId: number
    move: Rock
    side?: "left" | "right"
    wasOpen: number
}
