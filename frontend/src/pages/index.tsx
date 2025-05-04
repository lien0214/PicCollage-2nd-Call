/* src/pages/index.tsx */
import React, { useEffect, useState } from "react";
import { startGame, reveal } from "@/lib/api";
import { Board as BoardType, GameStatus } from "@/types/game";
import { Board } from "@/components/Board";

import "@/styles/globals.css";

export default function HomePage() {
    const [board, setBoard] = useState<BoardType>([]);
    const [gameId, setGameId] = useState("");
    const [status, setStatus] = useState<GameStatus>("playing");
    const [flagged, setFlagged] = useState<Set<string>>(new Set());

    const [rows, setRows] = useState(10);
    const [cols, setCols] = useState(10);
    const [bombs, setBombs] = useState(10);
    const [error, setError] = useState("");
    const [safeCellsLeft, setSafeCellsLeft] = useState(0);

    useEffect(() => {
        console.log("Board length:", board.length);
    }, [board]);

    const startNewGame = async () => {
        setError("");
        if (rows < 1 || cols < 1) {
            setError("Rows and columns must be at least 1.");
            return;
        }
        if (bombs < 1 || bombs >= rows * cols) {
            setError("Bombs must be between 1 and total cells ‑ 1.");
            return;
        }
        let res: {
            id: string;
            board: BoardType;
        }
        if (gameId !== "") {
            res = await startGame(rows, cols, bombs, gameId);
        } else {
            res = await startGame(rows, cols, bombs);
        }
        setGameId(res.id);
        setBoard(res.board);
        setStatus("playing");
        setFlagged(new Set());
        setSafeCellsLeft(rows * cols - bombs);
    };

    const onCellClick = async (r: number, c: number) => {
        if (status !== "playing") return;
        
        if (flagged.has(`${r}-${c}`)) return;
        const { board: next, status: nextStatus, safeCellsLeft: nextSafeCellsLeft }
            = await reveal(gameId, r, c);
        setBoard(next);
        setStatus(nextStatus as GameStatus);
        setSafeCellsLeft(nextSafeCellsLeft);
    };

    const toggleFlag = (r: number, c: number) => {
        const key = `${r}-${c}`;
        setFlagged((prev) => {
            const copy = new Set(prev);
            copy.has(key) ? copy.delete(key) : copy.add(key);
            return copy;
        });
    };

    return (
        <div className="app-shell">
            <div className="panel">
                <h1 style={{ marginTop: 0 }}>Minesweeper</h1>

                <div className="controls">
                    <label>
                        Rows
                        <input
                            type="number"
                            min={1}
                            value={rows}
                            onChange={(e) => setRows(Number(e.target.value))}
                        />
                    </label>

                    <label>
                        Columns
                        <input
                            type="number"
                            min={1}
                            value={cols}
                            onChange={(e) => setCols(Number(e.target.value))}
                        />
                    </label>

                    <label>
                        Bombs
                        <input
                            type="number"
                            min={1}
                            max={rows * cols - 1}
                            value={bombs}
                            onChange={(e) => setBombs(Number(e.target.value))}
                        />
                    </label>

                    <button className="primary" onClick={startNewGame}>
                        Start Game
                    </button>
                </div>

                {error && <div className="error">{error}</div>}
                
                
                {board.length > 0 && (
                    <div>
                        <p style={{ marginTop: 4, fontWeight: 600 }}>
                            Status: {status}
                        </p>
                        <p style={{ marginTop: 4, fontWeight: 600 }}>
                            remain safe position: {safeCellsLeft}
                        </p>
                        <Board
                            board={board}
                            onCellClick={onCellClick}
                            flagged={flagged}
                            toggleFlag={toggleFlag}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
