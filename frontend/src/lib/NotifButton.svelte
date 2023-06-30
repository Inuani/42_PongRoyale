<script lang="ts">
    import all from "./global";

	let notifications: number;

	all.notifs.subscribe(value => {
		notifications = value.filter(a => a.pending == true).length;
    	notifications = notifications;
	});
</script>

<a href="/notifications">
<button class="icon-button">
	<span class="material-icons">notifications</span>
	{#if notifications > 0}
	  <span class="icon-button__badge">{notifications < 100 ? notifications : "+99" }</span>
	{/if}
</button>
</a>

<style>

.icon-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: #333333;
  background: #dddddd;
  border: none;
  outline: none;
  border-radius: 50%;
}

.icon-button:hover {
  cursor: pointer;
}

.icon-button:active {
  background: #cccccc;
}

.icon-button__badge {
  position: absolute;
  top: -10px;
  right: -10px;
  padding: 1px;
  background: black;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}

.material-icons {
  font-family: 'Material Icons';
}

</style>