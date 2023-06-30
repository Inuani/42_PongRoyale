// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
//export const prerender = true;

import { redirect } from '@sveltejs/kit';
import all from '$lib/global';
import { getCookies, setCookies } from '$lib/Cookies';
import { geto, status } from '$lib/API.js';
export const ssr: boolean = false;

export async function load({ url }): Promise<void>
{
	var code	: string | null = url.searchParams.get("code");
	if (code != undefined)
	{
		var token: {status: string, token: string, info: any} = await geto("users/42", {code: code});
		if (token.status != status.OK)
			throw redirect(303, '/login');
		if (token.token != undefined)
		{
			setCookies("type", "user");
			setCookies("USER_TOKEN", token.token);
			throw redirect(303, '/home');
		}
		else
		{
			all.user = {
				username: token.info.login,
				avatar_url: token.info.image.link,
				login: token.info.login,
				type: 42,
			}
			throw redirect(303, '/login/signup');
		}
	}
	if (getCookies("USER_TOKEN") == undefined) throw redirect(303, '/login');
	throw redirect(302, "/home");
}