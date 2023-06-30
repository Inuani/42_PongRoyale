import type { Socket } from 'socket.io-client';
import { writable, type Writable } from 'svelte/store';
import { encrypt } from './Crypter';

export var BACKEND_HOST		: string = "http://localhost:3000/";
export var FRONTEND_HOST	: string = "http://localhost";

const all = {
    user: null as null | any,
    socket: null as null | Socket,
    notifs: writable([]) as Writable<Array<any>>,
};

export function	emit(event: string, data: any | null = null): void
{
	try
	{
		if (all.socket == null)
			throw "ta gueul"
		all.socket.emit(event, encrypt(data));
	}
	catch
	{
		document.location.href = "/login";
	}
}

export function	on(event: string, func: (...args: any[]) => void): void
{
	try
	{
		if (all.socket == null)
			throw "ta gueul"
		all.socket.on(event, func);
	}
	catch
	{
		document.location.href = "/login";
	}
}


// interface AllType {
//     user: null | any;
//     socket: null | Socket;
//     notifs: Writable<Array<any>>;
// }

export default all;