<script lang="ts">
    import { geto, status } from "$lib/API";
    import { setCookies } from "$lib/Cookies";
	import { sha256 } from 'js-sha256';
    import Switch from "$lib/Switch.svelte";
    
	var username	: string = '';
	var password	: string = '';
	var token		: string = '';
	var err			: string = '';
	var t2fa		: boolean = false;

    async function login() : Promise<void>
	{
		var response: {status: string, token: string} = await geto("users/login", {
			"username": username,
			"password": sha256(password),
			"token": token,
		})
		err = "";
	 	if (response.status != status.OK)
		{
			err = response.status;
			return ;
		}
		setCookies("USER_TOKEN", response.token);
		setCookies("type", "user");
		document.location.href = "/home";
	}

</script>

<form class="container" on:submit|preventDefault={login}>

	<h1>Login</h1>

    <div class="input">
        <label for="username">Username</label>
        <input type="text" id="username" bind:value={username}/>
    </div>

    <div class="input">
        <label for="password">Password</label>
        <input type="password" id="password" bind:value={password}/>
    </div>
	<p>Double Authentification Enabled<Switch bind:checked={t2fa} /></p>
		{#if t2fa}
		<div class="input">
			<label for="token">Token</label>
			<input type="text" id="token" bind:value={token}/>
		</div>
		{/if}
	{err}
    <button type="submit">Login</button>

</form>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
	}
	.input {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: flex-start;
	}
</style>