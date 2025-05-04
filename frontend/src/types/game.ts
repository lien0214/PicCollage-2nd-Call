export type CellInfo = {
    revealed: boolean;
    adjacent: number;
    bomb: boolean;
}

export type GameStatus = "playing" | "lost" | "won";

export type Board = CellInfo[][];

export type StartGameResponse = {
    id: string;
}

export type RevealResponse = {
    board: Board;
    status: GameStatus;
    safeCellsLeft: number;
}