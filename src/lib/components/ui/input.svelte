<script lang="ts">
	import { cn } from '../../utils';

	interface Props {
		class?: string;
		type?: string;
		placeholder?: string;
		value?: string;
		disabled?: boolean;
	}

	let {
		class: className = $bindable(''),
		type = 'text',
		placeholder = '',
		value = $bindable(''),
		disabled = $bindable(false),
		...restProps
	}: Props = $props();
</script>

<input
	type={type}
	class={cn(
		'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
		className
	)}
	{placeholder}
	bind:value
	{disabled}
	{...restProps}
/>
