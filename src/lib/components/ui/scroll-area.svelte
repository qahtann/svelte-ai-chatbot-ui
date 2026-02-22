<script lang="ts">
	import { cn } from '../../utils';

	interface Props {
		class?: string;
	}

	let { class: className = $bindable('') }: Props = $props();
</script>

<div class={cn('overflow-y-auto', className)}>
	<slot />
</div>
