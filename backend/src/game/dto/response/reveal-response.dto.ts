import { Cell } from '../../cell';
export class RevealResponseDto {
    revealedCell: { cell: Cell; position: [number, number] }[];
    status: 'playing' | 'lost' | 'won';
    safeCellsLeft: number;
}