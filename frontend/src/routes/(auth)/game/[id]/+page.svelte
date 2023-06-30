<script lang="ts">
    import all, { emit, on } from "$lib/global";
    import Pong from "./Pong.svelte";
    import Popup from "$lib/popup/Popup.svelte";
    import { afterUpdate, onDestroy, onMount } from "svelte";
    import { goto } from "$app/navigation";
    import MessageSmall from "$lib/MessageSmall.svelte";

	var popup = false
	var game: any = null;	
  let full: boolean = false;

	export var data	: any;
	var messages	: Array<any> = []
	var message		: string = "";
	var popup		: boolean = false
	var game		: any = null;
  let element : HTMLDivElement;

    function sendMessage(): void {
		if (message.trim() !== "")
		{
			emit("volatile_message", {
				username: all.user.username,
				message: message,
				elo: all.user.elo,
				chatid: data.id
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

	onMount( (): void => {
		window.addEventListener('beforeunload', handlePageUnload);
	})

	function handlePageUnload(): void {
		emit('quit_game', data.id);
	}

	function startGame(): void {
		emit("start_game",  data.id);
  	}

	function exitGame(): void {
		goto("/game");
  	}

	onDestroy((): void => {
		//console.log("MMAAAAAAAAAAAAAAAAAMMAMAMIOAa")
		// CAN WEEE DOOO BETTER
		emit("quit_game", data.id)
		//document.location.reload();
	})

	on("game_info", (g: any): void => {
		game = g;
	})

  on("full", () => {
    full = true;
  })

	on("volatile_message", (username: string, message: string) => {
		messages = [...messages, {username:username, message:message}];
	})
	
	emit("game_info", {id:data.id, elo: all.user.elo});
  emit("leave", "WatchGames");

</script>



{#if full}
    game is full
{:else if game == null}
    invalid game
{:else if game.started == false && game.soloq == false}

<div class="header">
	<h1>Waiting for players: {game.players.length}/{game.a_players}</h1>
</div>
  <div class="main-cont">
    <div class="message-box">
      <h2 class="title inverted">Chat while you wait</h2>
      <div class="chat-container" bind:this={element}>
          {#each messages as message}
              <MessageSmall message={(message.message)} username={message.username}/>
          {/each}
      </div>
      <div class="input-container">
        <input class="input" type="text" maxlength="400" placeholder="Enter a message" bind:value={message} on:keydown={event => event.key === 'Enter' && sendMessage()}>
        <button class="send-button" on:click={sendMessage}>Send</button>
      </div>
    </div>

    <div class="buttons-container outlined">
      {#if game.owner == all.user.id}
        <button class="buttons" on:click={startGame}>
        {#if game.a_players == game.players.length}
          START
        {:else}
          Start with BOTS
        {/if}
        </button>
      {/if}
      <button class="buttons" on:click={()=>popup = true}>Invite Friends</button>
      <button class="buttons" on:click={()=>{emit("quit_game", data.id); goto("/game/")}}>Quit</button>
      <Popup mode="game" bind:visible={popup} users="{game.players}" link="{data.id}" />
    </div>
  </div>

{:else if game.soloq == true && game.started == false}
  {#if game.winner == null}
    waiting for player...
  {:else}
    WINNER IS {game.winner}
    <button class="exit" on:click={exitGame}>
      EXIT
    </button>
  {/if}
{:else}
	<Pong game={game}></Pong>
{/if}

<style>

	.header{
		height: 10%;
	}
	h1 {
		font-size: 5vmin;
	}

	.main-cont{
		padding-top: 5%;
		height: 85%;
		display: flex;
		min-height: 80%;
		gap: 10px;
	}

	.chat-container{
		height: auto;
		overflow: auto;
        flex: 1;
	}

	.message-box {
		width: 60%;
        display: flex;
        flex-direction: column;
        border-radius: 20px;
        align-items: stretch;
        padding: 0px 20px;
        margin: 0;
        flex: 1;
    }

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
        border-left: 2px solid var(--front);
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

    button {
        font-size: 2vmin;
    }
	.buttons{
		height: 20%;
	}
	
    .buttons-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      gap: 20px;
    }
	

	@media  (orientation: portrait) {
		.main-cont{
			flex-direction: column;
		}
		.message-box {
			width: 100%;
			height: 85%;
		}
		.buttons-container {
     	 flex-direction: row;
		  height: 10%;
    	}
		.header{
		height: 10%;
	}
	}

</style>