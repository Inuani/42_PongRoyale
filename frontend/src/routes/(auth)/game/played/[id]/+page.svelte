<script lang="ts">
    import { get } from "$lib/API";
    import { error } from "@sveltejs/kit";
	export let data : {id: string};

	async function getFriends(): Promise<Array<{a_players: number, username: string, place: number}>>
	{
		var res: Array<{a_players: number, username: string, place: number}> = (await get("game/game", {game_id: data.id})).game;
		res = res.sort((a: {place: number}, b: {place: number}) => a.place - b.place);
		return res;
	}
</script>

<h1>Game Ranking</h1>

{#await getFriends()}
	<p>loading...</p>
{:then players}
	<p style="padding: 10px" class="outlined">{players[0].a_players} Players</p>
	{#each players as player}
		<a style="display: inline;" href="/users/{player.username}">{player.username} : {player.place}e</a>
	{/each}
{:catch _}
	<p>couldn't load ressource</p>
{/await}