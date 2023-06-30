export function setCookies(name: string, value: string, expire: null | number = null): void
{
	if (expire == null)
		document.cookie = `${name}=${(value)}; path=/;`
	else
		document.cookie = `${name}=${(value)}; max-age=${expire}; path=/;`
}

export function deleteCookies(name: string): void
{
	document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;`
}

export function getCookies(name: string): null | string
{
	if (document.cookie == undefined)
		return null;
	var cookies: Array<string> = document.cookie.split("; ");
	for (var i: number = 0; i < cookies.length; i++) {
		if (cookies[i].split("=")[0] == name)
		{
			return (cookies[i].split("=")[1])
		}
	}
	return (null);
}

export function getGet(name: string): null | string
{
	if (document.URL == undefined)
		return null;
	var vars: Array<string> = document.URL.split("?")
	if (vars.length != 2)
		return null;
	var vars: Array<string> = vars[1].split("&");
	if (vars == undefined)
		return null;
	for (var i: number = 0; i < vars.length; i++) {
		vars[i] = vars[i].replace("#/", "");
		if (vars[i].split("=")[0] == name)
		{
			return (vars[i].split("=")[1])
		}
	}
	return (null);
}