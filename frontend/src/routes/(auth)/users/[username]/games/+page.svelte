<script lang="ts">
    import { get } from "$lib/API";
	export let data	: {username: string};

	async function getFriends() : Promise<Array<{game_id: string, a_players: number, place: number}>>
	{
		return (await get("game/user", {username: data.username})).user;
	}

</script>

<h1>{data.username}'s Game History</h1>

{#await getFriends()}
	<p>loading...</p>
{:then games}
	{#if games.length == 0}
		<p>{data.username} hasn't played yet !</p>
	{/if}
	{#each games as game}
		<a style="display: inline;" href="/game/played/{game.game_id}">{game.a_players} Players : {game.place}e</a>
	{/each}
{:catch _}
	<p>an error occured</p>
{/await}