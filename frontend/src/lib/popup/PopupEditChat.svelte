<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import all, { emit } from '$lib/global';
	import { get, post } from "$lib/API";
	import qrcode from 'qrcode-generator';
    import { sha256 } from 'js-sha256';
  
	export let visible	: boolean = false;
	export var chatname	: string;

    let visibility		: string = "Public";
    let radioOptions	: Array<string> = ['Public', 'Private', 'Protected'];
	let pass			: string = "";

	async function save(): Promise<void>{
		await post("chat/edit", {
			is_private: visibility == 'Private',
			password: visibility == "Protected" && pass != '' ? sha256(pass) : null,
			chat: chatname,
		})
		visible = false;
	}
  </script>


  {#if visible}
	<div class="overlay">
		<div class="popup">
			<button on:click={() => visible = false}>X</button>
			<h1>Edit rights for {chatname}</h1>
			{#each radioOptions as option}
            <label>
                <input type=radio bind:group={visibility} value={option} required>
                {option}
            </label>
            {/each}
			{#if visibility == "Protected"}
				<input type="password" minlength="8" maxlength="20" bind:value={pass} placeholder="new password"/>
			{/if}
			<button on:click={save}>save</button>
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
	/* .yo {
		display: flex;
		justify-content: center;
		align-items: center;
	} */
  
	.popup {
		width: 20%;
		height: 50%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
	  background-color: #fff;
	  color: black;
	  padding: 2rem;
	  border: 1px solid #ccc;
	  border-radius: 5px;
	  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	  position: relative;
	}
	/* main {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;

	} */

	/* .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: #ccc;
    color: #333;
    font-size: 16px;
    border: none;
    cursor: pointer;
    padding: 5px;
  } */

  /* #qrcode{
	
	  justify-content: center;
	  align-items: center;
  } */
  h1{
	font-size: 2vmin;
	text-align: center;
  }

  /* .invite-sent {
  	background-color: rgb(227, 255, 227);
  }

  .already-in {
  color: green;
	}

  .close-button:hover {
    background-color: #999;
  }

  .invite-button {
	margin: 5px 0 15px 0;
  }   */

  </style>
  