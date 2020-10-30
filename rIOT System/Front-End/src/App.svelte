<script>
	import Main from "./Main.svelte";
	let loginStatus = true;
</script>

<main>
	{#if loginStatus}
		<Main></Main>
	{:else}
		<Login></Login>
	{/if}
</main>