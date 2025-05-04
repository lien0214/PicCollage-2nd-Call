import { Injectable, NotFoundException } from "@nestjs/common";
import { Game } from "./game.entity";
import { v4 as uuidv4 } from "uuid";
import { StartGameResponseDto } from "./dto/response/start-game-response.dto";
import { RevealResponseDto } from "./dto/response/reveal-response.dto";


@Injectable()
export class GameService {
    private games = new Map<string, Game>();

    StartGame(rows: number, cols: number, bombs: number, lastid?: string): StartGameResponseDto {
        const id = lastid ?? uuidv4();
        const game = new Game(id, rows, cols, bombs);
        this.games.set(id, game);
        return { id, board: game.boardDto };
    }

    Reveal(id: string, row: number, col: number): RevealResponseDto {
        const game = this.games.get(id);
        if (!game) {
            throw new NotFoundException("Game not found");
        }

        if (!game.InBound(row, col)) {
            throw new Error(`Coordinates out of bounds: (${row}, ${col})`);
        }
        const board = game.Reveal(row, col);
        return { board, status: game.status, safeCellsLeft: game.safeCellsLeft };
    }
}