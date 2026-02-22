<script lang="ts">
	import { cn } from '../../utils';

	interface Props {
		class?: string;
	}

	let { class: className = $bindable('') }: Props = $props();
</script>

<div class={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)}>
	<slot />
</div>
