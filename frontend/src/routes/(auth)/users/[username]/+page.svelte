<script lang="ts">
    import { goto } from '$app/navigation';
	import { get, myStatus, post, status } from '$lib/API';
    import Avatar from '$lib/Avatar.svelte';
    import { deleteCookies } from '$lib/Cookies';
	import all, { emit, on } from '$lib/global';

    export let data		: {username: string, route: string};
	var user			: user;
	var st				: string = "offline";
	let friendStatus	: 'ublocked' | 'blocked' | 'not_friends' | 'request_sent' | 'friends' = 'not_friends';
	var link			: null | string = null;
	var game_status		: number;
	var infos			: {games: number, top1: number} = {games: 0, top1: 0};

	interface user {login: string, id: number, username: string, avatar_url: string, bio: string, elo: number}

	$: isSelf = data.username == all.user.username ? true : false;

	async function getUser() : Promise<user>
	{
		if (data.username == all.user.username)
		{
			user = all.user;
			if (user.login != "anon")
				infos = (await get("game/info", {username: user.login})).info;
		}
		else
		{
			var req: {status: string, user: user} = await get("users/profile", {username: data.username});
			user = req.user;
			infos = (await get("game/info", {username: user.login})).info;
			//console.log("infos", infos);
			await getFriendshipStatus();
		}

		emit("ping", user.id);
		return user;
	}

	on("game_status", (data) => {
		game_status = data;
	});

	on("pong", (data) => {
		if (data.from == user.id)
			st = myStatus(data.status);
		if (data.status.startsWith("/game/"))
		{
			link = data.status.split('/').at(-1);
			emit("game_status", link);

		}
	});
	
	async function getFriendshipStatus() : Promise<void> {
		const res: {friendStatus: 'ublocked' | 'blocked' | 'not_friends' | 'request_sent' | 'friends'} = await get('friends/status', {
			user_id: user.id
		});
	
		if (res.friendStatus == "blocked")
			throw "this dude blocked u bro...";
		friendStatus = res.friendStatus;

	}

	function sendFriendReq() : void {
            emit("notif_send", {
		    from: all.user.username,
		    id_from: all.user.id,
		    id_to: user.id,
		    pending: true,
		    type: "friend",
		    message: "I want to be your friend bro",
		    link: null,
	    });
		friendStatus = 'request_sent';
    }
    
	function logout() : void
	{
		deleteCookies("type");
		deleteCookies("USER_TOKEN");
		deleteCookies("type");
		deleteCookies("USER_TOKEN");
		//console.log('nigga')
		document.location.href = "/login"
	}

	async function block() : Promise<void>
	{
		await post("friends/block", {user_id: user.id});
		friendStatus = "ublocked"
	}

	async function unfriend() : Promise<void>
	{
		await post("friends/kill", {user_id: user.id});
		friendStatus = "not_friends"
	}
</script>

{#await getUser()}
	<p>loading...</p>
{:then usr}
	<div class="top">
		<h1 class="username">{usr.username}</h1>
		<Avatar src="{usr.avatar_url}" size={120} />
	</div>
	{#if isSelf && all.user.login != "anon"}
		<div class="friends outlined">
			<a href="{data.route}/friends"><p>Friends</p></a>
		</div>
	{/if}
	<div class="bio">
		<p>Bio :</p>
		<p class="bio-text">{usr.bio}</p>
	</div>
	{#if all.user.login != "anon"}
	<div class="stats outlined">
		{#if !isSelf}
			<p>Status: {st}</p>
		{/if}
		{#if link != null && game_status >= 0}
			<button on:click={() => {goto("/game/" + link)}}>
				{#if game_status == 0}
					view
				{:else if game_status == 1}
					join
				{/if}
			</button>
		{/if}
		<p>Tops 1		:	{infos.top1}</p>
		<p>ELO Rank		:	{user.elo}</p>
		<p>Game played	:	{infos.games}</p>

		<div class="friends outlined">
			<a href="{data.route}/games"><p>See Games</p></a>
		</div>
		<div class="friends outlined">
			<a href="{data.route}/achievements"><p>Achievements</p></a>
		</div>

	</div>
	{/if}
	<div class="buttons">
		{#if !isSelf}
			{#if friendStatus === 'not_friends'}
				<button on:click={sendFriendReq}>Send Friend Request</button>
			{:else if friendStatus === 'request_sent'}
				<p>Friend request sent!</p>
			{:else if friendStatus === 'friends'}
				<button on:click={()=> goto("/dms/" + data.username)}>Dm your friend!</button>
			{/if}
			{#if friendStatus == "ublocked"}
				<button on:click={unfriend}>unblock</button>
			{:else}
				<button on:click={block}>block</button>
			{/if}
		{:else}
			{#if all.user.login != "anon"}
			<button on:click={logout}>Logout</button>
			<button on:click={()=> goto('/edit')}>Edit Profile</button>
			{:else}
			<button on:click={logout}>exit</button>
			{/if}
		{/if}
	</div>
{:catch err}
	<p>couldn't load user: {err}</p>
{/await}

<style>

	.friends{
		padding: 1vmin;
	}

	.top, .buttons{
		display: flex;
		align-items: center;
		gap: 20px;
	}
	.bio {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.stats {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5px;
		padding: 40px 60px;
	}
	.bio-text {
		padding: 10px;
		min-width: 200px;
		text-align: center;
	}

</style>
