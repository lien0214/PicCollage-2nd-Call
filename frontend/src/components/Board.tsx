/* src/components/Board.tsx */
import React from "react";
import { Cell } from "./Cell";
import { CellInfo } from "@/types/game";
import "@/styles/board.css";

type Props = {
    board: CellInfo[][];
    onCellClick: (r: number, c: number) => void;
    flagged: Set<string>;
    toggleFlag: (r: number, c: number) => void;
};

export const Board: React.FC<Props> = ({
    board,
    onCellClick,
    flagged,
    toggleFlag,
}) => {
    const cols = board[0]?.length ?? 0;

    return (
        <div
            className="board"
            style={
                cols
                    ? {
                          gridTemplateColumns: `repeat(${cols}, var(--cell-size))`,
                      }
                    : undefined
            }
        >
            {board.map((row, r) => (
                <div className="row" key={r}>
                    {row.map((cell, c) => (
                        <Cell
                            key={`${r}-${c}`}
                            cell={cell}
                            isFlagged={flagged.has(`${r}-${c}`)}
                            onClick={() => onCellClick(r, c)}
                            onRightClick={() => toggleFlag(r, c)}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};
