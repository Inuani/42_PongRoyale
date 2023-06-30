<script lang="ts">
    import { goto } from "$app/navigation";
    import { setCookies } from "$lib/Cookies";
    import Switch from "$lib/Switch.svelte";
	import all, { emit, on } from "$lib/global";
    import { loop_guard } from "svelte/internal";

	var games			: Array<any> = [];
	let players_amount 	: number = 2;
	let _width			: number;
	let _heigh			: number;

	on("game_list", (list: any) => {
		games = list;
	})
	
	on("rm_game", (game: any) => {
		games = games.filter((g) => g.id !== game.id);
		//console.log(games);
	})

	//must make them lighter
	on("update_game", (updatedGame) => {
		games = games.map((game) => {
		if (game.id === updatedGame.id) {
			return updatedGame; // Update the game object
		}
			return game; // Return the original game object if no match
	});
	})

	on("new_game", (game: any) => {
		games = [...games, game];
		//console.log(games);
	})

	on("join_game", (id: any) => {
		emit("leave", "WatchGames");
		goto("/game/" + id.toString())
		// document.location.href = "/game/" + id.toString()
	})
	
	emit("see_games");

	function new_game(): void
	{
		emit("new_game", {
			a_players: players_amount,
			password: privates,
			elo: all.user.elo
		});
	}

	function queue_game(): void
	{
		emit("queue_game", {
			a_players: 2,
			elo: all.user.elo,
		});
	}
	var privates = false;
</script>

<svelte:window bind:innerWidth={_width}  bind:innerHeight={_heigh}/>

