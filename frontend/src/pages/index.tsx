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

    const [time, setTime] = useState(0);
    const [timerRunning, setTimerRunning] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;
        if (timerRunning && status === "playing") {
            interval = setInterval(() => setTime((prev) => prev + 1), 1000);
        }
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [timerRunning, status]);

    useEffect(() => {
    if (status !== "playing") {
        setTimerRunning(false);
    }
    }, [status]);

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
        setTime(0);
        setTimerRunning(true);
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
            <div className="timer-box">
                ⏱ {formatTime(time)}<br />
                Safe cell: {safeCellsLeft}
            </div>
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
                        <Board
                            board={board}
                            onCellClick={onCellClick}
                            flagged={flagged}
                            toggleFlag={toggleFlag}
                        />
                    </div>
                )}
            </div>
            {status !== "playing" && (
                <div className="overlay" onClick={() => setStatus("playing")}>
                    <div className="overlay-message">
                        <h2>{status === "won" ? "🎉 You Won!" : "💥 Game Over"}</h2>
                        <p>⏱ Time: {formatTime(time)}</p>
                        <p>🚩 Flags used: {flagged.size}</p>
                        <p>✅ Revealed: {rows * cols - safeCellsLeft - bombs} / {rows * cols - bombs}</p>
                        <button className="primary" onClick={startNewGame}>
                            🔄 Restart Game
                        </button>
                    </div>
              </div>
            )}
        </div>
    );
}


function formatTime(seconds: number) {
    const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
    const ss = String(seconds % 60).padStart(2, "0");
    return `${mm}:${ss}`;
}