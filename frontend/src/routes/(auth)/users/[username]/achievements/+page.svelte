<script lang="ts">

	export let data	: {username: string};
    import all from '$lib/global';
	import AchievementItem from './AchievementItem.svelte';
  
	let achievements: Array<{name: string, icon: string, explanation: string}> = [
	  {
		name: 'Create an account',
		icon: 'https://cdn-icons-png.flaticon.com/512/4470/4470914.png',
		explanation: 'You have created a @Pong(Royal) account'
	  },
	  {
		name: 'Earth Sitizan',
		icon: 'https://cdn-icons-png.flaticon.com/512/921/921490.png',
		explanation: 'You are a sitizan of planet Earth'
	  },
	  {
      name: 'Master of Existence',
      icon: 'https://cdn-icons-png.flaticon.com/512/1142/1142131.png',
      explanation: 'Congratulations on being alive!'
    },
    {
      name: 'Gravity Defier',
      icon: 'https://cdn-icons-png.flaticon.com/512/2120/2120472.png',
      explanation: 'Despite the pull of gravity, you have managed to stay grounded.'
    },
    {
      name: 'Serial Blinker',
      icon: '   https://cdn-icons-png.flaticon.com/512/2547/2547870.png ',
      explanation: 'You have blinked countless times without even thinking about it.'
    },
    {
      name: 'Oxygen Consumer',
      icon: '   https://cdn-icons-png.flaticon.com/512/5683/5683779.png ',
      explanation: 'You have inhaled and exhaled oxygen like a true champion.'
    },
    {
      name: 'Professional Eater',
      icon: 'https://cdn-icons-png.flaticon.com/512/706/706195.png',
      explanation: 'You have successfully consumed food and turned it into energy.'
    },
    {
      name: 'Master of Procrastination',
      icon: 'https://cdn-icons-png.flaticon.com/512/3063/3063782.png',
      explanation: 'You have perfected the art of delaying tasks to the last possible moment.'
    },
    {
      name: 'Naptime Expert',
      icon: 'https://cdn-icons-png.flaticon.com/512/5518/5518120.png',
      explanation: 'You have honed your skills in the fine art of napping.'
    },
	];
</script>

<h1>Achievements of {data.username}</h1>
{#if data.username == all.user.username}
<h2>You have all the achievements!!!!!!!</h2>
{:else}
<h2>{data.username} has all the achievements!!!!!!!</h2>
{/if}
{#each achievements as achievement}
<AchievementItem {achievement} />
{/each}