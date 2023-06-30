<script lang=ts>
	import {setCookies } from "$lib/Cookies"
    import { get, geto, status } from '$lib/API';
    import { goto } from '$app/navigation';
    import { FRONTEND_HOST } from "../../lib/global";

	async function anonym_login() : Promise<void>{
		var token: {id: number, token: string, username: string, status: string} = await geto("users/anon")
		if (token.status != status.OK)
			return ;
		setCookies("type", "anonym");
		setCookies("id", token.id.toString());
		setCookies("USER_TOKEN", token.token)
		setCookies("name", token.username);
		document.location.href = ("/home");
	}
	
	function login42 (): void{
		window.location.href = "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-cb92b4ad3a2b70b10bdd3629be0f67128c2bb6c04dc73afecc93393f9b433ffa&redirect_uri="+FRONTEND_HOST+"&response_type=code";
	}

</script>

<div class="container">
	<button class="button" on:click={login42}>
		Login With 42 Intra
	</button>
	<a href="/login/signup">
		<button class="button">
			Create Account
		</button>
	</a>
	<a href="/login/login">
		<button class="button">
			Login Account
		</button>
	</a>
	<div>
		<button class="button" on:click={anonym_login}>
			Join As Anonymous
		</button>
	</div>
</div>


<style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        z-index: 10;
    }
</style>