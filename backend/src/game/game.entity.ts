export type Cell = {
    revealed: boolean;
    bomb: boolean;
    adjacent: number;
};

export class Game {
    id: string;
    rows: number;
    cols: number;
    bombs: number;
    safeCellsLeft: number;
    status: "playing" | "lost" | "won";
    boardDto: Cell[][];
    
    private board: Cell[][];

    constructor(id: string, rows: number, cols: number, bombs: number) {
        this.id = id;
        this.rows = rows;
        this.cols = cols;
        this.bombs = bombs;
        this.safeCellsLeft = rows * cols - bombs;
        this.status = "playing";
        this.board = this.generateBoard();
        this.boardDto = this.generateEmptyDtoBoard();
    }
    
    Reveal(row: number, col: number): Cell[][] {
        const cell = this.board[row][col];
        if (cell.revealed) return this.board;

        if (cell.bomb) {
            this.revealAllCells();
            this.status = "lost";
        } else {
            this.revealSafeCell(row, col);
            if (this.safeCellsLeft === 0) {
                this.status = "won";
            }
        }

        return this.boardDto;
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
                if (!board[r][c].bomb) {
                    board[r][c].adjacent++;
                }
            });

        }
        return board;
    }

    private generateEmptyDtoBoard(): Cell[][] {
        return Array.from({ length: this.rows }, () =>
            Array.from({ length: this.cols }, () => ({ revealed: false, bomb: false, adjacent: 0 })),
        );
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

    private revealSafeCell(row: number, col: number) {
        const cell = this.board[row][col];
        if (cell.revealed || cell.bomb) return;
        this.safeCellsLeft--;
        this.revealCellDto(row, col);   
        cell.revealed = true;
        if (cell.adjacent === 0) {
            this.getNeighbors(row, col).forEach(([nr, nc]) =>
                this.revealSafeCell(nr, nc),
            );
        }
    }

    private revealAllCells() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.revealCellDto(row, col);
            }
        }
    }

    private revealCellDto(row: number, col: number) {
        const cell = this.board[row][col];
        this.boardDto[row][col] = {
            revealed: true,
            bomb: cell.bomb,
            adjacent: cell.adjacent,
        };
    }
}
