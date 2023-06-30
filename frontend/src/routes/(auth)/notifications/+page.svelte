<script lang="ts">
    import { get } from "$lib/API";
	import all, { emit } from "$lib/global";

	interface Notifs{
		pending: boolean,
		from: string,
		id_from: number,
		id_to: number,
		message: string,
		type: string,
		link: string,
	}

	let notifications	: Array<Notifs> = [];
	let from_me			: Array<Notifs> = [];
	let to_me			: Array<Notifs> = [];
	var show			: boolean = true;

	all.notifs.subscribe(value => {
		to_me = value;
		to_me = to_me.reverse()
		notifications = to_me
	});

	async function  getNotifs(): Promise<void> {
		from_me = (await get("notif/from", {"user_id": all.user.id})).notifs;
	}

	function respond_notif(notif: Notifs, response: boolean): void
	{
        notif.pending = false;
		all.notifs.update(notifs => notifications)
        const data = {
            response: response,
            notif: notif
        };
		if (notif.type === 'game' && response)
		{
			emit("notif_response", data);
			notifications = notifications;
			document.location.href = "/game/" + notif.link;
		}
		else
		{
			emit("notif_response", data);
        	notifications = notifications;
		}
	}


</script>

<h1>Notifications</h1>
{#await getNotifs()}
	<p>loading...</p>
{:then _}
{#if notifications.length == 0}
	<p>You don't have any notifications!</p>
{/if}
<div class="notification-container">
	<h2>Pending</h2>
	{#if notifications.some(notification => notification.pending)}
		{#each notifications as notification}
			{#if notification.pending}
		  <div class="notification">
			<div class="notification-content">
			  <div class="notification-title">from {notification.from}:</div>
			  <div>{notification.message}</div>
			  <!-- <div class="notification-timestamp">{notification.timestamp}</div> -->
			</div>
			{#if notification.type != "else" && notification.pending && show}
			<div class="notification-action">
			  <button on:click={() => respond_notif(notification, true)}>Accept</button>
			  <button on:click={() => respond_notif(notification, false)}>Deny</button>
			</div>
			{/if}
		  </div>
		  {/if}
		{/each}
	{:else}
		<p>No pending notifications</p>
	{/if}
	<h2>Historic</h2>
	{#if notifications.some(notification => !notification.pending)}
		{#each notifications as notification}
			{#if !notification.pending}
				<div class="notification">
					<div class="notification-content">
					<div class="notification-title">from {notification.from}:</div>
					<div>{notification.message}</div>
					<!-- <div class="notification-timestamp">{notification.timestamp}</div> -->
				</div>
			</div>
			{/if}
		{/each}
	{:else}
		<p>No Historic</p>
	{/if}
  </div>
  {:catch _}
  <p>an error occured</p>
{/await}

<style>
  .notification-container {
    height: 500px;
    overflow-y: auto;
  }

  .notification {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 10px;
    margin-bottom: 10px;
    display: flex;
    align-items: center; /* Added to vertically center the content */
  }

  .notification-content {
    flex: 1;
  }

  .notification-action {
    display: flex;
    gap: 10px; /* Added to create spacing between the buttons */
	padding-left: 10px;
  }

  .notification-action button {
	
    padding: 5px 10px;
    border-radius: 4px;
  }
</style>