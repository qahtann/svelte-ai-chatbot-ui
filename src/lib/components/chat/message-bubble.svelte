<script lang="ts">
	import { marked } from 'marked';
	import type { Message } from '../../types';
	import Avatar from '../ui/avatar.svelte';
	import { cn } from '../../utils';

	interface Props {
		message: Message;
	}

	let { message }: Props = $props();

	const isUser = message.role === 'user';
	
	// Configure marked for safe HTML rendering
	marked.setOptions({
		breaks: true,
		gfm: true
	});
	
	const htmlContent = $derived(marked.parse(message.content) as string);
</script>

<div class={cn('flex gap-3 px-4 py-3', isUser ? 'justify-end' : 'justify-start')}>
	{#if !isUser}
		<Avatar initials="AI" color="hsl(var(--primary))" />
	{/if}
	<div
		class={cn(
			'max-w-[80%] rounded-lg px-4 py-2',
			isUser
				? 'bg-primary text-primary-foreground'
				: 'bg-muted text-muted-foreground'
		)}
	>
		{#if isUser}
			<p class="text-sm whitespace-pre-wrap">{message.content}</p>
		{:else}
			<div class="prose prose-sm dark:prose-invert max-w-none">
				{@html htmlContent}
			</div>
		{/if}
	</div>
	{#if isUser}
		<Avatar initials="U" color="hsl(var(--accent))" />
	{/if}
</div>
