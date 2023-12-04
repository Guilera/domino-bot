import { Play } from "./Play";
import { Rock } from "./Rock";

export interface Table {
    openOnRight: number
    openOnLeft: number
    rocks: Rock[]
    plays: Play[]
}
