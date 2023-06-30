<script lang="ts">
    import all from "$lib/global";

	export let message	: string;
	export let username	: any;
</script>

{#if username != all.user.username}
    <div class="container">
        <div class="bubble darker">
            <span class="time-left">{username}</span>
            <p>{message}</p>
        </div>
    </div>
{:else}
    <div class="container self">
        <div class="bubble">
            <!--<span class="time-right">{user.username}</span>-->
            <p>{message}</p>
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