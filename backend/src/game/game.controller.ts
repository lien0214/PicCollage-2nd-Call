import { Body, Controller, Post } from "@nestjs/common";
import { GameService } from "./game.service";
import { StartGameDto } from "./dto/request/start-game.dto";
import { StartGameResponseDto } from "./dto/response/start-game-response.dto";
import { RevealResponseDto } from "./dto/response/reveal-response.dto";
import { RevealDto } from "./dto/request/reveal.dto";

@Controller("game")
export class GameController {
    private readonly _gameService: GameService;
    constructor(private readonly gameService: GameService) {
        this._gameService = gameService;
    }

    @Post("start-game")
    startGame(@Body() dto: StartGameDto): StartGameResponseDto {
        return this._gameService.StartGame(dto.rows, dto.cols, dto.bombs);
    }

    @Post("reveal")
    reveal(@Body() dto: RevealDto): RevealResponseDto {
        return this._gameService.Reveal(dto.id, dto.row, dto.col);
    }
}