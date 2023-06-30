<script lang="ts">
    export let size	: number;
    export let src	: string;
    export let alt	: string = 'av';
    export let id	: string = '';

    let imageError	: boolean = false;

    function handleImageError(): void {
        imageError = true;
	}
</script>

<div class="container">
    <!--{#if src.endsWith('.gif')}
        <video class="avatar gif" autoplay loop muted width={size} height={size} {id} {alt}>
            <source src={src} type="video/mp4">
        </video>
    {:else}-->
        <img class="avatar" width={size} height={size} style="min-width: {size}" {src} {id} {alt} on:error={handleImageError} class:img-error={imageError} />
</div>

<style>
    .container {
        display: flex;
        justify-content: center;
        align-items: center;
        max-width: 100%;
    }

    :root {
    --size: {size};
  }
    .avatar {
        border-radius: 50%;
        text-align: center;
        flex: 0 0 auto;
        min-width: var(--size);
        /*width: 100%;*/
        aspect-ratio: 1/1;
    }
    .img-error {
        border: 2px solid var(--front);
    }
</style>