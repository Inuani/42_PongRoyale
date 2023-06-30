<script lang="ts">

    import { goto } from "$app/navigation";
    import { myStatus } from "$lib/API";
    import Avatar from "$lib/Avatar.svelte";
	import all, { emit, on } from "$lib/global";

	export let user		: {id: number, role: number, username: string, avatar_url: string};
	export let mystatus	: number;
	export let chat		: {id: number, invite_link: string};
	let status			: string = "offline";
	let isDropdownOpen	: boolean = false;
  
	function kickMember() : void {
		emit("kick_user",
		{
			chat_id: chat.id,
			room: chat.invite_link,
			target: user.id,
			status: user.role == -1 ? 0 : -1,
		});
	}
  
	function banMember() : void {
		emit("change_role",
		{
			chat_id: chat.id,
			room: chat.invite_link,
			target: user.id,
			status: -2,
		});
	}
  
	function muteMember() : void {
		emit("change_role",
		{
			chat_id: chat.id,
			room: chat.invite_link,
			target: user.id,
			status: user.role == -1 ? 0 : -1,
		});
	}

	function adminMember() : void {
		emit("change_role",
		{
			chat_id: chat.id,
			room: chat.invite_link,
			target: user.id,
			status: user.role == 1 ? 0 : 1,
		});
	}
	on("change_role", function(u): void{
		if (u.id == user.id)
			user.role = u.status;
		console.log(u.id, all.user.id);
		if (u.id == all.user.id)
			mystatus = u.status;
		if (u.id == all.user.id && u.status == -2)
			document.location.href = ('/mychats');
	})

	emit("ping", user.id);

	on("pong", (data): void => {
		if (data.from == user.id)
			status = myStatus(data.status);
		if (user.role == 3)
			status = "everywhere"
	});

	function toggleDropdown() : void {
		isDropdownOpen = !isDropdownOpen;
	}

</script>
  
<div class="container">
	<div class="member-info">
		<a href="/users/{user.username}">
			<div class="avatar-container">
					<div class="av">
						<Avatar class="av" src={user.avatar_url} size={40}/>
					</div>
					<span>{user.username}</span>
			</div>
		</a>
	</div>	
	<div class="member-details">
			<p>{status}</p>
			<p class="statushi">status: {["mute", "user", "admin", "owner", "gods"][user.role + 1]}</p>
	</div>
	<div class="member-actions">
	  {#if user.username != all.user.username && mystatus > 0 && mystatus > user.role}
		<button class="toggle" on:click={toggleDropdown}>...</button>
		<div class="dropdown">
			{#if isDropdownOpen}
			<div class="dropdown-content {isDropdownOpen ? '' : 'dropdown-closed'}">
				<button class="action-btn" on:click={kickMember}>Kick</button>
				<button class="action-btn" on:click={banMember}>Ban</button>
				<button class="action-btn" on:click={muteMember}>
					{#if user.role == -1}
					unmute
					{:else}
					mute
					{/if}
				</button>
				{#if user.role >= 0}
				<button class="action-btn" on:click={adminMember}>
					{#if user.role == 1}
						-admin
					{:else}
						+admin
					{/if}
					</button>
				{/if}
			</div>
			{/if}
		</div>
	  {/if}

	</div>
</div>

<style>
	.container {
	  display: flex;
	  flex-direction: column;
	  align-items: flex-start;
	  justify-content: space-between;
	  padding: 10px;
	  background-color: var(--hover);
	  border-radius: 5px;
	  gap: 10px;
	}
  
	.member-info {
	  display: flex;
	  align-items: center;
	  gap: 20px;
	}
  
	/* .member-details h3 {
	  margin: 0;
	  font-size: 18px;
	  font-weight: bold;
	} */
  
	.member-details p {
	  margin: 0;
	  font-size: 14px;
	  color: var(--text);
	}
  
	.member-actions {
		align-self: center;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
  
	.action-btn {
	  padding: 8px 12px;
	  font-size: 14px;
	  font-weight: bold;
	  text-align: center;
	  color: var(--front);
	  background-color: var(--hover);
	  border: 1px solid var(--front);
	  border-radius: 4px;
	  cursor: pointer;
	}
  
	.action-btn:not(:last-child) {
	}

	.dropdown {
    position: relative;
    display: inline-block;
  }

  .dropdown-content {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
    position: absolute;
	gap: 5px;
    top: 100%;
    left: 0;
	transform: translateY(-50%);
	transform: translateX(-50%);
    background-color: var(--hover);
    padding: 7px;
    border: 1px solid #ccc;
    z-index: 1;
  }

  .dropdown-content > button {
	font-size: 0.8rem;
  }

  .dropdown-closed {
	display: none;
  }
  .toggle {
	all: unset;
	cursor: pointer;
	align-self: center;
	text-align: center;
  }
  span {
	font-size: 1rem;
	font-weight: 500;
  }

  .avatar-container {
	flex-shrink: 0;
	display: flex;
	gap: 10px;
  }
  .av {
	flex: 0 0 auto;
  }
  </style>