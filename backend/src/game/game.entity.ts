import { Cell } from "./cell";

export class Game {
    id: string;
    rows: number;
    cols: number;
    bombs: number;
    safeCellsLeft: number;
    status: "playing" | "lost" | "won";
    safePositions: [number, number][];
    
    private board: Cell[][];
    private firstClick: boolean;

    constructor(id: string, rows: number, cols: number, bombs: number) {
        this.id = id;
        this.rows = rows;
        this.cols = cols;
        this.bombs = bombs;
        this.safeCellsLeft = rows * cols - bombs;
        this.status = "playing";
        this.board = this.generateBoard();
        this.safePositions = this.getSafePositions();
        this.firstClick = true;
    }
    
    Reveal(row: number, col: number): { cell: Cell, position: [number, number] }[] {
        let cell = this.board[row][col];
        if (cell.revealed) [];
        if (this.firstClick) {
            this.firstClick = false;
            if (cell.bomb) {
                // switch the bomb to a random safe cell
                const randomIndex = Math.floor(Math.random() * this.safePositions.length);
                const safePos = this.safePositions[randomIndex];
                this.swapBomb([row, col], safePos);
            }
        }

        cell = this.board[row][col];
        let result: { cell: Cell, position: [number, number] }[];
        if (cell.bomb) {
            result = this.revealAllCells();
            this.status = "lost";
        } else {
            result = this.revealSafeCell(row, col);
            if (this.safeCellsLeft === 0) {
                result.push(...this.revealAllCells());
                this.status = "won";
            }
        }
        return result;
    }

    InBound(row: number, col: number): boolean {
        return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
    }

    private generateBoard(): Cell[][] {
        const board: Cell[][] = Array.from({ length: this.rows }, () =>
            Array.from({ length: this.cols }, () => ({
                revealed: false,
                bomb: false,
                adjacent: 0,
            })),
        );

        const randomSequence: number[] = this.getRandomSequence();
        for (let i = 0; i < this.bombs; i++) {
            const index = randomSequence[i];
            const row = Math.floor(index / this.cols);
            const col = index % this.cols;
            board[row][col].bomb = true;
            this.getNeighbors(row, col).forEach(([r, c]) => {
                board[r][c].adjacent++;
            });

        }
        return board;
    }

    private getSafePositions(): [number, number][] {
        const safePositions: [number, number][] = new Array(this.rows * this.cols - this.bombs);
        let index = 0;
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (!this.board[row][col].bomb) {
                    safePositions[index++] = [row, col];
                }
            }
        }
        return safePositions.slice(0, index);
    }

    private getNeighbors(row: number, col: number): [number, number][] {
        const dirs = [-1, 0, 1];
        return dirs
            .flatMap( (dr) => dirs.map((dc) => [row + dr, col + dc] as [number, number]) )
            .filter( ([r, c]) => this.InBound(r, c) && (r !== row || c !== col) );
    }

    private getRandomSequence(): number[] {
        const max = this.rows * this.cols;
        const count = this.bombs;
        const sequence: number[] = Array.from({ length: max }, (_, i) => i);
        for (let i = 0; i < count; i++) {
            const j = Math.floor(Math.random() * (max - i)) + i;
            [sequence[i], sequence[j]] = [sequence[j], sequence[i]];
        }
        return sequence.slice(0, count);
    }

    private swapBomb(bombPos: [number, number], safePos: [number, number]) {
        const [bombRow, bombCol] = bombPos;
        const [safeRow, safeCol] = safePos;
    
        // Remove bomb from old position
        this.board[bombRow][bombCol].bomb = false;
        this.getNeighbors(bombRow, bombCol).forEach(([r, c]) => {
            this.board[r][c].adjacent--;
        });
    
        // Place bomb in new (safe) position
        this.board[safeRow][safeCol].bomb = true;
        this.getNeighbors(safeRow, safeCol).forEach(([r, c]) => {
            this.board[r][c].adjacent++;
        });
    }
    

    private revealSafeCell(row: number, col: number): { cell: Cell, position: [number, number] }[] {
        const revealedCells: { cell: Cell, position: [number, number] }[] = [];
        const stack: [number, number][] = [[row, col]];
    
        while (stack.length > 0) {
            const [currentRow, currentCol] = stack.pop()!;
            const cell = this.board[currentRow][currentCol];
    
            if (cell.revealed || cell.bomb) continue;
    
            this.safeCellsLeft--;
            revealedCells.push(this.revealCell(currentRow, currentCol));
            cell.revealed = true;
    
            if (cell.adjacent === 0) {
                this.getNeighbors(currentRow, currentCol).forEach(([nr, nc]) => {
                    const neighbor = this.board[nr][nc];
                    if (!neighbor.revealed && !neighbor.bomb) {
                        stack.push([nr, nc]);
                    }
                });
            }
        }
    
        return revealedCells; // Return the list of revealed cells
    }

    private revealAllCells(): { cell: Cell, position: [number, number] }[] {
        let result: { cell: Cell, position: [number, number] }[] = [];
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.board[row][col].revealed) continue;
                result.push(this.revealCell(row, col));
            }
        }
        return result;
    }

    private revealCell(row: number, col: number): { cell: Cell, position: [number, number] } {
        this.board[row][col].revealed = true;
        return { cell: this.board[row][col], position: [row, col] };
    }
}
