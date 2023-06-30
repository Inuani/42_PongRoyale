<script lang=ts>
    import { goto } from "$app/navigation";
	import { get, post, posterr, status } from "$lib/API";
	import { sha256 } from 'js-sha256';

	export let data	: {invite_link: string};

	interface Chat{
		name: string,
		pass: string,
		id: number,
		status: string
	}

    let password	: string = '';
    let chat		: {name: string, pass: boolean, id: number, status: string};
    let chatMembers	: any[] = [];
	var err			: string = '';

    async function getChatAndMembers(): Promise<void>
	{
        chat = await get('chat/invite_link', {invite_link: data.invite_link});
        if (chat.status == status.OK)
            chatMembers = (await get('chat_members/members_of_channel', {channel_id: chat.id})).members_of_channel
    }

    async function join(chat: Chat): Promise<void>
	{
		var res: {status: string} = await posterr("chat/join_id", {
			channel_id:chat.id,
			is_admin:false,
            hashed_password: sha256(password),
		});
        //console.log(res);
        //console.log(chat);
        // return ;
		if (res.status != status.OK)
			err = res.status;
		else
			goto("/chat/" + chat.name);
	}

</script>

{#await getChatAndMembers()}
    <p>loading...</p>
{:then _}
    <h1>{chat.name}</h1>
    {#if chatMembers}
        <div>
            <h2>Chat members:</h2>
            <ul>
                {#each chatMembers as member}
                    <li><a href="/users/{member.username}">{member.username}</a></li>
                {/each}
            </ul>
        </div>
    {/if}
    {#if chat.pass}
        <input minlength="8" maxlength="20" type="password"placeholder="Enter password" bind:value={password}>
    {/if}
	<p>{err}</p>

    <button on:click={async () => {await join(chat);}}>join</button>
{:catch error}
    <p>Failed to load the chat...</p>
{/await}