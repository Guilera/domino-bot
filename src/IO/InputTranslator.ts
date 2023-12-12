import { Input } from "./Input"
import { Hand } from "../models/Hand"
import { Rock } from "../models/Rock"
import { Table } from "../models/Table"
import { Lado, Pedra } from "../types"

export interface IInputTranslator {
    translateHand(input: Input): Hand
    translateTable(input: Input): Table
    translatePlayerId(input: Input): number
}

export class InputTranslator implements IInputTranslator {

    translateHand(input: Input): Hand {
        const hand = new Hand()
        input.mao.forEach(p => hand.add(this.pedraToRock(p)))

        return hand
    }

    translateTable(input: Input): Table {
        return {
            rocks: input.mesa.map(pedra => this.pedraToRock(pedra)),
            plays: input.jogadas.map(j => {
                const rock = this.pedraToRock(j.pedra);
                const side = this.ladoToSide(j.lado);
                const left = rock.left;
                const right = rock.right;

                return {
                    playerId: j.jogador as number,
                    rock,
                    side,
                    numberOpened: side === "left" ? left : right,
                    numberPlayed: side === "left" ? right : left
                }
            }),
            openOnLeft: this.pedraToRock(input.mesa[0]).left,
            openOnRight: this.pedraToRock(input.mesa[input.mesa.length - 1]).right
        }
    }

    translatePlayerId(input: Input): number {
        return input.jogador as number
    }

    private pedraToRock(pedra: Pedra): Rock {
        const [left, right] = pedra.split("-").map(n => parseInt(n))

        return new Rock(left, right)
    }

    private ladoToSide(lado?: Lado): "left" | "right" | undefined {
        return lado === "esquerda"
            ? "left"
            :  lado === "direita"
                ? "right"
                : undefined
    }
}
