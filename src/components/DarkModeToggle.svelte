<script>
	import { onMount } from 'svelte';

	let isDark = $state(false);

	onMount(() => {
		const theme = localStorage.getItem('theme');

		if (theme) {
			isDark = theme === 'dark';
		} else {
			isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		}

		if (isDark) {
			document.documentElement.classList.add('dark');
		}
	});

	function toggleDarkMode() {
		isDark = !isDark;

		document.documentElement.classList.remove('dark');

		if (isDark) {
			document.documentElement.classList.add('dark');
		}

		localStorage.setItem('theme', isDark ? 'dark' : 'light');
	}
</script>

<div class="fixed bottom-6 right-6 z-50">
	<button
		class="relative h-12 w-12 transform rounded-full bg-gradient-to-br from-blue-100 to-blue-200 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 dark:from-slate-700 dark:to-slate-800 dark:focus:ring-blue-600"
		onclick={toggleDarkMode}
		aria-label="Toggle dark mode"
	>
		<div class="absolute inset-0 flex items-center justify-center">
			<!-- Soleil -->
			<svg
				class="absolute h-6 w-6 transform transition-all duration-500 ease-in-out {isDark
					? 'rotate-[360deg] scale-0 opacity-0'
					: 'rotate-0 scale-100 opacity-100'} text-amber-500"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<circle cx="12" cy="12" r="4" />
				<path d="M12 2v2" />
				<path d="M12 20v2" />
				<path d="M4.93 4.93l1.41 1.41" />
				<path d="M17.66 17.66l1.41 1.41" />
				<path d="M2 12h2" />
				<path d="M20 12h2" />
				<path d="M6.34 17.66l-1.41 1.41" />
				<path d="M19.07 4.93l-1.41 1.41" />
			</svg>

			<!-- Lune -->
			<svg
				class="absolute h-5 w-5 transform transition-all duration-500 ease-in-out {isDark
					? 'rotate-0 scale-100 opacity-100'
					: '-rotate-[360deg] scale-0 opacity-0'} text-slate-200"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
				<path d="M17 4a2 2 0 0 0 2 2a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2a2 2 0 0 0 2 -2" />
				<path d="M19 11h2m-1 -1v2" />
			</svg>
		</div>
	</button>
</div>

<style>
	button:hover svg {
		filter: drop-shadow(0 0 0.5rem currentColor);
	}
</style>
