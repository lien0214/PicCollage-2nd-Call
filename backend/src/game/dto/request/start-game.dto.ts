import { IsInt, Min } from "class-validator";

export class StartGameDto {
    @IsInt()
    @Min(1)
    rows: number;

    @IsInt()
    @Min(1)
    cols: number;

    @IsInt()
    @Min(1)
    bombs: number;
}