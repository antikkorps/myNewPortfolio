<script lang="ts">
	import '../app.css';
	import DarkModeToggle from '../components/DarkModeToggle.svelte';
	import Navbar from '../components/Navbar.svelte';

	let { children } = $props();
</script>

<Navbar />
<div class="flex h-screen w-full flex-col bg-slate-300 dark:bg-neutral-800">
	{@render children()}

	<DarkModeToggle />
</div>
