
import { vector, calc } from "@js-basics/vector";
import { PongRoyal, getRandomFloat } from "./pongRoyal"

export class PhysicObject {
    pos: vector;
    vitess: vector;
	acc: number;
	time: number;
	newball: boolean;
	constructor(pos: vector, vitess: vector, acc: number) {
        this.pos = pos;
        this.vitess = vitess;
		this.acc = acc;
		this.time = acc;
		this.newball = false;
    }

	forward(pong: PongRoyal) : void
	{
		this.pos.x += this.vitess.x * this.acc;
		this.pos.y += this.vitess.y  * this.acc;
		this.acc += 0.001;
		if (this.acc - this.time > 0.2 && !this.newball)
		{
			this.newball = true;
			let angle = getRandomFloat(0, 2 * Math.PI);
			pong.balls.push(new PhysicObject(vector(this.pos.x, this.pos.y),  vector(Math.cos(angle), Math.sin(angle)), this.acc));
		}
	}

	backward() : void
	{
		this.pos.x -= this.vitess.x * this.acc;
		this.pos.y -= this.vitess.y * this.acc;
	}
}