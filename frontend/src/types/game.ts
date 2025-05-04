export type CellInfo = {
    revealed: boolean;
    adjacent: number;
    bomb: boolean;
}

export type GameStatus = "playing" | "lost" | "won";

export type StartGameResponse = {
    id: string;
}

export type RevealResponse = {
    revealedCell: { cell: CellInfo, position: [number, number] }[];
    status: GameStatus;
    safeCellsLeft: number;
}