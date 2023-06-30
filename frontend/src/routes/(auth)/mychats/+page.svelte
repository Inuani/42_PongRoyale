<script lang="ts">
    import { get } from "$lib/API";
    import all from "$lib/global"

    var myChats: Array<{name: string}>;
	var friends: Array<{username: string}>;
    async function getMyChats(): Promise<void> {
        myChats = (await get("chat_members/all")).all;
        friends = (await get("friends")).friends;
    }
	
</script>


<div class="top">
    <h1>My chats</h1>
   
{#if all.user.login != "anon"}
<a href="mychats/newChat"><button class="add">+</button></a>
{/if}
</div>

{#if all.user.login != "anon"}
    {#await getMyChats()}
        <p>loading...</p>
    {:then _}
        <div class="bigrow">
            <div class="left outlined">
                <h3>Chatrooms :</h3>
                {#if myChats.length == 0}
                    <p>You don't have any chatrooms yet. Click on the plus button!</p>
                {/if}
                {#each myChats as chat}
                    <a href="/chat/{chat.name}">
                        <p>{chat.name}</p>
                    </a>
                {/each}
            </div>
            <div class="right outlined">
                <h3>DMs :</h3>
                {#if friends.length == 0}
                            <p>You haven't chated with your friends yet !</p>
                        {/if}
                {#each friends as user}
                    <div class="row">
                        <a class="dm-button" href="/dms/{user.username}">{user.username}</a>
                    </div>
                {/each}
            </div>
        </div>
		{:catch _}
		<p>an error occured</p>
    {/await}
{:else}
    <p>Anonymous cannot chat !</p>
{/if}

<style>
    .top {
        display: flex;
        align-items: center;
        gap: 20px;
    }
    .add {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 2px solid black;
    }

    .bigrow {
        display: flex;
        gap: 30px;
    }
    .right, .left {
        padding: 20px;

    }
</style>