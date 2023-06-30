<script lang="ts">
    import { get, status } from "$lib/API";
    import all, { emit, on } from "$lib/global";
    import Message from "$lib/Message.svelte";
    import { afterUpdate, onDestroy } from "svelte";
	import ChatMember from "$lib/ChatMember.svelte";
    import Popup from "$lib/popup/Popup.svelte";
    import { goto } from "$app/navigation";
    import PopupEditChat from "$lib/popup/PopupEditChat.svelte";

    export let data : {chatName: string};
    
	import { copy } from 'svelte-copy';
	interface user {
		id: number;
		role: number;
		username: string;
		avatar_url: string;
	}
	var copyx		: boolean = false;

    var myChats 	: Array<{name: string}>;
    var messages	: Array<{username: string, content: string}> = []
	var message		: string = "";
    let chat		: {name: string, id: number, invite_link: string, status: string};
	let usersmap	: Map<string, any> = new Map();
	let users		: Array<user>;
	let mystatus	: number;
	let visible		: boolean = false;
    let element		: HTMLDivElement;
	var friendpopup : boolean = false;
	
	async function getMessages(name: string): Promise<void>
	{
		// goto("/chat/" + name);
		data.chatName = name;
		if (chat != null)
			emit("leave", chat.invite_link);
        chat = await get("chat", {"name": name,});
		emit("join_chat", chat.invite_link);
		await getchat(name);
	}

	async function getchat(name: string): Promise<void>
	{
		var response: {messages: Array<{username: string, content: string}>, users: Array<user>} = await get("chat/messages", {name: name});
		
		messages = response.messages;
		users = response.users;
		//console.log(users);
		for (var i: number = 0; i < response.users.length; i++)
			usersmap.set(response.users[i].username, response.users[i])
		var t: { username: string, role: number } | undefined = users.find((elem) => elem.username == all.user.username)
		if (t == undefined)
			return
		mystatus = t.role;
	}

	on("join_chat", async (): Promise<void> =>
	{
		await getchat(data.chatName);
	})

    async function getAll(): Promise<void>
	{
        myChats = (await get("chat_members/all")).all;
		await getMessages(data.chatName);
		on("message", (data) => {
			messages = [...messages, {username: data.username, content:data.message}];
		})
	}

	onDestroy(() => {
		emit("leave", chat.invite_link);
	});

    function sendMessage(): void {
		if (message.trim() !== "")
		{
			emit("message", {
				room: chat.invite_link,
				username: all.user.username,
				user_id: all.user.id,
				chat_id: chat.id,
				message:(message),
			});
			message = "";
		}
    }

    afterUpdate(() => {
		if(messages && element)
			scrollToBottom(element);
  	});
	
	$: if(messages && element) {
		scrollToBottom(element);
	}

	const scrollToBottom: (node: HTMLElement) => Promise<void> = async (node: HTMLElement): Promise<void> => {
		node.scroll({ top: node.scrollHeight, behavior: 'smooth' });
	};

	async function leave(): Promise<void>
	{
		await get("chat_members/remove", {chat_id: chat.id});
		goto("/mychats");			
	}

</script>

<!-- {#tru} -->
{#await getAll()}
    <p>loading...</p>
{:then _}
<div class="main">
    <div class="navbar outlined">
        <h3 class="nav-title">My chats:</h3>
        {#each myChats as _chat}
        <div class="navElem">
			<!-- on:click={async () => {await getMessages(_chat.name)}} -->
            <a on:click={()=> getMessages(_chat.name)} >
                {#if _chat.name == data.chatName}
                    <p class="mychats selected">{_chat.name}</p>
                {:else}
                    <p class="mychats">{_chat.name}</p>
                {/if}
            </a>
        </div>
        {/each}
    </div>
    <div class="message-box">
        <h2 class="title inverted">{data.chatName}</h2>
        <div class="chat-container" bind:this={element}>
            {#each messages as message}
                <Message message={(message.content)} user={usersmap.get(message.username)}/>
            {/each}
        </div>
		
        <div class="input-container">
            {#if mystatus >= 0}
				<input class="input" maxlength="400" type="text" placeholder="Enter a message" bind:value={message} on:keydown={event => event.key === 'Enter' && sendMessage()}>
				<button class="send-button" on:click={sendMessage}>Send</button>
			{:else}
				<p>you are mute</p>
			{/if}
        </div>

    </div>
	<div class="users outlined">
		<div class="button-row">
            <button on:click={() => {friendpopup = true}} >Invite friend</button>
			<button on:click={leave}>Quit chat</button>
			<button on:click={() => copyx = true} use:copy={chat.invite_link}>
				{#if !copyx}
				copy invite link
				{:else}
				copied
				{/if}
			</button>
			{#if mystatus >= 2}
				<button on:click={() => {/*console.log(visible);*/visible = true; visible = visible}}>Edit</button>
			{/if}
        </div>
        {#each users as user}
			{#if user.role != -2}
				<ChatMember bind:mystatus={mystatus} bind:user={user} chat={chat}></ChatMember>
			{/if}
        {/each}
    </div>
	<Popup users={[]} mode='chat' channel_id='{chat.id.toString()}'  link='{chat.invite_link}' channel_name='{chat.name}' bind:visible={friendpopup} />
	<PopupEditChat chatname="{chat.name}" bind:visible={visible} />
</div>

{:catch _}
	<p>an error occured</p>
{/await}

<style>
	.chat-container{
		/* height: auto; */
		width: 100%;
		overflow: auto;
        flex: 1;
	}

    .main {
        display: flex;
        flex-direction: row;
        align-items: stretch;
        justify-content: space-between;
        height: 100%;
        width: 100%;
        /* overflow: auto; */
        
    }


    .navbar {
        display: flex;
        flex-direction: column;
        padding: 20px;
        width: 20%;
		height: 400;
		overflow: auto;
    }
    .message-box {
        display: flex;
        flex-direction: column;
        border-radius: 20px;
        /* align-items: stretch; */
        padding: 0px 20px;
        margin: 0;
        flex: 1;
        width: 60%;
    }
	.users {
		display: flex;
        flex-direction: column;
        padding: 20px;
		overflow:auto;
        gap: 10px;
        /* flex: 0; */
        width: 20%;
	}
    /* .message {
        width: 100%;
    } */
    .title {
        margin-bottom: auto;
        border-radius: 20px;
        text-align: center;
    }
    .chat-container {
        display: flex;
        flex-direction: column;
        gap: 2px;
        padding: 10px;
    }
    .input-container {
        display: flex;
        justify-content: space-between;
        margin-top: auto;
        gap: 10px;
    }
    .input {
        flex: 1;
        border-radius: 10px;
    }
    .send-button {
        border-radius: 10px;
    }
    .mychats {
        border-radius: 10px;
        padding: 0px 10px;
    }
    .mychats:hover {
        background-color: var(--hover);
    }
    .selected {
        background-color: var(--hover);
    }
    .selected:hover {
        background-color: var(--shover);
    }
    button {
        font-size: 1rem;
    }
    .button-row {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 2px;
    }
    .nav-title {
        padding: 10px;
    }
</style>