<script lang="ts">
    import { get } from "$lib/API";

	async function get_chatrooms(): Promise<Array<{invite_link: string, name: string}>>
	{
		var chatrooms: Array<{invite_link: string, name: string}> = (await get("chat/public")).public;
		return chatrooms;
	}

</script>

{#await get_chatrooms()}
	<p>loading...</p>
{:then chats} 
<h1>List of chats</h1>
{#each chats as chat}
<a href={`/join/${chat.invite_link}`}>{chat.name}</a>
<!-- <p>{chat.name}</p>
	<button on:click={async () => {await join(chat);}}>join</button> // href to join/[invite_link] -->
{/each}
	
{:catch _}
<p>an error occured</p>
{/await}