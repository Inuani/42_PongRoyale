import { PhysicObject} from "./phisique";
import { Player } from "./player";
import { vector, calc } from "@js-basics/vector";
import { bot_usernames } from "./usernames";
import { GameService } from "src/game/games.service";

function closesBall(pos : vector, pong : PongRoyal) : vector
{
	let closest : number = 10000;
	let closestBall : PhysicObject = pong.balls[0];
	for (let ball of pong.balls)
	{
		let dist = calc( () => ball.pos - pos);
		let distance = Math.sqrt(dot(dist, dist));
		if (distance < closest)
		{
			closest = distance;
			closestBall = ball;
		}
	}
	return closestBall.pos;
}

function dot(a: vector, b: vector) : number
{
	var proj = calc(() => (a * b));
	return (proj.x + proj.y);
}

export function getRandomFloat(min : number, max : number) : number {
	const str = (Math.random() * (max - min) + min).toFixed(10);
	return parseFloat(str);
}

export class PongRoyal
{
	X = 500;
	Y = 500;
	center = vector (this.X / 2, this.Y / 2);
	PADDLE_X = 10;
	PADDLE_Y = 60;
	RADIUS = 10
	SPEED = 3
	resultas : Array<string>;
	usernames : Array<string>;
	balls: Array<PhysicObject>;
	players: Array<Player>;
	players_postion: Array<vector>;
	interval: any = null;
	arrena: number;
	a_players: number;
	end: boolean = true;
	finish: boolean = false;
	score: number[] = [0, 0];
	constructor(usernames: Array<string>)
	{
		this.resultas = [];
		this.instantiate(usernames);
	}

	instantiate(usernames: Array<string>) : void
	{
		
		this.players = [];
		this.players_postion = new Array<vector>;
		this.arrena = 200;
		let angle : number;
		this.balls = [];
		this.a_players = usernames.length;
		for (var i: number = 0; i < usernames.length; i++)
		{
			angle = i / usernames.length * 2 * Math.PI;
			if (bot_usernames.includes(usernames[i]))
			{
				this.players.push(new Player(angle, this, true));
			}
			else
				this.players.push(new Player(angle, this));
		}
		this.usernames = [...usernames];
		let randomPlayer = Math.random() * (usernames.length - 1);
		let randomOffset = getRandomFloat(0, Math.PI/(usernames.length * 2));
		angle = this.players[Math.round(randomPlayer)].angle + randomOffset;
		this.balls.push(new PhysicObject(vector(this.X / 2, this.Y / 2),  vector(Math.cos(angle), Math.sin(angle)), 3));
	}

	set_player_pos(index: number, x: number, y: number) : void
	{
		this.players[index].pos.x = x;
		this.players[index].pos.y = y;
	}

	collid() : undefined | vector
	{
		for (let ball of this.balls)
		{
			for (var i = 0; i < this.players.length; i++)
			{
				this.players[i].set_square()
				var normal : vector | undefined = this.players[i].point_in_paddle(ball.pos, this.RADIUS, ball, this);
				if (normal != undefined)
					return (normal);
			}
		}
		return (undefined)
	}

	collid_goal() : any
	{
		for (let index in this.players)
		{
			for (let ball of this.balls)
			{
				if (this.players[index].in_goal(ball.pos, this.RADIUS))
					return index;
			}
		}
	}

	step_balls() : string | void
	{
		for (let balls of this.balls)
		{
			balls.forward(this);
			var normal = this.collid();
			let hit: number;
			if ((hit = this.collid_goal()) != undefined)
			{
				var user = this.usernames[hit];
				this.end = false;
				if (this.usernames.length > 2)
				{
					this.usernames.splice(hit, 1);
					this.resultas.push(user);
				}
				else if (this.usernames.length == 2)
				{
					var winner = (hit - 1) * -1;
					this.score[winner] += 1;
					if (this.score[winner] == 3)
					{
						this.usernames.splice(hit, 1);
						this.resultas.push(user);
						this.resultas.push(this.usernames[0]);
						this.finish = true;
						return ;
					}
				}
				this.instantiate(this.usernames);
				return user;
			}
			else if (calc(() => balls.pos - vector(this.X / 2, this.Y / 2)).length + this.RADIUS > this.arrena)
			{
				balls.backward();
				let rngval : number = getRandomFloat(-(10), 10);
				normal = calc( () => balls.pos - (this.center +  rngval));
				normal = vector(() => normal / normal.length);
				var doto : number = dot(balls.vitess, normal);
				balls.vitess = calc(() => balls.vitess - 2 * doto * normal);
				balls.forward(this);
			}
		}
		for (let player of this.players)
		{
			if (player.isbot)
			{
				player.pos = closesBall(player.pos, this);
				this.newPos(player);
			}
		}	
	}

	newPos(player: Player) : void
	{
		let ap : vector = calc(() => player.pos - player.goal_line.a);
		let ab : vector = calc(() => player.goal_line.b - player.goal_line.a);

		let ratio : number = player.paddle_x/ab.length;

		let proj : number = dot(ab, ap)
		let alength : number = ab.length ** 2
		let d : number = proj / alength;
		
		if (d <= 0)
		{
			player.pos = player.goal_line.a;
		}
		else if (d >= 1 - 1 * ratio)
		{
			player.pos = calc(() => player.goal_line.b - ab*ratio);
		}
		else
		{
			player.pos = calc(() => player.goal_line.a + ab * d);
		}
	}
}
