export type GameStatus = "playing" | "won" | "lost";

export type CellInfo = {
    revealed: boolean;
    bomb: boolean;
    adjacent: number;
};

export type Board = CellInfo[][];

export interface StartGameResponse {
    id: string;
    board: Board;
}

export interface RevealResponse {
    revealedCell: {cell: CellInfo, position: [number, number]}[];
    status: GameStatus;
    safeCellsLeft: number;
}