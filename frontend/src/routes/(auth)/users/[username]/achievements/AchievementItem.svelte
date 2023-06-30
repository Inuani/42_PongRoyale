<script lang="ts">
	export let achievement	: {name: string, explanation: string, icon: string};
	
  </script>
  
  <div class="achievement-item">
	<div class="achievement-header">
	  <img src={achievement.icon} alt={achievement.name} class="achievement-icon" width="60" />
	  <h3 class="achievement-name">{achievement.name}</h3>
	 
	</div>
	<p class="achievement-explanation">{achievement.explanation}</p>
  </div>
  
  <style>
	h3{
		margin-top: auto;
		margin-bottom: auto;
		margin-left: 5%;
	}
	.achievement-header{
		display: flex;
		flex-direction: row;
		/* width: 100%;  */
		text-align: center;
		margin-right: auto;
		margin-left: auto;
	}
	.achievement-item{
		display: flex;
		flex-direction: column;
		/* width: 100%;  */
		text-align: center;
		margin-right: auto;
		margin-left: auto;
	}
  </style>