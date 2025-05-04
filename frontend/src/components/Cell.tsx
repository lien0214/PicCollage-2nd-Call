import React from "react";
import { CellInfo } from "@/types/game";

type Props = {
    cell: CellInfo;
    onClick: () => void;
    onRightClick: (e: React.MouseEvent) => void;
    isFlagged: boolean;
};

export const Cell: React.FC<Props> = ({
    cell,
    onClick,
    onRightClick,
    isFlagged,
}) => {
    const base = !cell.revealed
        ? "unrevealed"
        : cell.bomb
          ? "bomb"
          : "revealed";

    let content = "　";

    if (cell.revealed && cell.bomb) content = "💣";
    else if (cell.revealed && cell.adjacent) content = String(cell.adjacent);
    else if (!cell.revealed && isFlagged) content = "🚩";

    return (
        <div
            className={`cell ${base}`}
            onClick={!cell.revealed ? onClick : undefined}
            onContextMenu={(e) => {
                e.preventDefault();
                onRightClick(e);
            }}
        >
            {content}
        </div>
    );
};
