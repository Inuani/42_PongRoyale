<script>
    import Avatar from '$lib/Avatar.svelte';
</script>

<h1>About</h1>

<div class="text">
    <p>Welcome to @Pong(Royale) !</p>
    <p>It's the last project of our cursus at 42Lausanne!
        Built with Svelte and SvelteKit for the front-end, it uses NestJs and PostgreSQL for the back-end.</p>
</div>

<div class="container">
    <div class="element">
		<a href="https://github.com/Gymnopediese" target="_blank">
			<Avatar size=70 src="https://avatars.githubusercontent.com/u/104855797?v=4"/>
        	<p>Gymnopediese</p>
		</a>
        
    </div>
    <div class="element">
		<a href="https://github.com/amuhleth42" target="_blank">
			<Avatar size=70 src="https://avatars.githubusercontent.com/u/1162160?v=4"/>
			<p>Amuhleth</p>
		</a>
    </div>
    <div class="element">
		<a href="https://github.com/Devinci24" target="_blank">
			<Avatar size=70 src="https://avatars.githubusercontent.com/u/98612843?v=4"/>
			<p>Devinci24</p>
		</a>
    </div>
    <div class="element">
		<a href="https://github.com/Inuani" target="_blank">
        <Avatar size=70 src="https://avatars.githubusercontent.com/u/100168298?v=4"/>
        <p>Inuani</p>
	</a>
    </div>
</div>

<style>
    .container {
        display: flex;
        justify-content: space-between;
        gap: 60px
    }
    .element {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .text {
        text-align: center;
        max-width: 50%;
    }
</style>