
import type { Socket } from "socket.io-client";
import { calc, vector } from "@js-basics/vector";
import { emit } from "$lib/global";

let		mousePos: vector = vector(20, 150);

let		canvas	: HTMLCanvasElement;
let 	index	: number;
let		socket	: Socket;
let		game_id	: string;
let		pong	: Pong;

interface Pong{
	players: Array<Player>,
	X: number,
	Y: number,
	RADIUS: number,
	balls: Array<{pos: vector}>,
	arrena: number,
}

interface Player{
	pos: vector,
	b: vector,
	c: vector,
	d: vector,
	paddle_y: number,
	paddle_x: number,
	co: number,
	si: number,
	goal_line: {a: vector, b: vector}
}

function getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent): vector {
	let rect: DOMRect = canvas.getBoundingClientRect();
	// console.table(vector(evt.clientX - rect.left, evt.clientY - rect.top));
	return vector((evt.clientX - rect.left) / rect.width * 500, (evt.clientY - rect.top) / rect.height * 500);
}

function getMousePosTactile(canvas: HTMLCanvasElement, evt: TouchEvent): vector {
	let rect: DOMRect = canvas.getBoundingClientRect();

	const touch:Touch = evt.touches[0];	
	return vector((touch.clientX - rect.left) / rect.width * 500, (touch.clientY - rect.top) / rect.height * 500);
}

function handleTouchStart(event: TouchEvent): void {
	event.preventDefault();
	canvas.focus();
}

function handleTouchEnd(event: TouchEvent): void {
event.preventDefault();
}

export function setUp(args: any): void
{
	socket = args.io;
	pong = args.pong;
	index = args.index;
	game_id = args.game;
	// canvas.width =300
	// canvas.height =300
	canvas.addEventListener("mousemove", function (evt: MouseEvent): void {
		mousePos = getMousePos(canvas, evt);
	}, false);
	canvas.addEventListener("touchmove", function (evt: TouchEvent): void {
		mousePos = getMousePosTactile(canvas, evt);
	}, false);

	canvas.addEventListener('touchstart', handleTouchStart, false);
	// canvas.addEventListener('touchmove', handleTouchMove, false);
	canvas.addEventListener('touchend', handleTouchEnd, false);
}

export function dot(a: vector, b: vector): vector
{
	let proj: vector = calc(() => (a * b));
	return (proj.x + proj.y);
}

function newPos(player: any): void
{
	let ap: vector = vector(player.pos.x - player.goal_line.a.x,
			player.pos.y - player.goal_line.a.y);
	let ab: vector = vector(player.goal_line.b.x - player.goal_line.a.x,
			player.goal_line.b.y - player.goal_line.a.y);

	let ratio: number = player.paddle_x / ab.length;

	let proj:number = dot(ab, ap)
	let alength:number = ab.length ** 2
	let d:number = proj / alength;
	
	if (d <= 0)
	{
		player.pos = player.goal_line.a;
	}
	else if (d >= 1 - 1 * ratio)
	{
		player.pos = vector(player.goal_line.b.x - ab.x * ratio, player.goal_line.b.y - ab.y * ratio);
	}
	else
	{
		player.pos = vector(player.goal_line.a.x + ab.x * d, player.goal_line.a.y + ab.y * d);
		// player.pos = calc(() => player.goal_line.a + ab * d);
	}
}

function set_square(player: Player): void
{
	player.pos = vector(player.pos.x, player.pos.y);
	player.b = calc(() => player.pos - vector(player.paddle_y * player.co, player.paddle_y * player.si));
	player.c = calc(() => player.b - vector(-player.paddle_x * player.si,  player.paddle_x * player.co));
	player.d = calc(() => player.pos - vector(-player.paddle_x * player.si,  player.paddle_x * player.co));
}

function draw_pad(player: Player, ctx: CanvasRenderingContext2D): void
{
	ctx.moveTo(player.pos.x, player.pos.y);
	ctx.lineTo(player.b.x, player.b.y);
	ctx.lineTo(player.c.x, player.c.y);
	ctx.lineTo(player.d.x, player.d.y);
	ctx.lineTo(player.pos.x, player.pos.y);

}

export function draw(): void{
	//console.log("in pong", pong.balls[0].pos)
	let i: number = 0;
	let ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
	if (ctx == null || pong == undefined)
		return ;
	const rootStyles: CSSStyleDeclaration = getComputedStyle(document.documentElement);
	let darkmode: string | null = localStorage.getItem('darkmode')
	if (darkmode !== 'enabled')
	{
		var darkerColor: string = rootStyles.getPropertyValue('--darker');
		var brightColor: string = rootStyles.getPropertyValue('--bright');
	}
	else
	{
		var darkerColor: string = rootStyles.getPropertyValue('--bright');
		var brightColor: string = rootStyles.getPropertyValue('--darker');
	}
	ctx.fillStyle = darkerColor;
	ctx.fillRect(0, 0, 500, 500);
	ctx.beginPath();
	ctx.strokeStyle = brightColor;
	if (index != -1)
	{
		pong.players[index].pos = mousePos;
		newPos(pong.players[index]);
	}
	for (let player of pong.players)
	{
		ctx.moveTo(player.goal_line.a.x, player.goal_line.a.y);
		ctx.lineTo(player.goal_line.b.x, player.goal_line.b.y);
		set_square(player);
		if (index == i)
		{
			ctx.stroke();
			ctx.beginPath();
			ctx.fillStyle = brightColor;
			draw_pad(player, ctx);
			ctx.fill();
			ctx.beginPath();
			ctx.stroke();
		}
		else
			draw_pad(player, ctx);
		i++;
	}
	//console.log("in pong", pong.balls[0].pos)
	ctx.moveTo(pong.X / 2 + pong.arrena, pong.Y / 2);
	ctx.arc(pong.X / 2, pong.Y / 2, pong.arrena, 0, 2 * Math.PI);
	for (let balls of pong.balls)
	{
		//draw_balls(ctx);
		ctx.moveTo(balls.pos.x + pong.RADIUS, balls.pos.y);
		ctx.arc(balls.pos.x, balls.pos.y, pong.RADIUS, 0, 2 * Math.PI);
	}
	ctx.stroke();
	if (index != -1)
		emit("new_pos", {
			game_id:game_id,
			index:index,
			pos:pong.players[index].pos
		});
}

export function setCanvas(c: HTMLCanvasElement): void
{
	canvas = c;
}
