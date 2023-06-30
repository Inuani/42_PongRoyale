import * as CryptoJS from 'crypto-js';

export function encrypt(key, value: any){
	return value;
	value = JSON.stringify(value);
	key = CryptoJS.enc.Utf8.parse(key);
	let ciphertext = CryptoJS.AES.encrypt(value, key, {iv: key}).toString();
	return ciphertext;
}

export function decrypt(key, value: string){
	return value;
	key = CryptoJS.enc.Utf8.parse(key);
	let decryptedData = CryptoJS.AES.decrypt(value, key, {
	iv: key
	});
	var res = decryptedData.toString( CryptoJS.enc.Utf8 );
	try{
		return JSON.parse(res);
	}catch{
		return res;
	}
}