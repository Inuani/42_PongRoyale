<script lang="ts">

	import { onDestroy, onMount} from 'svelte';
	import { setUp, draw, setCanvas} from './render_pong';
	import Anim from './endAnim.svelte';
    import all, { on } from '$lib/global';

	let _canvas		: HTMLCanvasElement;
	export let game	: any;
	var events		: Array<string> = [];
	let interval	: number;
	var visible		: boolean = false
	var _width		: number;
	var _heigh		: number;
	
	onMount((): void => {
		// console.log(screenSize)
		setCanvas(_canvas);
		newGame();
	});

	onDestroy((): void => {
		clearInterval(interval);
	})

	function newGame(): void
	{
		var index: number = game.pong.usernames.findIndex((elem: string) => elem == all.user.username)
		clearInterval(interval);
		setUp({
			pong: game.pong,
			game: game.id,
			io: null,
			username: "me",
			index: index,
		})
		visible = true;
		interval = setInterval(() => {
			try {
				//console.log("from draw", game.pong.balls[0].pos);
				draw();
			} catch {
				
			}
		}, 16)
	}

	on("game_data", (g: any): void => {
		game.pong.balls = g.balls;
		for (let i in game.pong.players)
		{
			game.pong.players[i].pos = g.players_pos[i];
		}
	});

	on("game_event", (event: any): void => {
		events = [...events, event];
	});

	on("restart_game", (g: any): void => {
		game.pong = g.pong;
		newGame();
	});
</script>

<!-- <h1>you are playing pong, askip</h1> -->
{#if game.pong.players.length == 2}
	<div class="score">
		<!-- <p>{game.pong.usernames[1]} - {game.pong.score[1]} : {game.pong.score[0]} - {game.pong.usernames[0]} </p> -->
		<p>{game.pong.score[1]} : {game.pong.score[0]} </p>
	</div>
{/if}

<svelte:window bind:innerWidth={_width}  bind:innerHeight={_heigh}/>
<div class="container">


	{#if _width > _heigh}
		<div class="events outlined">
			<h2>Events</h2>
			{#each events as event}
				<p>{event}</p>
			{/each}
		</div>
		{/if}
  
	<div class="canvas-container" >
			<div class="canvas-container2">
				<canvas bind:this={_canvas} id="myCanvas" height="{500} "width="{500}">
				</canvas>
			</div>
	</div>

	<div class="mobile">
		{#if _width <= _heigh}
			<div class="events outlined">
				<h2>Events</h2>
				{#each events as event}
					<p>{event}</p>
				{/each}
			</div>
		{/if}
		<div class="users outlined">
			<h2>Players</h2>
			<!-- Display the list of users here -->
			{#each game.pong.usernames as player}
				<p>{player}</p>
			{/each}
			{#each game.pong.resultas.slice().reverse() as player}
				<p class="cross">{player}</p>
		  	{/each}
			</div>
	  </div>
	</div>
	
  
  <style>


	p{
		font-size: 1.5vmin;
	}
	h2{
		font-size: 2vmin;
	}
	/* (max-width: 768px) and  */
	/* @media (orientation: portrait) { */
	/* CSS styles for smaller width than height (e.g., mobile devices in portrait mode) */
	
		/* Anim {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		} */

		.container {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;
			height: 90%;
			width: 100%;
		}
		.mobile{
			display: flex;
			flex-direction: row;
			width: 100%;
			height: 30%;
		}
		.canvas-container {
			/* position: relative; */
			width: 70%;
			height: 100%;
			/* padding-left: auto; */
			/* padding-right: auto; */
			margin-left: auto;
  			margin-right: auto;
		}

		.canvas-container2 {
			/* position: relative; */
			width: 50vmin;
			height: 50vmin;
			margin-left: auto;
  			margin-right: auto;
		}
		.events,
		.users {
			height: 100%;
			width: 100%;
			flex: 1;
			padding: 1rem;
			background-color: var(--hover);
			overflow: auto;
			width: 100%;
		}
	/* } */
	@media  (orientation: landscape) {
	/* CSS styles for larger width than height (e.g., desktop or larger screens) */
	
		.container {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			/* margin-top: -1rem; */
			height: 90%;
			width: 100%;
			/* overflow: auto; */
		}
		
		.events,
		.users {
			height: 100%;
			width: 20%;
			flex: 1;
			padding: 1rem;
			background-color: var(--hover);
			overflow: auto;
		}
		.users {
			width: 100%;
		}
		.mobile{
			width: 20%;
			height: 100%;
		}
		.canvas-container {
			width: 60%;
			height: 100%;
		}

	}
	
	.cross {
		text-decoration: line-through;
	}

	.score {
		flex: 1;
		padding: 1rem;
		background-color: var(--hover);
		align-self: center;
		margin-top: -2rem;
		height: 10%;
	}

	#myCanvas {
			/* border: 1px solid #ccc; */
			/* background-color: #fff; */
			height: 100%;
			width: 100%;
			padding-left: auto;
			padding-right: auto;
			/* margin: -1px; */
		}
  </style>
<!-- <style>
	/* .container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		
	} */
	canvas {
		padding-left: 0;
		padding-right: 0;
		margin-left: auto;
		margin-right: auto;
		display: block;
		border: 0px;
		/* width: 800px;
		flex: 1;
		width: 100%;
		height: 80%; */
	}
</style> -->
