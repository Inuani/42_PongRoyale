<script lang="ts">
	import { createEventDispatcher } from 'svelte';
    import type { DispatchOptions } from 'svelte/internal';
  
	export let text		: string = 'Hello';
	export let visible	: boolean = false;
  
	const dispatch: <EventKey extends string>(type: EventKey, detail?: any, options?: DispatchOptions | undefined) => boolean = createEventDispatcher();
  
	function closePopup(): void {
	  dispatch('close');
	  visible = false
	}
  </script>
  
  {#if visible}
  	<button on:click={closePopup}>X</button>
	<div class="overlay">
		<div class="popup">
			<p>{text}</p>
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
  
	.popup {
	  background-color: #fff;
	  padding: 1rem;
	  border: 1px solid #ccc;
	  border-radius: 5px;
	  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	}

	
  </style>
  