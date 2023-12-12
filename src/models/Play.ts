import { Rock } from "./Rock"

export interface PlayLog {
    playerId: number
    rock: Rock
    side?: "left" | "right"
    numberPlayed: number
    numberOpened: number
}
