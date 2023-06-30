<script lang=ts>
	import Switch from '$lib/Switch.svelte';
	import { post, posterr, status } from '$lib/API';
	import { sha256 } from 'js-sha256';
	import { getCookies, setCookies } from '$lib/Cookies';
	import Avatar from '$lib/Avatar.svelte';
    import Popup2fa from '$lib/popup/Popup2fa.svelte';
    import all from '$lib/global';

	export let signup	: number = 1;

	var username		: string = all.user == null ? "" : all.user.type == 42 ? all.user.login : all.user.username;
	var password		: string = '';
	var password2		: string = '';
	var	bio				: string = all.user == null ? "" : all.user.bio;
	var url				: string = all.user == null ? "https://icon-library.com/images/anon-icon/anon-icon-1.jpg" : all.user.avatar_url;
	var t2fa			: boolean = signup == 1 ? false : all.user.two_factor_enabled;
	var secretKey		: string;
	var status2fa		: string = signup == 1 ? "ko" : all.user.two_factor_enabled ? "ok" : "ko";
	var pfp				: null | any = null;
	var serverMessage	: string = '';

	var usernameInput	: HTMLInputElement;
	var passwordInput	: HTMLInputElement;
	var password2Input	: HTMLInputElement;


	$:	printImg = pfp ? true : false;


	function handlePfpUpload(event: any): void
	{
		if (event.target == null)
			return ;
		pfp = event.target.files[0];
		if (!pfp)
			return ;
		// check file size
		const maxPfpSize: number = 6 * 1024 * 1024;
		if (pfp.size > maxPfpSize)
		{
			alert("Image is too large - max 6MB");
			pfp = null;
			event.target.value = '';
			return ;
		}
		const reader: FileReader = new FileReader();
		reader.onload = function(e: ProgressEvent<FileReader>): void
		{
			const pfpPreview: any = document.getElementById('image-preview');
			if (pfpPreview == null || e.target == null)
				return ;
			pfpPreview.src = e.target.result;
			pfpPreview.style.display = 'block';
		};
		reader.readAsDataURL(pfp);
	}

	async	function createUser(): Promise<void>
	{
		var response: {status: string, token: string};
	
		if (t2fa && status2fa === "ko")
			return ;
		const formData: FormData = new FormData();
    	formData.append('pfp', pfp);
		if (pfp)
			url = (await posterr("users/upload", formData)).filename;
		if (getCookies("USER_TOKEN"))
			response = await posterr("users/edit",
			{
				username: username,
				avatar_url:url,
				bio:bio,
				two_factor_enabled:t2fa,
				two_factor:secretKey,
			});
		else
			response = await posterr("users/create",
			{
				login: username,
				username: username,
				avatar_url:url,
				password: all.user == null ? sha256(password) : undefined,
				bio:bio,
				two_factor_enabled:t2fa,
				two_factor:secretKey,
			});
		if (response.status != status.OK)	{
			serverMessage = response.status;
			return ;
		}
		setCookies("USER_TOKEN", response.token);
		setCookies("type", "user");
		document.location.href = "/home";
	}

  	function handleSubmit(event: Event): void {
    	event.preventDefault();

		const form: any = event.target;
		
		if (form == null)
			return ;
		if (form.checkValidity()) {
			// const sanitizedPassword = password.trim();
			// Use the sanitized value as needed (e.g., send to server)
			createUser();
			// Reset the form
			form.reset();
		} else{
			// Display validation errors
			passwordInput.reportValidity();
			password2Input.reportValidity();
		}
	}

	function isUsernameValid(): void {

    	// Regular expression to match alphanumeric characters
    	const alphanumericRegex: RegExp = /^[a-zA-Z0-9]+$/;
      	usernameInput.setCustomValidity('');

		if (!alphanumericRegex.test(username)) {
			// Set custom validity message
			usernameInput.setCustomValidity('Username must contain only alphanumeric characters.');
		}
	}


	function isPasswordValid(): boolean {
		const lowercaseRegex	: RegExp = /[a-z]/;
		const uppercaseRegex	: RegExp = /[A-Z]/;
		const specialAsciiRegex	: RegExp = /[\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]/;
		const nonAsciiRegex		: RegExp = /[^\x20-\x7E]/;
		const hasLowercase		: boolean = lowercaseRegex.test(password);
		const hasUppercase		: boolean = uppercaseRegex.test(password);
		const hasSpecialAscii	: boolean = specialAsciiRegex.test(password);
		const hasNonAscii		: boolean = nonAsciiRegex.test(password);

		passwordInput.setCustomValidity(''); // Reset custom validity message

		if (!hasLowercase) {
			passwordInput.setCustomValidity('Must contain at least one lowercase letter');
		} else if (!hasUppercase) {
			passwordInput.setCustomValidity('Must contain at least one uppercase letter');
		} else if (!hasSpecialAscii) {
			passwordInput.setCustomValidity('Must contain at least one special ASCII character');
		} else if (hasNonAscii) {
			passwordInput.setCustomValidity('Cannot contain non-ASCII characters');
		}

		return password.length >= 8;
	}

	function isPassword2Valid(): void {
		password2Input.setCustomValidity('');

		if (password2 !== password) {
			password2Input.setCustomValidity('Passwords do not match');
		}
	}

