import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GamePlayer } from './games.entity';
import { Users } from 'src/users/users.entity';
@Injectable()
export class GameService {
    constructor(
        @InjectRepository(GamePlayer)
        private gamePlayerRepository: Repository<GamePlayer>,

		@InjectRepository(Users)
        private usersRepository: Repository<Users>,
    ) {}

	async getTop1(username: string) : Promise<{ top1: number; games: number; }>
	{
		var top1 = await this.gamePlayerRepository.find({where: { username: username, place: 1}});
		var games = await this.gamePlayerRepository.find({where: { username: username}});
		return {
			top1: top1.length,
			games: games.length
		}
	}
	
	async getGame(game_id: string) : Promise<GamePlayer[]>
	{
		return await this.gamePlayerRepository.find({where: {game_id: game_id}});
	}

	async getUserGames(username: string) : Promise<GamePlayer[]>
	{
		return await this.gamePlayerRepository.find({where: {username: username}});
	}

    async create(data: any): Promise<GamePlayer>
    {
        const player = new GamePlayer();

		player.a_players = data.a_players;
		player.username = data.username;
		player.place = data.place;
		player.game_id = data.game_id;
		var user = await this.usersRepository.findOne({where: {username: data.username}});
		if (user == undefined || data.average == -1)
			return this.gamePlayerRepository.save(player);
		var placement = (data.place) / (player.a_players) * 2 - 1;
		if (placement == 0)
			placement = - 1 / player.a_players * 2;
		placement *= -1
		var diff : number;
		if (placement > 0)
			diff = data.average - user.elo;
		else
			diff =  user.elo - data.average;
		if (diff > 200)
			diff = 200;
		if (diff < -200)
			diff = -200;
		diff += 200;
		diff /= 400;
		if (diff < 1 / 20)
			diff = 1 / 20;
		user.elo += Math.round(diff * 20 * placement);
		if (user.elo < 100)
			user.elo = 100;
		if (Number.isNaN(user.elo))
			user.elo = 100;
		this.usersRepository.save(user);
		return this.gamePlayerRepository.save(player);
    }
}