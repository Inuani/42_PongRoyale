
import all, { BACKEND_HOST, emit, on } from '$lib/global'
import { getCookies, deleteCookies } from '$lib/Cookies';
import { get, geto, status } from '$lib/API';
import { io } from 'socket.io-client';
import { encrypt } from '$lib/Crypter.js';
import { goto } from '$app/navigation';

export async function load({fetch}): Promise<void> {
	if (getCookies("type") == null || getCookies("USER_TOKEN") == null)
	{
		document.location.href = '/login';
		return ;
	}
	if (getCookies("type") == "anonym")
	{
		if (getCookies("name") == undefined || getCookies("id") == undefined)
		{
			deleteCookies("name");
			deleteCookies("id");
			deleteCookies("USER_TOKEN");
			deleteCookies("type");
			document.location.href = '/login';
		}
		all.user = {
			login: "anon",
			username: getCookies("name") == undefined ? "Looser" : getCookies("name"),
			id: getCookies("id"),
			bio: "no life no life",
			avatar_url: "https://icon-library.com/images/anon-icon/anon-icon-1.jpg",
		}
		set_up_signals();
		return ;
	}
	var me: {status: string, user: any} = await geto("users/me", {}, fetch);
	if (me.status == status.KO)
	{
		document.location.href = ('/500');
		return ;
	}
	if (me.status != status.OK)	
	{
		deleteCookies("USER_TOKEN");
		deleteCookies("type");
		document.location.href = '/login';
		return ;
	}
	all.user = me.user;
	var notifs: any = (await get("notif/to", {}, fetch)).notifs;
	all.notifs.set(notifs);
	set_up_signals();
}

function set_up_signals(): void
{
	try
	{
		all.socket = io(BACKEND_HOST, {
			query: "token=" + getCookies("USER_TOKEN")
		});
	}
	catch
	{
		goto('/500');
	}

	emit("join", encrypt(all.user.id.toString()));

	on("notif", (notif) => {
		all.notifs.update( notifs => [...notifs, notif]);
	});

	on("reload", (notif) => {
		document.location.reload();
	});
	
	on('error', (error) => {
		console.error('Socket connection error:', error);
	});

	on("notif_status", (notif) => {
		
	});

	on("ping", (id) => {
		emit("pong", {
			to:		id,
			from:	all.user.id,
			status: document.location.pathname,
			path: 	document.location.pathname,
		});
	});
}