</script>
<div style="overflow:auto">

	{#if signup == 1}
		<h1>Signup</h1>
	{:else}
		<h1>Edit profile</h1>
	{/if}

	<div class="error">{serverMessage}</div>
	<form class="container" on:submit|preventDefault={handleSubmit} >
		<div class="left">
			<div class="input">
				<input type="text" id="username" bind:value={username} placeholder="Username" required minlength="3" maxlength="20" bind:this={usernameInput} on:input={isUsernameValid}/>
			</div>
			{#if all.user == null}
			<div class="input">
				<input type="password" id="password" bind:value={password} placeholder="Create Password" required minlength="8" maxlength="20" bind:this={passwordInput} on:input={isPasswordValid}/>
			</div>
			<div class="input">
				<input type="password" id="password2" bind:value={password2} placeholder="Confirm Password" required minlength="8" maxlength="26" bind:this={password2Input} on:input={isPassword2Valid}/>
			</div>
			{/if}
			<div class="input">
				<textarea id="bio" cols="18" rows="3" placeholder="About you" bind:value={bio} maxlength="400"></textarea>
			</div>
		</div>
		<div class="right">
			<div class="input-center">
				<div class="input-avatar">
					<Avatar id="image-preview" src="{url}" size={120} alt=""/>
				</div>
				<div class="addAvatar">
					<button class="material-icons icon">add</button>
					<input type=file id="avatar" accept="image/*" on:change={handlePfpUpload}>
				</div>
			</div>
			{#if all.user == undefined || (all.user.type != 42 && all.user.password != null) }
				<p><Switch bind:checked={t2fa} />Enable Double Authentification</p>
				<Popup2fa bind:status={status2fa} bind:secretKey={secretKey} bind:visible={t2fa} />
			{/if}
			{#if signup == 1}
				<div class="switch">
					<Switch/>
					<p>I agree to sell my privacy</p>
				</div>
			{/if}
			<button class="material-icons" type="submit">arrow_forward</button>
		</div>
	</form>
	
</div>

<style>
	.container {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 20px;
	}
	.icon {
		border-radius: 50%;
		padding: 10px;
		width: 40px;
		height: 40px;
		text-align: center;
		align-self: center;
		position: absolute;
		top: 50%;
		left: 70%;
		border: none;
		background-color: var(--text);
		color: var(--front);
	}
	h1 {
		text-align: center;
		margin-bottom: 20px;
	}
	/* .bigrow {
		display: flex;
		gap: 10px;
	} */
	.input {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}
	.input-center {
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
	}
	.input-avatar {
		display: flex;
		gap: 40px;
		align-items: center;

	}
	.addAvatar {
		max-width: 100px;
		display: flex;
	}

	input[type=file] {
		transform: scale(3) translateY(-40%);
		overflow: hidden;
		opacity: 0;
	}
	.switch {
		display: flex;
		align-items: center;
	}
	.right, .left {
		display: flex;
		flex-direction: column;
		gap: 20px;
		padding: 0px 20px;
		margin: 20px 0px;

	}
	.left {
		border-right: 2px solid var(--front);
	}

	.right {
		align-items: center;
	}

	/*#image-preview {
    max-width: 200px;
    max-height: 200px;
    display: none;
}*/
	.error:not(:empty) {
		text-align: center;
		/*border: 2px solid red;*/
		color: rgb(255, 110, 110);
		border-radius: 20px;
	}
	 
</style>