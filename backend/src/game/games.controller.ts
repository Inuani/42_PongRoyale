import { Controller, Post, Body, Get, Headers, UseGuards } from '@nestjs/common';
import { GameService } from './games.service';
import { StatusOK } from 'src/decorators';
import { AuthGuard } from 'src/app.guard';

@Controller('game')
export class GameController {
    constructor(private gamesService: GameService) {}

	
	@UseGuards(new AuthGuard(1))
	@Get('info')
	@StatusOK
	async getTop1(@Headers('username') username) {
        return {info: await this.gamesService.getTop1(username)};
    }

	@UseGuards(new AuthGuard(1))
	@Get('user')
	@StatusOK
    async getUserGames(@Headers('username') username) {
        return {user: await this.gamesService.getUserGames(username)};
    }

	@UseGuards(new AuthGuard(1))
    @Get('game')
	@StatusOK
    async testRoute(@Headers('game_id') game_id) {
        return {game: await this.gamesService.getGame(game_id)};
    }

}