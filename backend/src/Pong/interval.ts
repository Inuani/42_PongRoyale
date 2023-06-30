import { save } from "src/WebSocketServer";
import type { Game } from "src/WebSocketServer"
import type { Server } from "socket.io";
import type { GameService } from "../game/games.service";

export async function GameInterval(game: Game, server: Server, s: GameService) : Promise<void> {
	let interval = setInterval(function () {
		var dead = game.pong.step_balls();
		
		server.in(game.id).emit("game_data", {
			balls: game.pong.balls,
			players_pos: game.pong.players.map(player => player.pos)
		});
		if (game.pong.finish)
		{
			clearInterval(interval);
			game.winner = game.pong.usernames[0];
			server.in(game.id).emit("game_event", game.winner + " is the winner")
			game.started = false;
			save(game.id, s, server);
			setTimeout(() => {
				server.in(game.id).emit("game_info", game);
			}, 3000);
			return ;
		}
		else if (!game.pong.end)
		{
			server.in(game.id).emit("restart_game", {
				pong: game.pong,
			});
			server.in(game.id).emit("game_event", dead + " died")
			pauseInterval(game, server, s, interval);
		}
	}, 16);
}

function pauseInterval(game: Game, server: Server, s: GameService, interval: NodeJS.Timer) : void {
	clearInterval(interval);
	game.pong.end = true;
	setTimeout(() => {
		GameInterval(game, server, s);
	}, 2000);
}