<div class="container">
    <div class="list outlined main">
		<div class="slider boys outlined">
			<div class="slider2">
				<h2> Create Game </h2>
				<input id="slider" type="range" min="2" max="10" bind:value={players_amount} />
				<p>Number of Players: {players_amount}</p>
				<p><Switch bind:checked={privates} />  private</p>
				<button on:click={new_game}>
					New Game
				</button>
			</div>
		</div>
		<div class="button-container boys outlined">
			<h2> 1 VS 1 </h2>
			<button on:click={queue_game}>
				Solo/q
			</button>
		</div>

	</div>
    
	{#if _width < _heigh}
	<div class="mobile">
		<div class="list outlined">
			<h2>Join Game</h2>
			<div class="game-list">
				<div class="column">
				{#each games as game }
					{#if !game.started && game.soloq == false}
						<div class="game-item">
							<span>{game.players.length}/{game.a_players}</span>
							<button on:click={() => goto("/game/" + game.id.toString())}>Join</button>
						</div>
					{/if}
				{/each}
				</div>
			</div>
		</div>
	
		<div class="list outlined">
			<h2>View Game</h2>
			<div class="game-list">
			{#each games as game }
				{#if game.started && game.soloq == false}
				<div class="game-item">
					<span>{game.players.length}/{game.a_players}</span>
					<button on:click={() => goto("/game/" + game.id.toString())}>View</button>
				</div>
				{/if}
			{/each}
			</div>
		</div>
	</div>
	{:else}
	<div class="list outlined">
		<h2>Join Game</h2>
		<div class="game-list">
			<div class="column">
			{#each games as game }
				{#if !game.started && game.soloq == false}
					<div class="game-item">
					<span>{game.players.length}/{game.a_players}</span>
					<button on:click={() => goto("/game/" + game.id.toString())}>Join</button>
					</div>
				{/if}
			{/each}
			</div>
		</div>
	</div>

	<div class="list outlined">
		<h2>View Game</h2>
			<div class="game-list">
				<div class="column">
					{#each games as game }
						{#if game.started && game.soloq == false}
						<div class="game-item">
						<span>{game.players.length}/{game.a_players}</span>
						<button on:click={() => goto("/game/" + game.id.toString())}>View</button>
						</div>
						{/if}
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>

<style>

	h2 {
		padding-top: 5%;
        text-align: center;
		padding-bottom: 5%;
		font-size: 3vmin;
    }

	p{
		font-size: 2.5vmin;
	}
	.slider {
	    width: 100%;
		height: 60%;
        /* justify-content: center;  Center the sliders horizontally */
		overflow: auto;
  	}
	.button-container {
		padding-top: 5%;
		padding-left: 5%;
		padding-right: 5%;
		padding-bottom: 5%;
		margin-bottom: 1%;
		height: 30%;
        display: flex;
		flex-direction: column;
        /* gap: 10px; */
		overflow: auto;
    }
	.slider2{
		width: 100%;
		height: 100%;
		padding-left: 5%;
		padding-right: 5%;
		display: flex;
		flex-direction: column;
		gap: 10px
	}
	button{
		margin-left: auto;
		margin-right: auto;
		width: 80%;
		font-size: 3vmin;
		/* width: 100%; */
	}
	.boys{
		margin-top: 5%;
		margin-bottom: 5%;
	}

	#slider {
		-webkit-appearance: none;  /* Override default CSS styles */
		appearance: none;
		width: 100%; /* Full-width */
		max-height: 3px; /* Specified height */
		padding: 0;
		border: 0;
		background-color: var(--shover); /* Grey background */
		outline: none; /* Remove outline */
		opacity: 0.7; /* Set transparency (for mouse-over effects on hover) */
		-webkit-transition: .2s; /* 0.2 seconds transition on hover */
		transition: opacity .2s;
	}
	#slider:hover {
		opacity: 1; /* Fully shown on mouse-over */
	}
	#slider::-webkit-slider-thumb {
		-webkit-appearance: none; /* Override default look */
		appearance: none;
		width: 20px; /* Set a specific slider handle width */
		aspect-ratio: 1/1;
		border-radius: 50%;
		background: var(--front); /* Green background */
		cursor: pointer; /* Cursor on hover */
	}
	#slider::-moz-range-thumb {
		-webkit-appearance: none; /* Override default look */
		width: 20px; /* Set a specific slider handle width */
		height: 20px; /* Slider handle height */
		background: var(--front); /* Green background */
		cursor: pointer; /* Cursor on hover */
		border-radius: 50%;
	}



	.container {
		font-size: 3vmin;
        display: flex;
		height: 100%;
		width : 100%;
        justify-content: space-between;
		gap: 5%;
    }

	/* faut changer les pixels */
	.list {
		widows: 45%;
		width: 50%;
    	padding-right: 1%;
		padding-left: 1%;
		/* position: inherit; */
		overflow: auto;
	}

	.main {
		/* widows: 45%; */
		width: 38%;
		
		/* gap: 10%; */
		/* overflow: auto; */
	}



	.game-list {
	  display: flex;
	  overflow: auto;
	}
  
	.column {
	  flex: 1;
	}
  
	.game-item {
	  display: flex;
	  align-items: center;
	  margin-left: auto;
	  margin-right: auto;
	  gap: 10%;
	  margin-bottom: 10px;
	}

	@media  (orientation: portrait) {
		.container{
			flex-direction: column;
		}

		.mobile{
			width: 100%;
			/* flex: 1; */
        	display: flex;
			flex-direction: row;
			height: 40%;

			/* display: inline; */
			/* position: relative; */
		}
		.list {
			/* widows: 45%; */
			width: 48%;
			margin-right: 1%;
			margin-left: 1%;
			/* position: inherit; */
			/* overflow: auto; */
		}

		.main {
			widows: 45%;
			width: 100%;
			height: 60%;
        	display: flex;
			flex-direction: row;
			
			gap: 2%;
			/* overflow: auto; */
		}

		.slider {
			width: 50%;
			height: 90%;
			margin-top: auto;
			margin-bottom: auto;
			/* justify-content: center;  Center the sliders horizontally */
		}
		.button-container {
			margin-top: auto;
			margin-bottom: auto;
			padding-top: 5%;
			padding-left: 5%;
			padding-right: 5%;
			padding-bottom: 5%;
			height: 90%;
			width: 50%;
			display: flex;
			flex-direction: column;
			/* gap: 10px; */
    }

	}
  
  </style>
  
  
  
  
  

  <!-- <button on:click={direction}>
	join
</button> -->

<!-- {#each games as game}
<br>
	<h4>{game.players.length} / {game.a_players}</h4> 
	<button on:click={() => goto("/game/" + game.id.toString())}> 
	{#if !game.started}
		join 
	{:else}
		view
	{/if}
</button>
{/each} -->