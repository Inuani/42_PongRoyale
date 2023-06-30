<script lang="ts">
    import { get } from "$lib/API";
    import all from "$lib/global";

	export let data: {username: string};

	$: isSelf = data.username == all.user.username ? true : false;

	async function getFriends() : Promise<Array<{username: string}>>
	{
		return (await get("friends")).friends;
	}

</script>
{#if isSelf}
	<h1>My Friends :</h1>
{:else}
	<h1>{data.username}'s Friends :</h1>
{/if}


{#await getFriends()}
	<p>loading...</p>
{:then users}
	{#if users.length == 0}
		{#if isSelf}
			<p>You don't have any friends yet !</p>
			<p>Go to another user's profile -> Send friend request</p>
		{:else}
			<p>{data.username} is a fucking incel. He has no friends.</p>
		{/if}
	{/if}
	{#each users as user}
		<div class="row">
			<a href="/users/{user.username}">{user.username}</a>
			<a class="dm-button outlined" href="/dms/{user.username}">chat</a>
		</div>
	{/each}
{:catch _}
	<p>{_}</p>
{/await}

<style>
	.row {
		display: flex;
		gap: 20px;
		align-items: center;
	}
	.dm-button {
		padding: 10px;
	}

</style>