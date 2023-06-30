import { status } from '$lib/API.js';

export function load({url}): {err: string}
{
	var err: string | null = url.searchParams.get("err");
	if (err == null)
		err = "";
	else if (Object.values(status).indexOf(err) == -1)
		err = "Stop playing with our error system";
	return {err: err};
	
}