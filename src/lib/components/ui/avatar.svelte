<script lang="ts">
	import { cn } from '../../utils';

	interface Props {
		class?: string;
		initials?: string;
		color?: string;
	}

	let {
		class: className = $bindable(''),
		initials = '',
		color = ''
	}: Props = $props();
</script>

<div
	class={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}
	style={color ? `background-color: ${color}` : ''}
>
	{#if initials}
		<div class="flex h-full w-full items-center justify-center bg-muted text-sm font-medium">
			{initials}
		</div>
	{:else}
		<slot />
	{/if}
</div>
