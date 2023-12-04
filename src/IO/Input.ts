import { Jogador, Lado, Pedra } from "../types"

export interface Input {
    jogador: Jogador
    mao: Pedra[]
    mesa: Pedra[]
    jogadas: Array<{
        jogador: Jogador
        pedra: Pedra
        lado?: Lado
    }>
}
