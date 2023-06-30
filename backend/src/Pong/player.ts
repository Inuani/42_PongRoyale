/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   player.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: albaud <albaud@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/06/09 09:52:38 by albaud            #+#    #+#             */
/*   Updated: 2023/06/20 21:53:40 by albaud           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { vector, calc } from "@js-basics/vector";
import { PongRoyal } from "./pongRoyal";
import { PhysicObject } from "./phisique";
import { randomBytes } from "crypto";

function dot(a: vector, b: vector) : number
{
	var proj = calc(() => (a * b));
	return (proj.x + proj.y);
}

export class Player
{
	//rectangle of the paddle
	pos: vector;
	b: vector;
	c: vector;
	d: vector;

	// angle and normals
	angle: number;
	normal: vector;
	normal_cote: vector;
	//cos and sin of angle to avoid recalculating them
	co: number;
	si: number;

	//size of the paddle
	paddle_x: number;
	paddle_y: number;

	//line of the goal and line of the player movement
	goal_line: any;
	line: any;

	isbot : boolean;

	constructor(angle: number, pong: PongRoyal, isbot = false)
	{
		this.angle = angle;
		this.co = Math.cos(this.angle);
		this.si = Math.sin(this.angle);
		this.normal = calc(() => pong.center - this.pos)

		this.normal = vector(() => this.normal / this.normal.length);
		this.normal_cote = vector(this.normal.y, -this.normal.x)
		this.normal_cote = vector(() => this.normal_cote / this.normal_cote.length);
		this.paddle_x = 100 / pong.a_players * 2;
		this.paddle_y = 10;
		this.set_square();
		var angleg = Math.PI / (pong.a_players + 2);
		this.goal_line = {
			a: vector(Math.cos(angle + angleg) * (pong.arrena) + pong.X / 2,
							Math.sin(angle + angleg) * (pong.arrena) + pong.Y / 2),
			b: vector(Math.cos(angle - angleg) * (pong.arrena) + pong.X / 2,
							Math.sin(angle - angleg) * (pong.arrena) + pong.Y / 2),
		}
		angleg = Math.PI / (pong.a_players + 1);
		this.line = {
			a: vector(Math.cos(angle + angleg) * (pong.arrena) + pong.X / 2,
							Math.sin(angle + angleg) * (pong.arrena) + pong.Y / 2),
			b: vector(Math.cos(angle - angleg) * (pong.arrena) + pong.X / 2,
							Math.sin(angle - angleg) * (pong.arrena) + pong.Y / 2),
		}
		this.pos = this.goal_line.a
		this.isbot = isbot;
	}
	
	set_square() : void
	{
		this.b = calc(() => this.pos - vector(this.paddle_y * this.co, this.paddle_y * this.si));
		this.c = calc(() => this.b - vector(-this.paddle_x * this.si,  this.paddle_x * this.co));
		this.d = calc(() => this.pos - vector(-this.paddle_x * this.si,  this.paddle_x * this.co));
	}

	draw_pad(ctx: CanvasRenderingContext2D) : void
	{
		ctx.moveTo(this.pos.x, this.pos.y);
		ctx.lineTo(this.b.x, this.b.y);
		ctx.lineTo(this.c.x, this.c.y);
		ctx.lineTo(this.d.x, this.d.y);
		ctx.lineTo(this.pos.x, this.pos.y);
	}

	point_in_paddle(pos : vector, ball_radius: number, ball: PhysicObject, pong : PongRoyal) : vector | undefined
	{
		let low : number = 0 - ball_radius / this.paddle_x;
		let high : number = 1 + ball_radius / this.paddle_x;
		let lowC : number = 0 - ball_radius / this.paddle_y;
		let highC : number = 1 + ball_radius / this.paddle_y;
		var am : vector = calc(() => pos - this.pos);
		var ab : vector = calc(() => this.b - this.pos);
		var ad : vector = calc(() => this.d - this.pos);
		var amab : number = dot(am, ab) / dot(ab, ab);
		var amad : number = dot(am, ad) / dot(ad, ad);
	
		if (!(lowC < amab && amab <= highC && low < amad && amad <= high))
			return (undefined);
		var min : number = Math.min(amab, amad,  highC - amab, high - amad)

		let normal : vector;
		if (min == highC - amab ||  min == amab)
			normal = (this.normal_cote)
		normal = (this.normal);

		//calculate new speed/angle
		ball.backward();
		let tmpAngle : number = (this.angle - Math.PI) + (amad * 2 - 1) * Math.PI / 3;
		ball.vitess = vector(Math.cos(tmpAngle), Math.sin(tmpAngle))
		ball.forward(pong);
		return normal;
	}
	
	circleLineIntersect(x1 : number, y1 : number, x2 : number, y2 : number, cx : number, cy : number, cr : number ) : boolean
	{
		let dx : number = x2 - x1;
		let dy : number = y2 - y1;
		let a : number = dx * dx + dy * dy;
		let b : number = 2 * (dx * (x1 - cx) + dy * (y1 - cy));
		let c : number = cx * cx + cy * cy;
		c += x1 * x1 + y1 * y1;
		c -= 2 * (cx * x1 + cy * y1);
		c -= cr * cr;
		let bb4ac : number = b * b - 4 * a * c;
		return bb4ac >= 0;
	}

	in_goal(pos: vector, radius: number) : boolean {
		return this.circleLineIntersect(this.goal_line.a.x, this.goal_line.a.y,
			this.goal_line.b.x, this.goal_line.b.y, pos.x, pos.y, radius);
	}
}
