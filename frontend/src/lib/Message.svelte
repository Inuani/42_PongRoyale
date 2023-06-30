<script lang="ts">
    import all from "$lib/global";
    import Avatar from "$lib/Avatar.svelte";

	export let message	: string;
	export let user		: any;

	function setuser(): void
	{
		user = {
			username:"quitter",
			avatar_url: "https://icons.veryicon.com/png/o/business/onezone-business-geographic-services-icon-v10/quit-icon.png",
		}
	}
	if (user == undefined)
		setuser()
</script>

{#if user == undefined}
	{setuser()}
{:else if user.username != all.user.username}

<div class="container">
	{#if user.avatar_url}
		<a href="/users/{user.username}"><Avatar src="{user.avatar_url}" size={30} class="right"/></a>
	{/if}
	<div class="bubble darker">
		<span class="time-left">{user.username}</span>
					{#if user.status == "ublocked"}
						<button on:click={() => {user.status = ''}}> u block this user, click to reveal</button>
					{:else if user.status == "blocked"}
						<p> this user blocked u</p>
					{:else}
						{#if message.startsWith("/img ")}
							<img src="{message.substring(5)}" alt="">
						{:else}
							<p>{message}</p>
						{/if}
					{/if}
	</div>
</div>
{:else}
    <div class="container self">
        {#if user.avatar_url}
            <Avatar src="{user.avatar_url}" size={30} class="right"/>
        {/if}
        <div class="bubble">
            <!--<span class="time-right">{user.username}</span>-->
            {#if message.startsWith("/img ")}
           	 <img src="{message.substring(5)}" alt="">
			{:else}
			<p>{message}</p>
			{/if}
        </div>
    </div>
{/if}

<style>
    .container {
        display: flex;
        gap: 10px;
    }
    .self {
        flex-direction: row-reverse;
        justify-content: flex-start;
    }
    .bubble {
        display: flex;
        flex-direction: column;
        border-radius: 10px;
        padding: 0px 10px;
        background-color: var(--hover);
        max-width: 80%;
    }
    .bubble.darker {
        background-color: var(--shover);
    }
    p {
        font-size: 1rem;
    }
    /* .time-right {
        text-align: right;
    } */
    .time-left {
        text-align: left;
    }
    span {
        font-size: 0.9rem;
        color: var(--front);
    }
    /* .right {
        flex: 0;
    } */
</style>