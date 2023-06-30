import { OnGatewayDisconnect, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Inject } from '@nestjs/common';
import { MessagesService } from './messages/messages.service';
import { NotifService } from './notif/notif.service';
import { Decrypt, GetUser, decorators } from "./decorators";
import { randomBytes } from "crypto";
import { FriendsService } from './friends/friends.service';
import { PongRoyal } from "./Pong/pongRoyal";
import { GameInterval } from "./Pong/interval";
import { vector } from "@js-basics/vector";
import * as jwt from 'socketio-jwt';
import { ChatMembersService } from "./chat_members/chat_members.service";
import { bot_usernames } from "./Pong/usernames";
import { GameService } from "./game/games.service";
import { Server } from "socket.io";

var game_list: Array<Game> = []

interface Player {
	username: string,
	id: number,
	elo: number,
	inGame: boolean,
}

export interface Game {
	a_players: number,
	started: boolean,
	players: Array<Player>,
	password: boolean,
	id: string,
	pong: PongRoyal,
	interval: any,
	owner: number,
	soloq: boolean,
	winner: null | string,
}

export function save(id: string, gameService: GameService, sock: Server)
{
	var game = game_list.find(val => val.id == id);
	if (game == undefined)
		return ;
	var game_id = randomBytes(40).toString('hex');
	var average = -1;
	if (game.players.length >= 2)
		var average = game.players.reduce((sum, player) => sum + player.elo, 0) / game.players.length;
	for (let place = 0; place < game.pong.resultas.length; place++)
	{
		gameService.create({
			username: game.pong.resultas[place],
			place: (game.pong.resultas.length - place).toString(),
			a_players: game.pong.resultas.length,
			game_id: game_id,
			average: average
		});
	}
	game.players = game.players.filter(val => val.inGame == true);
	if (game.players.length == 0)
	{
		game_list = game_list.filter(val => val.id != id);
		sock.in("WatchGames").emit("rm_game", game);
	}
	else
		sock.in("WatchGames").emit("update_game", game);
	//console.log("players", game.players)
	//console.log("games", game_list)
}

@WebSocketGateway({ 
	cors: {
		credentials: true,
	  },
	  transports: ['websocket', 'polling'],
	
 })
export class Sockets implements OnGatewayDisconnect
{
	@WebSocketServer()
	server : Server;

	constructor(
		@Inject(MessagesService)
		private messagesServices: MessagesService,

		@Inject(NotifService)
		private notifService: NotifService,

		@Inject(ChatMembersService)
		private chatMembersService: ChatMembersService,


		@Inject(FriendsService)
		private friendService: FriendsService,

		@Inject(GameService)
		private gameService: GameService,
	) {	}

	afterInit() {
		this.server.use(jwt.authorize({
			secret: process.env.JWT_SECRET_KEY,
			handshake: true,
		  }));
	}

	@SubscribeMessage('join')
	@Decrypt
	joinChannel(client: any, room: string): void
	{
		client.join(room.toString());
	}


	@SubscribeMessage('join_chat')
	@Decrypt
	joinChat(client: any, link: string): void
	{
		this.server.in(link).emit("join_chat");
		client.join(link);
	}


	@SubscribeMessage('leave')
	leaveChannel(client: any, room: string): void
	{
		client.leave(room);
	}
////////////////////messages////////////////////////////////////////////////
	@SubscribeMessage('message')
	@Decrypt
	async handleMessage(_: any, data : any): Promise<void>
	{
		await this.messagesServices.create(data)
		this.server.in(data.room).emit("message", data);
		data = await decorators(data);
		if (data == null)
			return ;
		await this.messagesServices.create(data)
		this.server.in(data.room).emit("message", data);
	}

	@SubscribeMessage('dm_message')
	@Decrypt
	@GetUser//{message: string, room: string, chat_id: number, user_id: number, username: string}
	async handleDmMessage(client : any, data : any): Promise<void>
	{
		data.from_id = client.user_id;
		await this.friendService.create_dm(data);
		this.server.in(data.to_id.toString()).emit("dm_message", data);
		this.server.in(data.from_id.toString()).emit("dm_message", data);
		return;
		if (data.to_id != 62)
			return ;
		data.message = "@decorators " + data.message;
		data = await decorators(data);
		data.to_id = data.from_id;
		data.from_id = 62;
		await this.friendService.create_dm(data);
		this.server.in(data.to_id.toString()).emit("dm_message", data);
	}


////////////////////CHAT////////////////////////////////////////////////
	@SubscribeMessage('change_role')
	@Decrypt
	@GetUser
	async changeRole(client: any, data): Promise<void>
	{
		await this.chatMembersService.changeUserStatus({
			user_id: client.user_id,
			chat_id: data.chat_id,
			target: data.target,
			status: data.status,
		});

	
		this.server.in(data.room).emit("change_role", {
			status:data.status,
			id:data.target,
		});

	}

