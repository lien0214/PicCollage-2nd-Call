import { Cell } from "src/game/game.entity";

export class StartGameResponseDto {
    id: string;
    board: Cell[][];
}