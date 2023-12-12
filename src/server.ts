import { createServer, type Server } from "http";
import { Input, IInputTranslator, IOutputTranslator, Output } from "./IO";
import { Game } from "./Game";

interface IDominoServer {
    start(port: number): void;
}

export class DominoServer implements IDominoServer {
    private server: Server;
    private game?: Game;
    private playerId?: number;

    constructor(
        private inputTranslator: IInputTranslator,
        private outputTranslator: IOutputTranslator,
    ) {
        this.server = createServer((req, res) => {
            if (req.method !== "POST") {
                res.writeHead(405, { "Content-Type": "text/json" });
                res.end("Method not allowed");
                return;
            } else {
                let body = "";
                req.on("data", data => body += data )
                req.on("end", () => {
                    const input = JSON.parse(body) as Input;

                    const playerId = this.inputTranslator.translatePlayerId(input);

                    if (!this.playerId){
                        this.playerId = playerId;
                        console.log("Player ID", playerId);
                    }

                    const table = this.inputTranslator.translateTable(input);

                    const hand = this.inputTranslator.translateHand(input);
                    this.game = new Game(playerId, hand, table);
                    try {
                        const action = this.game.play();
                        const output = this.outputTranslator.translate(action);

                        res.writeHead(200, { "Content-Type": "text/json" });
                        res.end(JSON.stringify(output));
                    } catch (e) {
                        res.writeHead(400, { "Content-Type": "text/json" });
                        res.end(JSON.stringify({ error: (e as Error).message + "\n" + (e as Error).stack }));
                        return;
                    }
                });

            }
        });
    }

    start(port: number): void {
        this.server.listen(port, () => console.log(`Listening on port ${port}`));
    }
}
