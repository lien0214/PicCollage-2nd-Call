import { Cell } from '../../game.entity';
export class RevealResponseDto {
    board: Cell[][];
    status: 'playing' | 'lost' | 'won';
}