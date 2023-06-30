import { status } from "src/status";

export async function get42Token(code: string)
{
	const formData = new URLSearchParams();
	formData.append('grant_type', 'authorization_code');
	formData.append('client_id', process.env.API_42_UID);
	formData.append('client_secret', process.env.API_42_SECRET);
	formData.append('code', code);
	formData.append('redirect_uri', process.env.FRONTEND_HOST);
	try
	{
		const res = await fetch("https://api.intra.42.fr/oauth/token", {
				method: "POST",
				body: formData
			});
		const response = await res.json();
				if (response["access_token"] == undefined)
				throw response;
		  return response["access_token"]
	}
	catch
	{
	   throw status.KO_42
	}
}

export async function get42Infos(token: string)
{
  try
  {
	  const res = await fetch("https://api.intra.42.fr/v2/me", {
		  method: "GET",
		  headers: {
			  "Authorization": "Bearer " + token,
		  },
	  });
	  return await res.json();
  }
  catch
  {
	 throw status.KO_42
  }
}
