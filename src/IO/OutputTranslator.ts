import { Rock } from "../models/Rock";
import { Output } from "./Output";
import { Lado, Pedra } from "../types";

export interface IOutputTranslator {
    translate(move?: {rock: Rock, side: "left" | "right"}): Output
}

export class OutputTranslator implements IOutputTranslator {
    translate(move?: {rock: Rock, side: "left" | "right"}): Output {
        return move ? {
            pedra: this.rockToPedra(move.rock),
            lado: this.sideToLado(move.side)
        } : {}
    }

    private rockToPedra(rock: Rock): Pedra {
        return `${rock.right}-${rock.left}`
    }

    private sideToLado(side: "left" | "right"): Lado {
        return side === "left"
            ? "esquerda"
            : "direita"
    }
}
