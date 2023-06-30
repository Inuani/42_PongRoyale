import * as CryptoJS from 'crypto-js';
import { getCookies } from './Cookies';
import { goto } from '$app/navigation';

export function encrypt(value: any): any{
	return value;
	value = JSON.stringify(value);
	var key: string | null = getCookies("USER_TOKEN");
	if (key == null)
	{
		goto("login")
		return;
	}
	key = CryptoJS.enc.Utf8.parse(key);
	let ciphertext: any = CryptoJS.AES.encrypt(value, key, {iv: key}).toString();
	return ciphertext;
}

export function decrypt(value: any): any{
	return value;
	var key: string | null = getCookies("USER_TOKEN");
	if (key == null)
	{
		goto("login")
		return;
	}
	key = CryptoJS.enc.Utf8.parse(key);
	let decryptedData: any = CryptoJS.AES.decrypt(value, key, {
	iv: key
	});
	return JSON.parse(decryptedData.toString( CryptoJS.enc.Utf8 ));
}