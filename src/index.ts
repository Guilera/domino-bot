import { InputTranslator, OutputTranslator } from "./IO";
import { DominoServer } from "./server";

const inputTranslator = new InputTranslator();
const outputTranslator = new OutputTranslator();

const server = new DominoServer(
    inputTranslator,
    outputTranslator,
);

server.start(8000);
