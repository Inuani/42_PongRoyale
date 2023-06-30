<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import all, { emit } from '$lib/global';
	import { get, geto, post, posterr } from "$lib/API";
	import qrcode from 'qrcode-generator';
    import type { DispatchOptions } from 'svelte/internal';
  
	export let visible		: boolean = false;
	export let status 		: string = "ko";
	export let secretKey	: string = "";

	let token		: string = "";
	let qqq			: string = "a mince";
	const dispatch	: <EventKey extends string>(type: EventKey, detail?: any, options?: DispatchOptions | undefined) => boolean  = createEventDispatcher();
	
	async function closePopup(): Promise<void> {
   		await dispatch('close');
		visible = false
  	}

	async function generateQRCode(): Promise<void>
	{
		var secret: {secretKey: string, qrCodeUrl: string} = await geto("users/2fa")
		secretKey = secret.secretKey;

		const qr: QRCode = qrcode(0, 'L');
		qr.addData(secret.qrCodeUrl);
		qr.make();
		qqq = qr.createImgTag();
		//console.log(qqq);
	}
	generateQRCode()

	async function validateqrcode(): Promise<void>
	{
		visible = true;
		var temp: {status: string} = await posterr("users/2fa", {token: token, secret: secretKey});
		status = temp.status;
	}
	

  </script>


  {#if visible && status != "ok"}
	<div class="overlay">
		<div class="popup">
			<button class="close-button" on:click={closePopup}>X</button>
			<main>
				<div id="qrcode">
					<div class="yo" contenteditable="true" bind:innerHTML={qqq}>
					</div>
				</div>
				<input type="text" maxlength="6" bind:value={token} placeholder="Validation token #XXXXXX" on:keydown={event => {
					if (event.key === 'Enter') {
					  event.preventDefault();
					  validateqrcode();
					}
				  }}/>
				<button  type="button" on:click={validateqrcode}>Validate your token</button>
				<p>status: {status}</p>
			</main>
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
	.yo {
		display: flex;
		justify-content: center;
		align-items: center;
	}
  
	.popup {
		display: flex;
		align-items: center;
		gap: 20px;
	  background-color: #fff;
	  padding: 2rem;
	  border: 1px solid #ccc;
	  border-radius: 5px;
	  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	  position: relative;
	}
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;

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

  #qrcode{
	
	  justify-content: center;
	  align-items: center;
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
  