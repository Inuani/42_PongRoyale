<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import all, { emit } from '$lib/global';
	import { get } from "$lib/API";
    import type { DispatchOptions } from 'svelte/internal';
  
	export let visible		: boolean = false;
	export let mode 		: string = '';
	export let link 		: string = '';
	export let channel_id	: string = '';
	export let channel_name	: string = '';
	export let users		: Array<{username: string, elo: number, id: number}>

	const dispatch: <EventKey extends string>(type: EventKey, detail?: any, options?: DispatchOptions | undefined) => boolean = createEventDispatcher();
	
	function closePopup(): void {
   		dispatch('close');
		visible = false
  	}
	
	async function getFriends(): Promise<Array<{username: string, status: string}>>
	{
		if (mode === 'chat')
		{
			//console.log("chan chan")
			//console.log(link)
			return (await get("friends/chat", {
				link: link,
				channel_id: channel_id
			})).chat;
		}
		else
		{
			//console.log("users", users)
			let friends: any = (await get("friends/game", {
				link: link,
			})).game
			//console.log("friends", friends);
			const matchingPlayers: Array<{username: string, status: string}> = friends.filter((friend : any) => {
  				return !users.some((player: any) => player.username === friend.username);
			});
			//console.log("matching", matchingPlayers);
			return matchingPlayers;
		}
	}

	

	async function inviteToChat(user: any): Promise<void>
	{
		let msg:string = 'Wanna join my chat ' + channel_name + ' ?'

		link = link.trim()
		emit('notif_send', {
			from: all.user.username,
			id_from: all.user.id,
			id_to: user.id,
			pending: true,
			type: 'chat',
			message: msg,
			link: link,
		})
	}

	async function inviteToGame(user: any): Promise<void>
	{
		emit('notif_send', {
			from: all.user.username,
			id_from: all.user.id,
			id_to: user.id,
			pending: true,
			type: 'game',
			message: 'Join my game ?',
			link: link,
		})
	}

  </script>


  {#if visible}
	<div class="overlay">
		<div class="popup">
			<button class="close-button" on:click={closePopup}>X</button>
			{#await getFriends()}
			<p>loading...</p>
			{:then users}
			{#each users as user}
				<a class="useri" style="display: inline;" href="/users/{user.username}">{user.username}</a>
				{#if mode == 'chat'}
					{#if user.status === 'not_invited'}
						<button class="invite-button" on:click={() => { inviteToChat(user); user.status = 'invite_sent'; }}>Invite {user.username} to this chat</button>
					{:else if user.status === 'invite_sent'}
						<p style="font-size: 20px;">Invite sent!</p>
					{:else if user.status === 'already_in'}
						<p><span class="already-in"> {user.username} is already in the chat!</span></p>
					{/if}
				{:else if mode == 'game'}
					{#if user.status === 'not_invited'}
						<button class="invite-button" on:click={() => { inviteToGame(user); user.status = 'invite_sent'; }}>Invite {user.username} to game</button>
					{:else if user.status === 'invite_sent'}
						<p style="font-size: 20px;">Invite sent!</p>
					{:else if user.status === 'already_in'}
						<p><span class="already-in"> {user.username} is already in the game!</span></p>
					{/if}				
				{/if}
			{/each}
			{:catch _}
			<p>an error occured</p>
			{/await}
		</div>
	</div>
	
  {/if}

  <style>
	.overlay {
	  position: fixed;
	  top: 0;
	  left: 0;
	  width: 100%;
	  height: 100%;
	  background-color: rgba(0, 0, 0, 0.5);
	  display: flex;
	  justify-content: center;
	  align-items: center;
	  z-index: 9999;
	}
  
	.popup {
	  background-color: #fff;
	  padding: 2rem;
	  border: 1px solid #ccc;
	  border-radius: 5px;
	  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	  position: relative;
	}

	.close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: #ccc;
    color: #333;
    font-size: 16px;
    border: none;
    cursor: pointer;
    padding: 5px;
  }

  /* .invite-sent {
  	background-color: rgb(227, 255, 227);
  } */

  .already-in {
  color: green;
	}

  .close-button:hover {
    background-color: #999;
  }

  .useri {
	color: black;
  }

  .invite-button {
	margin: 5px 0 15px 0;
  }  

  </style>
  