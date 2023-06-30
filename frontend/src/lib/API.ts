import { goto } from "$app/navigation";
import { getCookies } from "./Cookies";
import all, { BACKEND_HOST } from "./global";

function error_site(err: string)
{
	// console.log("err ", link, err);
	if (typeof(err) != 'string' || err == status.KO)
		// goto("/500");
		document.location.href = "/500";
	else
		// goto("/home?err=" + err);
		document.location.href = "/home?err=" + err;
}

async function scanres(response: Response)
{
	if (!response.ok)
		throw status.KO
	var res = await response.json()
	if (res == undefined)
		throw status.INVALID_RIGHTS;
	if (res.status != status.OK)
		throw res.status;
	return res
}

export async function get(link: string, headers: any = {}, f = fetch): Promise<any>
{
	try{
		headers["Access-Control-Allow-Origin"] = "*";
		headers["Authorization"] = "Bearer " + getCookies("USER_TOKEN");
		var response: Response = await f(BACKEND_HOST + link, {
			mode: 'cors',
			method: "GET",
			headers: headers,
		})
		return await scanres(response);
	}
	catch (err: any)
	{
		error_site(err);
	}
}

export async function geto(link: string, headers: any = {}, f = fetch): Promise<any>
{
	try{
		headers["Access-Control-Allow-Origin"] = "*";
		headers["Authorization"] = "Bearer " + getCookies("USER_TOKEN");
		var response: Response = await f(BACKEND_HOST + link, {
			mode: 'cors',
			method: "GET",
			headers: headers,
		})
		return await scanres(response);
	}
	catch (err: any)
	{
		//console.log("EROOr", err);
		return {status: err};
	}
}

export async function post(link: string, body: any = {}, f = fetch): Promise<any>
{
	var res: any;
	try{
		const isFormData: boolean = body instanceof FormData;
		const response: any = await f(BACKEND_HOST+ link, {
			mode: 'cors',
			method: "POST",
			headers: isFormData ? {} : {
				"Content-Type": 'application/json',
				"Authorization": "Bearer " + getCookies("USER_TOKEN")
			},
			body: isFormData ? body : JSON.stringify(body),
		})
		return await scanres(response);
	}
	catch (err: any)
	{
		error_site(err);
	}
}

export async function posterr(link: string, body: any = {}, f = fetch): Promise<any>
{
	var res: any;
	try{
		const isFormData: boolean = body instanceof FormData;
		const response: any = await f(BACKEND_HOST+ link, {
			mode: 'cors',
			method: "POST",
			headers: isFormData ? {} : {
				"Content-Type": 'application/json',
				"Authorization": "Bearer " + getCookies("USER_TOKEN")
			},
			body: isFormData ? body : JSON.stringify(body),
		})
		return await scanres(response);
	}
	catch (err: any)
	{
		//console.log("EROOr", err);
		return {status: err};
	}
}


export let status = {
	OK: "ok",
	KO: "Server could't respond",
	INVALID_USERNAME: "Username is invalid",
	USERNAME_ALREADY_EXIST: "Username already exists",
	INVALID_PASSWORD: "Password is invalid",
	INVALID_CHATNAME: "Chat name is invalid",
	CHATNAME_ALREADY_EXIST: "Chat name already exists",
	NOT_ALLOWED: "Not allowed",
	INVALID_LINK: "Invalid link",
	INVALID_USER_TOKEN: "Invalid user token",
	KO_42: "42 Auth Failed",
	INVALID_2FA: "2FA Failed",
	INVALID_RIGHTS: "You cannot access this ressource",
	INVALID_USER: "The requested user does not exists",
}

export function myStatus(status: string): string
{
	var roots	: Array<Array<string>> = [
		["/users/" + all.user.username, "is watchin you 👁👄👁"],
		["/users", "is watchin user profiles"],
		["/game", "is playing pong royal"],
		["/game/played", "is watching games stats"],
		["/chat", "is chating"],
		["/dms", "is chating with someone"],
		["/join", "is joinging a chat"],
	]
	for (let root of roots)
		if (status.startsWith(root[0]))
			return root[1]
	return "online";
}