	@SubscribeMessage('kick_user')
	@Decrypt
	@GetUser
	async kickUser(client: any, data : any): Promise<void>
	{
		await this.chatMembersService.kickUser({
			user_id: client.user_id,
			chat_id: data.chat_id,
			target: data.target,
			status: -1,
		});

		this.server.in(data.room).emit("change_role", {
			status:-2,
			id:data.target,
		});
	}

	

////////////////////////////NOTIF////////////////////////////////////
	@SubscribeMessage('notif_response')
	async notif_response(client : any, data: any) : Promise<void>
	{
		// JSON data looks like:
		// response: true false
		// notif: from
		// console.table(data);
		await this.notifService.unpending(data);
		let response_message : Promise<string> | Promise<void>;
		switch (data.notif.type)
		{
			case 'friend':
				response_message = this.notifService.handleFriendNotif(data)
				break;
			case 'chat':
				response_message = this.notifService.handleChatNotif(data)
				break;
			case 'game':
				response_message = this.notifService.handleGameNotif(data)
				break;
			default:
				response_message = this.notifService.handleElseNotif(data)
		}
		
		const notifResponse = {
			id_to: data.from,
			id_from: data.to,
			type: "else",
			message: response_message,
			pending: data.notif.pending,
		}

		client.to(data.to).emit("notif", notifResponse);
		client.to(data.from).emit("notif_status", "ok");
	}

	@SubscribeMessage('notif_send')
	async notif_send(client : any, data:any) : Promise<void>
	{
		const savedNotif = await this.notifService.createNotif(data);

		if (!savedNotif) {
			client.emit("notif_status", "Notification already exists");
			return;
		}

		this.server.to(savedNotif.id_to.toString()).emit("notif", savedNotif);
		client.emit("notif_status", "ok");
	}

	@SubscribeMessage('chat_member')
	invite(client : any, data:any): void
	{
		client.to(data.to).emit("notif", data);
	}

////////////////////////GAME////////////////////////////////////
	@SubscribeMessage('see_games')
	seeGames(client : any): void
	{
		client.join("WatchGames");
		client.emit("game_list", game_list.filter(game => game.password == false));
	}

	@SubscribeMessage('game_info')
	@GetUser
	gameInfos(client: any, data : any): void
	{
		var game = game_list.find(val => val.id == data.id);
		if (game == undefined)
		{
			client.emit("game_info", game);
			return
		}
		if (game.players.find(val => val.username == client.username) == undefined && game.started == false)
		{
			if (game.players.length == game.a_players)
			{
				client.emit("full");
				return ;
			}
			game.players.push({
				username: client.username,
				id: client.user_id,
				elo: data.elo,
				inGame: true,
			});
			this.server.in(game.id.toString()).emit("game_info", game);
			if (!game.password)
			this.server.in("WatchGames").emit("update_game", game);
		}
		else if (game.players.find(val => val.username == client.username) == undefined)
			this.server.in(game.id.toString()).emit("game_event", client.username + " is viewing")
		else
		{
			let player = game.players.find(val => val.username == client.username)
			player.inGame = true;
			this.server.in(game.id.toString()).emit("game_event", client.username + " joined the game");
		}
		client.join(game.id.toString());
		client.emit("game_info", game);
	}

	@SubscribeMessage('quit_game')
	@GetUser
	quitGame(client: any, id : string): void
	{
		let somePlayer : Player;
		var game = game_list.find(val => val.id == id);
		if (game == undefined)
			return
		if (game.started == false && game.players.find(val => val.username == client.username))
		{
			game.players = game.players.filter(val => val.username != client.username);
			if ( game.players.length == 0)
				game_list = game_list.filter(val => val.id != id);
			else if (game.owner == client.user_id)
				game.owner = game.players[0].id;
			this.server.in(game.id.toString()).emit("game_info", game);

			if (!game.password)
			this.server.in("WatchGames").emit("rm_game", game);
		}
		else if (game.started == true && (somePlayer = game.players.find(player => player.username == client.username)))
		{
			somePlayer.inGame = false;
			//console.log(somePlayer);
			if (game.owner == client.user_id)
			{
				const newOwner = game.players.find((player) => player.id !== game.owner);
				if (newOwner)
					game.owner = newOwner.id;
			}
			//this.server.in(game.id.toString()).emit("game_info", game);
		}
		this.server.in(game.id.toString()).emit("game_event", client.username + " left the game")
		client.leave(game.id.toString());
	}

	@SubscribeMessage('new_game')
	@GetUser
	newGame(client: any, data : any): void
	{
		var game = {
			a_players: data.a_players,
			started: false,
			players: [{
				username: client.username,
				id: client.user_id,
				elo: data.elo,
				inGame: true,
			}],
			password: data.password,
			id: randomBytes(40).toString('hex'),
			pong: null,
			interval: null,
			owner: client.user_id,
			soloq: false,
			winner: null,
		}
		game_list.push(game);
		client.join(game.id.toString());
		client.emit("join_game", game.id);
		if (!game.password)
		this.server.in("WatchGames").emit("new_game", game);
	}

