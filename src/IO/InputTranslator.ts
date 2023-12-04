import { Input } from "./Input"
import { Hand } from "../models/Hand"
import { Rock } from "../models/Rock"
import { Table } from "../models/Table"
import { Lado, Pedra } from "../types"

export interface IInputTranslator {
    translate(input: Input): {
        playerId: number
        table: Table
        hand: Hand
    }
}

export class InputTranslator implements IInputTranslator {
    translate(input: Input): {
        playerId: number
        table: Table
        hand: Hand
    } {
        const playerId = input.jogador as number
        const table: Table = {
            rocks: input.mesa.map(pedra => this.pedraToRock(pedra)),
            plays: input.jogadas.map(j => ({
                playerId: j.jogador as number,
                move: this.pedraToRock(j.pedra),
                side: this.ladoToSide(j.lado)
            })),
            openOnLeft: this.pedraToNumber(input.mesa[0])[0],
            openOnRight: this.pedraToNumber(input.mesa[input.mesa.length - 1])[1]

        }
        const hand = new Hand(input.mao.map(p => this.pedraToRock(p)))
        return { playerId, table, hand }
    }

    private pedraToNumber(pedra: Pedra): [number, number] {
        const [n1, n2] = pedra.split("-").map(n => parseInt(n))

        return [n1, n2]
    }

    private pedraToRock(pedra: Pedra): Rock {
        const [n1, n2] = pedra.split("-").map(n => parseInt(n))

        return new Rock(n1, n2)
    }

    private ladoToSide(lado?: Lado): "left" | "right" | undefined {
        return lado === "esquerda"
            ? "left"
            :  lado === "direita"
                ? "right"
                : undefined
    }
}
