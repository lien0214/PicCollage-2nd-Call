import { Injectable, NotFoundException } from "@nestjs/common";
import { Game } from "./game.entity";
import { v4 as uuidv4 } from "uuid";
import { StartGameResponseDto } from "./dto/response/start-game-response.dto";
import { RevealResponseDto } from "./dto/response/reveal-response.dto";

const MAX_GAME_AGE_MS = 10 * 60 * 1000;

@Injectable()
export class GameService {
    private games = new Map<string, {game: Game; timestamp: number}>();

    constructor() {
        setInterval(() => this.cleanUpOldGames(), MAX_GAME_AGE_MS / 2);
    }

    StartGame(rows: number, cols: number, bombs: number, lastid?: string): StartGameResponseDto {
        if (rows < 1 || cols < 1) {
            throw new Error("Rows and columns must be at least 1.");
        }
        if (bombs < 1 || bombs >= rows * cols) {
            throw new Error("Bombs must be between 1 and total cells - 1.");
        }
        const id = lastid ?? uuidv4();
        const game = new Game(id, rows, cols, bombs);
        this.games.set(id, { game, timestamp: Date.now() });
        return { id };
    }

    Reveal(id: string, row: number, col: number): RevealResponseDto {
        const gameEntry = this.games.get(id);
        if (!gameEntry) {
            throw new NotFoundException("Game not found");
        }
        const { game, timestamp }: { game: Game; timestamp: number } = gameEntry;
        if (!game) {
            throw new NotFoundException("Game not found");
        }

        if (!game.InBound(row, col)) {
            throw new Error(`Coordinates out of bounds: (${row}, ${col})`);
        }
        const revealedCell = game.Reveal(row, col);
        gameEntry.timestamp = Date.now();
        return { revealedCell: revealedCell, status: game.status, safeCellsLeft: game.safeCellsLeft };
    }

    private cleanUpOldGames() {
        const now = Date.now();
        for (const [id, { timestamp }] of this.games.entries()) {
            if (now - timestamp > MAX_GAME_AGE_MS) {
                this.games.delete(id);
            }
        }
    }
}