	@SubscribeMessage('queue_game')
	@GetUser
	newQueueGame(client: any, data : any): void
	{
		var game = game_list.find(val => val.started == false && val.soloq == true && !val.winner);
		if (game == undefined)
		{
			game = {
				a_players: data.a_players,
				started: false,
				players: [{
					username: client.username,
					id: client.user_id,
					elo: data.elo,
					inGame: true,
				}],
				password: false,
				id: randomBytes(40).toString('hex'),
				pong: null,
				interval: null,
				owner: client.user_id,
				soloq: true,
				winner: null,
			}
			game_list.push(game);
			client.join(game.id.toString());
			client.emit("join_game", game.id);
			return ;
		}
		game.players.push({
			username: client.username,
			id: client.user_id,
			elo: data.elo,
			inGame: true,
		});
		client.join(game.id.toString());
		client.emit("join_game", game.id);
		
		setTimeout(() => {
			var players = game.players.map(elem => elem.username);
			game.pong = new PongRoyal(players);
			game.started = true;
			this.server.in(game.id.toString()).emit("game_info", game);
			setTimeout(() => {
				GameInterval(game, this.server, this.gameService);
			}, 2000);
		}, 2000);
	}

	// MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
	// @SubscribeMessage('join_game')
	// joinGame(client, data): void
	// {
	// 	var game = game_list.find(elem => elem.id == data.game_id)
	// 	if (game == undefined)
	// 		client.emit('join_game', "non");
	// 	if (game.started)
	// 		client.emit('join_game', "too late");
	// 	if (!game.password != "" && !game.password != data.password)
	// 		client.emit('join_game', "invalid password");
	// 	game.players.push(data.user);
	// 	this.server.in(game.id.toString()).emit("game_info", game);
	// 	client.join(game.id);
	// 	client.emit("join_game", game);
	// }

	@SubscribeMessage('volatile_message')
	handleGameMesssage(@MessageBody() data : any): void
	{
		this.server.in(data.chatid).emit("volatile_message", data.username, data.message);
	}

	@SubscribeMessage('new_pos')
	newPos(@MessageBody() data : any): void
	{
		try{
			var game = game_list.find(elem => elem.id == data.game_id).pong;
			game.players[data.index].pos = vector(data.pos.x, data.pos.y);
		}catch{
		}
	}

	@SubscribeMessage('start_game')
	startGame(@MessageBody() game_id : string): void
	{
		var game = game_list.find(elem => elem.id == game_id);
		var players = game.players.map(elem => elem.username);
		while(players.length < game.a_players)
			players.push(bot_usernames[Math.round(Math.random() * (bot_usernames.length - 1))])
		game.pong = new PongRoyal(players);
		game.started = true;
		this.server.in(game_id.toString()).emit("game_info", game);
		if (!game.password)
			this.server.in("WatchGames").emit("update_game", game);
		setTimeout(() => {
			GameInterval(game, this.server, this.gameService);
		}, 2000);
	}

	@SubscribeMessage('game_status')
	game_status(client: any, game_id : string): void
	{
		var game = game_list.find(elem => elem.id == game_id);
		if (game == undefined || game.password == true)	
			client.emit("game_status", -1);
		else if (game.started )	
			client.emit("game_status", 0);
		else
			client.emit("game_status", 1);
	}

/////////////////////////////PINGPONG////////////////////////////////////////////
	@SubscribeMessage('ping')
	@GetUser
	ping(user : any, id : number): void
	{
		this.server.in(id.toString()).emit("ping", user.user_id);
	}

	@SubscribeMessage('pong')
	pong(@MessageBody() data : any): void
	{
		this.server.in(data.to.toString()).emit("pong", data);
	}



/////////////////////////////DISCONNECT////////////////////////////////////////////
	@GetUser
	handleDisconnect(client: any): void {
		try {

		//console.log(client.id);
		var game = game_list.find(game => 
		game.players.some(player => player.id == client.user_id));
		if (game == undefined)
			return ;
		let id = game.id;
		//console.log('Client disconnected:', client.id);

		// this.server.emit('quit_game', game.id);
		let somePlayer: Player;
		if (game.started == false && game.players.find(val => val.username == client.username))
		{
			game.players = game.players.filter(val => val.username != client.username);
			if ( game.players.length == 0)
			game_list = game_list.filter(val => val.id != id);
			else if (game.owner == client.user_id)
				game.owner = game.players[0].id;
			this.server.in(game.id.toString()).emit("game_info", game);
			this.server.in("WatchGames").emit("rm_game", game);
		}
		else if (game.started == true && (somePlayer = game.players.find(player => player.username == client.username)))
		{
			somePlayer.inGame = false;
			if (game.owner == client.user_id)
			{
				const newOwner = game.players.find((player) => player.id !== game.owner);
				if (newOwner)
					game.owner = newOwner.id;
			}
		}
		this.server.in(game.id.toString()).emit("game_event", client.username + " left the game")
		client.leave(game.id.toString());
		}
		catch {
		 	//console.log("welp")
		}
	}
}