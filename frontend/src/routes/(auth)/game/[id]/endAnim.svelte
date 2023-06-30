<script lang="ts">
    import { fade } from 'svelte/transition';
    import { elasticOut } from 'svelte/easing';
    import { afterUpdate } from 'svelte';

    let count: number = 1;

    export let visible: boolean;

    function spin(node, { duration }) {
      return {
        duration,
        css: t => {
          const eased = elasticOut(t);
          return `
            transform: scale(${eased});
            color: black;
          `;
        },
        tick: (t) => {
          if (t >= 1 && count >= 0 && visible) {
            count--;
            visible = false;
          }
        }
      };
    }
  
    afterUpdate(() => {
      if (count >= 0) {
        visible = true;
      }
      else
        count = 2;
    });
  </script>
  
  {#if visible}
    <div class="centered" in:spin="{{ duration: 1000 }}" out:fade>
      <span>{count}</span>
    </div>
  {/if}
  
  <style>
    .centered {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
    }
  
    span {
      position: absolute;
      transform: translate(-50%,-50%);
      font-size: 4em;
    }
  </style>
  