// src/api/index.ts

import type { StartGameResponse, RevealResponse } from "../types/game";

const API_BASE = "http://localhost:3001"; // Update to match the backend's base URL

export async function startGame(rows: number, cols: number, bombs: number): Promise<StartGameResponse> {
    console.log("Starting game with params:", { rows, cols, bombs });
    const res = await fetch(`${API_BASE}/game/start-game`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ rows, cols, bombs }),
    });
    return (await res.json()) as StartGameResponse;
}

export async function reveal(gameId: string, row: number, col: number): Promise<RevealResponse> {
    console.log("Revealing cell:", { gameId, row, col });
    const res = await fetch(`${API_BASE}/game/reveal`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: gameId, row, col }),
    });
    return (await res.json()) as RevealResponse;
}