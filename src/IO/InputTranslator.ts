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
            plays: input.jogadas.map(j => {
                const rock = this.pedraToRock(j.pedra);
                const side = this.ladoToSide(j.lado);

                return {
                    playerId: j.jogador as number,
                    move: rock,
                    side,
                    wasOpen: side ? rock[side] : rock.left
                }
            }),
            openOnLeft: this.pedraToRock(input.mesa[0]).left,
            openOnRight: this.pedraToRock(input.mesa[input.mesa.length - 1]).right

        }
        const hand = new Hand(input.mao.map(p => this.pedraToRock(p)))
        return { playerId, table, hand }
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
