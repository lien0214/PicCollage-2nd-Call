import { Board } from "@/types/game";

const API_BASE = process.env.NEST_PUBLIC_API_URL || 'http://localhost:3001';

export async function startGame(rows: number, cols: number, bombs: number, lastid?: string): 
    Promise<{ id: string, board: Board }> {
    const res = await fetch(`${API_BASE}/game/start-game`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: lastid ? 
            JSON.stringify({ rows, cols, bombs, lastid }) : 
            JSON.stringify({ rows, cols, bombs }),
    });
    return res.json();
}

export async function reveal(id: string, row: number, col: number): 
    Promise<{ board: any[][]; status: string; safeCellsLeft: number }> {
    const res = await fetch(`${API_BASE}/game/reveal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, row, col }),
    });
    return res.json();
}