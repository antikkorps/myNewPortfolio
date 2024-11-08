<script lang="ts">
	let isOpen = $state(false);
	let props = $props();

	const handleClick = () => {
		isOpen = !isOpen;
	};

	const menuItems = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'];

	function getItemStyle(index: number) {
		const angle = (360 / menuItems.length) * index;
		const delay = index * 100;
		return `--angle: ${angle}; --delay: ${delay}ms`;
	}
</script>

<div class="menu-container">
	<button {...props} onclick={handleClick}> Projets </button>

	<div class="menu-items">
		{#each menuItems as item, i}
			<button class="menu-item" class:open={isOpen} style={getItemStyle(i)}>
				{item}
			</button>
		{/each}
	</div>
</div>

<style>
	.menu-container {
		position: relative;
		display: inline-block;
	}

	button {
		font-size: 1.4em;
		width: 6em;
		height: 6em;
		border-radius: 50%;
		background: radial-gradient(circle at 25% 25%, hsl(0, 100%, 50%) 0, hsl(0, 100%, 40%) 100%);
		box-shadow:
			0 8px 0 hsl(0, 100%, 30%),
			2px 12px 10px rgba(0, 0, 0, 0.35);
		color: hsl(0, 100%, 30%);
		text-shadow:
			-1px -1px 2px rgba(0, 0, 0, 0.3),
			1px 1px 2px rgba(255, 255, 255, 0.4);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		transform: translate(0, -8px);
		transition: all 0.2s;
	}

	button:active {
		transform: translate(0, -2px);
		box-shadow:
			0 2px 0 hsl(0, 100%, 30%),
			2px 6px 10px rgba(0, 0, 0, 0.35);
	}

	.menu-items {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 0;
		height: 0;
	}

	.menu-item {
		position: absolute;
		width: 4em;
		height: 4em;
		margin: -2em;
		font-size: 1em;
		background: radial-gradient(circle at 25% 25%, hsl(0, 0%, 100%) 0, hsl(0, 0%, 90%) 100%);
		color: black;
		opacity: 0;
		transform: rotate(0deg) translate(0) rotate(0deg);
		pointer-events: none;
		transition: all 0s;
	}

	.menu-item.open {
		opacity: 1;
		transform: rotate(calc(var(--angle) * 1deg + 360deg)) translate(120px)
			rotate(calc(-1 * var(--angle) * 1deg - 360deg));
		pointer-events: auto;
		transition:
			transform 1s cubic-bezier(0.4, 0, 0.2, 1) var(--delay),
			opacity 0.3s ease var(--delay);
	}

	/* Animation inverse lors de la fermeture */
	.menu-item:not(.open) {
		transform: rotate(calc(var(--angle) * 1deg)) translate(120px)
			rotate(calc(-1 * var(--angle) * 1deg));
		transition:
			transform 1s cubic-bezier(0.4, 0, 0.2, 1) var(--delay),
			opacity 0.3s ease calc(var(--delay) + 0.7s);
	}

	.menu-item:hover {
		background: radial-gradient(circle at 25% 25%, hsl(0, 0%, 95%) 0, hsl(0, 0%, 85%) 100%);
	}
</style>
