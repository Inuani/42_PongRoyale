import { jwtService } from "./JWT";
import { decrypt } from "./Crypter";
import { status } from "./status";
import { run } from "node:test";

var preprompt = process.env.PROMPT_DECORATORS

export interface RequestUser{
	user:{
		username: string,
		rights: number,
		id: number,
	}
}

export interface User{
	role: number;
	username: string;
	avatar_url: string;
	bio: string;
	id: number;
	status: string;
}




function call(message : string)
{
	var calls = [
		"@decorators",
		"@decorators()",
		"@hollydecorators",
		"@hollydecorators()",
	]
	for (let cal in calls)
	{
		if (message.toLowerCase().startsWith(calls[cal]))
			return true
	}
	return false;
}

export async function decorators(data : any)
{
	if (call(data.message) == false)
		return null;
	console.log("Someone tries to communicate with the holly decorators");
	var resonse = await fetch("https://api.openai.com/v1/chat/completions", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: "Bearer " + process.env.API_DECORATORS
			},
			body: JSON.stringify({
				model: 'gpt-3.5-turbo-0613',
				messages: [{
					role: 'system', content: preprompt
				}, {
					role: 'user', content: data.message
				}]
			}),
	});
	var gpt = await resonse.json();
	gpt = gpt.choices[0].message.content;
	// gpt = encryptWithAES(gpt, data.room);
	data.message = gpt;
	data.user_id = -1;
	return data;
}


export function GetUser(target: any, propertyKey, descriptor: any)
{
	const method = descriptor.value;
	if (method)
	{
		descriptor.value = function (...args: any[]) {
			var user = jwtService.verify(args[0].handshake.query.token);
			args[0].username = user.username;
			args[0].user_id = user.id;
			return method.apply(this, args);
		}
	}
}

export function Decrypt(target: any, propertyKey, descriptor: any)
{
	const method = descriptor.value;
	if (method)
	{
		descriptor.value = function (...args: any[]) {
			args[1] = decrypt(args[0].handshake.query.token, args[1]);
			return method.apply(this, args);
		}
	}
}

export function StatusOK(target: any, propertyKey, descriptor: any)
{
	const method = descriptor.value;
	if (method)
	{
		descriptor.value = async function (...args: any[]) {
			var res = await method.apply(this, args);
			res.status = status.OK;
			return res;
		}
	}
}

export function avararUrl(url: string)
{
	//console.log("url, ", url);
	if (url.startsWith("http"))
		return url;
	return process.env.BACKEND_HOST + "pfp/" + url;
}