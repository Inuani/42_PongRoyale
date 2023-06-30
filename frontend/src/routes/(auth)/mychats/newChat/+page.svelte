<script lang="ts">
    import { post, posterr, status } from "$lib/API";
    import { sha256 } from "js-sha256";
    import { goto } from "$app/navigation";

    let chatName				: string = '';
    let chatPassword			: string = '';
    let chatPasswordConfirm		: string = '';
    let passwordInput			: HTMLInputElement;
    let passwordConfirmInput	: HTMLInputElement;
    let chatNameInput			: HTMLInputElement;
    let inviteCode				: string = '';
    let visibility				: string = "Public";
    let radioOptions			: Array<string> = ['Public', 'Private', 'Protected'];
	let	err						: string = "";

    async function createChatRoom(): Promise<void>
	{
		const response: {status: string} = await posterr("chat/create", {
			name: chatName,
			password: chatPassword == '' || visibility != "Protected" ? null : sha256(chatPassword),
			is_private: visibility == 'Private',
		});
        if (response.status != status.OK)
		{
			err = response.status;
			return ;
		}
		goto("/chat/" + chatName)
	}

    function isChatNameValid(): void {
		const alphanumericRegex	: RegExp = /^[a-zA-Z0-9]+$/;
		chatNameInput.setCustomValidity('');

		if (!alphanumericRegex.test(chatName))
			chatNameInput.setCustomValidity('Username must contain only alphanumeric characters.');
    }

    function isChatPasswordValid(): void {
        const lowercaseRegex	: RegExp = /[a-z]/;
        const uppercaseRegex	: RegExp = /[A-Z]/;
        const numberRegex		: RegExp = /[0-9]/;
        const hasLowercase		: boolean = lowercaseRegex.test(chatPassword);
        const hasUppercase		: boolean = uppercaseRegex.test(chatPassword);
        const hasNumber			: boolean = numberRegex.test(chatPassword);

        passwordInput.setCustomValidity(''); // Reset custom validity message

        if (!hasLowercase) {
            passwordInput.setCustomValidity('Must contain at least one lowercase letter');
        } else if (!hasUppercase) {
            passwordInput.setCustomValidity('Must contain at least one uppercase letter');
        } else if (!hasNumber) {
            passwordInput.setCustomValidity('Must contain at least one number');
        }
	}

    function isPassword2Valid(): void {
        passwordConfirmInput.setCustomValidity('');

        if (chatPasswordConfirm !== chatPassword)
            passwordConfirmInput.setCustomValidity('Passwords do not match');
    }

</script>

<h1>New Chat</h1>

<div class="main">
    <div class="create outlined">
        <h2>Create Chat</h2>

        <form class="form" action="" on:submit|preventDefault={createChatRoom}>
            <div class="text-input">
                <label for="name">Chat Name :</label>
                <input bind:value={chatName} type="text" id="name" size=15 required minlength="3" maxlength="20" bind:this={chatNameInput} on:input={isChatNameValid}>
            </div>

            {#each radioOptions as option}
            <label>
                <input type=radio bind:group={visibility} value={option} required>
                {option}
            </label>
            {/each}
            {#if visibility == "Protected"}
            <div class="text-input">
                <label for="password">Password :</label>
                <input bind:value={chatPassword} type="password" id="password" size=15 required minlength="8" maxlength="20" bind:this={passwordInput} on:input={isChatPasswordValid}>
            </div>
            <div class="text-input">
                <label for="passwordConfirm">Confirm Password:</label>
                <input bind:value={chatPasswordConfirm} type= "password" id="passwordConfirm" size=15 required minlength="8" maxlength="20" bind:this={passwordConfirmInput} on:input={isPassword2Valid}>
            </div>
            {/if}
			<p style="color:red">{err}</p>
            <button class="material-icons" type="submit">arrow_forward</button>
        </form>
    </div>
    
    <div class="join outlined">
		
        <h2>Join Chat</h2>
        <div class="top">
            <div class="text-input">
                <label for="inviteCode">Enter Invitation Code :</label>
                <input bind:value={inviteCode} type="text" id="inviteCode" size=10>
            </div>
            <button on:click={()=> goto("/join/" + inviteCode)} class="material-icons">arrow_forward</button>
        </div>
        <p>- or -</p>
        <button><a href="/join">View Public Chat List</a></button>
    
    </div>
</div>



<style>
    .main {
        display: flex;
    }

    .text-input {
        display: flex;
        flex-direction: column;
    }

    .create, .join {
        display: flex;
        flex-direction: column;
        padding: 40px;
        gap: 20px;
        align-items: center;
    }
    .form {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }
    button {
        align-self: center;
    }
    .top {
        display: flex;
        gap: 10px;
    }
</style>