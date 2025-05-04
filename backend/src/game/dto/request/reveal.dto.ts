import { IsString, IsInt, Min } from "class-validator";

export class RevealDto {
    @IsString()
    id: string;

    @IsInt()
    @Min(0)
    row: number;

    @IsInt()
    @Min(0)
    col: number;
}