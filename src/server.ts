import { createServer, type Server } from "http";
import { Input, IInputTranslator, IOutputTranslator, Output } from "./IO";
import { Gamer } from "./Gamer";

interface IDominoServer {
    start(port: number): void;
}

export class DominoServer implements IDominoServer {
    private server: Server;

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

                    const { hand, playerId, table } = this.inputTranslator.translate(input);
                    const gamer = new Gamer(playerId, hand, table);

                    const move = gamer.play();
                    const output = this.outputTranslator.translate(move);

                    res.writeHead(200, { "Content-Type": "text/json" });
                    res.end(JSON.stringify(output));
                });

            }
        });
    }

    start(port: number): void {
        this.server.listen(port, () => console.log(`Listening on port ${port}`));
    }
}
