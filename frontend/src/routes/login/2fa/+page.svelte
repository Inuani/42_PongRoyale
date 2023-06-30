<script lang="ts">
    import { get, geto, post } from '$lib/API';
	import qrcode from 'qrcode-generator';
  
		
	export let status		: string = "ko";
	export let secretKey	: string = "";
	let token	: string = "";
	let qqq		: string = "";

	async function generateQRCode()
	{
		var secret: {secretKey: string, qrCodeUrl: string} = await geto("users/2fa")
		secretKey = secret.secretKey;

		const qr: QRCode = qrcode(0, 'L');
		qr.addData(secret.qrCodeUrl);
		qr.make();
		qqq = qr.createImgTag();
	}
	generateQRCode()

	async function validateqrcode()
	{
		var t: {status: string} = await post("users/2fa", {token: token, secret: secretKey});
		status = t.status;
	}

  </script>
  
{#if status != "ok"}
	<main>
	<div contenteditable="true" bind:innerHTML={qqq} id="qrcode"></div>
	<input type="text" bind:value={token} placeholder="Validation token #XXXXXX" />
	<button on:click={validateqrcode}>Validate your token</button>
	<p>status: {status}</p>
	</main>
{:else}
	OKOK
{/if}
  
  <style>
	main {
	  text-align: center;
	  padding: 1rem;
	}
  
	/* h1 {
	  font-size: 2rem;
	  margin-bottom: 1rem;
	} */
  
	input {
	  margin-top: 1rem;
	  padding: 0.5rem;
	  font-size: 1rem;
	  width: 100%;
	  max-width: 300px;
	  box-sizing: border-box;
	}
  
	button {
	  margin-top: 1rem;
	  padding: 0.5rem 1rem;
	  font-size: 1rem;
	  background-color: #007bff;
	  color: white;
	  border: none;
	  cursor: pointer;
	}
  
	#qrcode {
	  margin-top: 1rem;
	}
  </style>
  