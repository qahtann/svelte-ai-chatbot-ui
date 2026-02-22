<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';

	let theme = $state<'light' | 'dark'>('dark');

	onMount(() => {
		const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
		if (stored) {
			theme = stored;
		} else {
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			theme = prefersDark ? 'dark' : 'light';
		}
		updateTheme();
	});

	function updateTheme() {
		document.documentElement.classList.toggle('dark', theme === 'dark');
		localStorage.setItem('theme', theme);
	}

	$effect(() => {
		updateTheme();
	});
</script>

<div class="min-h-screen bg-background text-foreground">
	<slot />
</div>
