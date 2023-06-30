<script lang="ts">
    import all from '$lib/global';
	export var data: {err: string};
	var visible = data.err != ""

	setTimeout(() => {
		visible = false;
	}, 2000);

    $: isLoggedIn = all.user === null ? false : true;

</script>

<div class="main">
	{#if visible}
		<p class="errormsg">{data.err}</p>
	{/if}
	<h1>@Pong(Royale)</h1>
	<p>Welcome to @Pong(Royale)</p>
	<div class="buttons">
		<a href="/game">
			<button class="salut">Play Game!</button>
		</a>
		<a href="/mychats">
			<button class="salut">Chat</button>
		</a>
	</div>
</div>

<style>

	.main{
        display: flex;
        align-items: center;
        flex-direction: column;
		width: 100%;
		height: 100%;
	}

    h1 {
        font-size: 10vmin;
		height: 100%;
    }
	p {
        font-size: 4vmin;
	}

    .buttons {
        display: flex;
        align-items: center;
        gap: 30px;
		width: auto;
		height: 100%;
    }

	.salut {
		font-size: 5vmin;
		width: 100;
	}
	.errormsg {
		color: rgb(255, 110, 110);
	}
	
</style>