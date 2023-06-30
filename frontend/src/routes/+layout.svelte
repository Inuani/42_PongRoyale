<script>
	import Header from '$lib/Header.svelte';
	import Footer from '$lib/Footer.svelte';
	import '@fontsource-variable/jost';
	import '@fontsource/material-icons';

</script>

<div class="app">
	<Header />

	<main class="main">
		<slot />
	</main>

	<Footer />

</div>

<style>

	* {
		font-family: 'Jost Variable';
	}
    .app {
        display: flex;
        flex-direction: column;
		justify-content: space-between;
        height: 100vh;
    }
	.main {
		/*border: 2px solid black;
		border-radius: 20px;*/
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		gap: 15px;
		margin: 50px;
		padding: 20px;
		min-height: 50%;
		flex: 1;
		overflow-x: auto;
		overflow-y: auto;
	}
	@media (max-width: 700px) {
		.main {
			display: block;

		}

	}

</style>