<script>
	let isOpen = false;

	function toggleMenu() {
		isOpen = !isOpen;
	}
</script>

<nav class="bg-gray-800 p-4">
	<div class="container mx-auto flex items-center justify-between">
		<div class="text-lg font-bold text-white">My Portfolio</div>
		<div class="hidden space-x-4 md:flex">
			<a href="#" class="text-gray-300 hover:text-white">Accueil</a>
			<a href="#" class="text-gray-300 hover:text-white">A Propos</a>
			<a href="#" class="text-gray-300 hover:text-white">Projets</a>
			<a href="#" class="text-gray-300 hover:text-white">Contact</a>
		</div>
		<div class="md:hidden">
			<button
				on:click={toggleMenu}
				class="text-gray-300 hover:text-white focus:outline-none"
				aria-label="Toggle menu"
			>
				<svg
					class="h-6 w-6"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h16m-7 6h7"
					></path>
				</svg>
			</button>
		</div>
	</div>
	{#if isOpen}
		<div class="md:hidden">
			<a href="#" class="block p-2 text-gray-300 hover:text-white">Accueil</a>
			<a href="#" class="block p-2 text-gray-300 hover:text-white">A Propos</a>
			<a href="#" class="block p-2 text-gray-300 hover:text-white">Projets</a>
			<a href="#" class="block p-2 text-gray-300 hover:text-white">Contact</a>
		</div>
	{/if}
</nav>

<style>
	nav {
		background-color: #1a202c;
	}
</style>
