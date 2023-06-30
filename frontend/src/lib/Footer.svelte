<script lang="ts">
    import Avatar from '$lib/Avatar.svelte'
</script>

<div class="container">
    <div class="left">
        <p class="copyright">Copyright 2023</p>
    </div>
    <div class="right">
        <!-- <a>Terms & Conditions</a> -->
        <a href="/about">About</a>
        <a href="https://github.com/Inuani/42_PongRoyale" target="_blank">
            <Avatar size={30} src="https://cdn-icons-png.flaticon.com/512/25/25231.png"/>
        </a>
    </div>
</div>

<style>
    .container, .right {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
        background-color: var(--back2);
    }

    .container {
        padding: 20px;
        border-top: 2px solid var(--front);
    }
</style>