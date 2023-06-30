<script lang="ts">
    import { get } from "$lib/API";
    import all, { emit, on } from "$lib/global";
    import Message from "$lib/Message.svelte";
    import { afterUpdate} from "svelte";
    export let data	: {chatName: string};
    
    var users		: Array<{username: string}> = [];
    var messages	: Array<{username:string, message:string, from_id: number, to_id: number}> = []
	var message		: string= "";
	let user		: {id: number, username: string};
	let mystatus	: number = 0;
	let element		: HTMLDivElement;

	async function getMessages(name: string): Promise<void>
	{
		var _user: {user: any} = await get("users/profile", {"username": name})
		user = _user.user;
		messages = (await get("friends/dms", {"to_id": user.id})).dms;
        // console.log(messages);
	}
	
    async function getAll(): Promise<void>
	{
		users = (await get("friends")).friends;
		await getMessages(data.chatName);
		on("dm_message", (data) => {
			messages = [...messages, {username:data.username, message:data.message, from_id: data.from_id, to_id: data.to_id}];
		})
	}

    function sendMessage(): void {
		if (message.trim() !== "")
		{
			emit("dm_message", {
				to_id: user.id,
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

	const scrollToBottom = async (node: HTMLElement) => {
		node.scroll({ top: node.scrollHeight, behavior: 'smooth' });
	}; 



</script>


{#await getAll()}
    <p>loading...</p>
{:then _}
<div class="main">
    <div class="navbar outlined">
        <h3 class="nav-title">My DMs :</h3>
        {#each users as usr}
        <div class="navElem">

            <a href="/dms/{usr.username}" on:click={async () => {await getMessages(usr.username)}}>
                {#if usr.username == data.chatName}
                    <p class="mychats selected">{usr.username}</p>
                {:else}
                    <p class="mychats">{usr.username}</p>
                {/if}
            </a>
        </div>
        {/each}
    </div>
    <div class="message-box">
        <a href="/users/{data.chatName}"><h2 class="title inverted">{data.chatName}</h2></a>
        <div class="chat-container" bind:this={element}>
            {#each messages as message}

                <!-- <Message message={(message.content)} user={usersmap.get(message.username)}/> -->
                {#if message.from_id == user.id}
                    <Message message={(message.message)} user={user}/>
                {:else}
                    <Message message={(message.message)} user={all.user}/>
                {/if}
            {/each}
        </div>
        <div class="input-container">
            {#if mystatus >= 0}
				<input class="input" type="text" maxlength="400" placeholder="Enter a message" bind:value={message} on:keydown={event => event.key === 'Enter' && sendMessage()}>
				<button class="send-button" on:click={sendMessage}>Send</button>
			{:else}
				<p>you are mute</p>
			{/if}
        </div>

    </div>
	<!-- <div class="users">
        {#each users as user}
			<ChatMember mystatus={mystatus} user={user} chat={chat}></ChatMember>
        {/each}
    </div> -->
</div>
{:catch _}
<p>an error occured</p>
{/await}

<style>
    .chat-container{
		height: auto;
		overflow: auto;
        flex: 1;
	}

    .main {
        display: flex;
        align-items: stretch;
        justify-content: space-between;
        min-height: 100%;
        min-width: 100%;
        overflow: auto;
        
    }
	/* .users {
		display: flex;
        flex-direction: column;
        padding: 20px;
		overflow: auto;
        gap: 10px;
        flex: 0;
        min-width: 200px;
	} */

    .navbar {
        display: flex;
        flex-direction: column;
        padding: 20px;
		min-width: 200px;
		height: 400;
		overflow: auto;
    }
    .message-box {
        display: flex;
        flex-direction: column;
        border-radius: 20px;
        align-items: stretch;
        padding: 0px 20px;
        margin: 0;
        flex: 1;
    }
    /* .message {
        width: 500px;
    } */
    .title {
        margin-bottom: 10px;
        border-radius: 20px;
        text-align: center;
    }
    .chat-container {
        display: flex;
        flex-direction: column;
        gap: 2px;
        padding: 10px;
        border-right: 2px solid var(--front);
    }
    .input-container {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
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
	
    .nav-title {
        padding: 10px;

    }
</style>