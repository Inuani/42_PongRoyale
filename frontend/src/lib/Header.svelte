<script lang=ts>
    import Avatar from "$lib/Avatar.svelte";
	import all from "./global";
	import NotifButton from "./NotifButton.svelte";
    $: isLoggedIn = all.user == undefined ? false :  all.user.id == undefined ? false: true;
    $: iconMode = darkmode !== 'enabled' ? false : true;

    let darkmode: string | null = localStorage.getItem('darkmode')

    let darkmodeOn: () => void = (): void => {
        localStorage.setItem('darkmode', 'enabled');
        document.body.classList.add('darkmode');
    }
    let darkmodeOff: () => void = (): void => {
        localStorage.setItem('darkmode', '');
        document.body.classList.remove('darkmode');
    }
    if (darkmode === 'enabled')
        darkmodeOn();
    let toggleDarkmode: () => void = (): void => {
        if (darkmode !== 'enabled')
            darkmodeOn();
        else
            darkmodeOff();
        darkmode = localStorage.getItem('darkmode')
    }
</script>


<div class="header">
    <div class="left">
        <a class="logo-desktop" href="/">@Pong(Royale)</a>
        <a class="logo-mobile" href="/">@()</a>
        {#if iconMode}
            <button class="icon-button"><a on:click={toggleDarkmode} class="material-icons">dark_mode</a></button>
        {:else}
            <button class="icon-button">
				<a on:click={toggleDarkmode} class="material-icons">light_mode</a></button>
        {/if}
    </div>
    <div class="right">
    {#if isLoggedIn}
        <a href="/game">Play Game!</a>
        <a href="/mychats">Chat</a>
		<NotifButton></NotifButton>
        <a href="" on:click={() => document.location.href = "/users/" + all.user.username}><Avatar size={40} src={all.user.avatar_url}/></a>
    {/if}
    </div>
</div>

<style>
    .header, .right, .left {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 30px;
        background-color: var(--back2);
    }

    .right, .left{
        flex-wrap: wrap;
    }

    .header{
        padding: 20px;
        border-bottom: 2px solid var(--front);
    }

    .logo-desktop, .logo-mobile {
        font-size: 38px;
        font-weight: 700;
    }
    .material-icons {
        font-family: 'Material Icons';
    }

    .icon-button {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    /*color: #333333;
    background: #dddddd;*/
    border: none;
    outline: none;
    border-radius: 50%;
    }

    .icon-button:hover {
    cursor: pointer;
    }
    /*.logo-desktop {
        display: block;
    }*/

    .logo-mobile {
        display: none;
    }
    @media (max-width: 700px) {
        .logo-desktop {
            display: none;
        }

        .logo-mobile {
            display: block;
        }
    }

</style>
