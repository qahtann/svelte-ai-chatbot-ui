<script lang="ts">
	import { Send } from 'lucide-svelte';
	import Button from '../ui/button.svelte';
	import Input from '../ui/input.svelte';

	interface Props {
		disabled?: boolean;
		onSend: (message: string) => void;
	}

	let {
		disabled = $bindable(false),
		onSend
	}: Props = $props();

	let input = $state('');
	let textarea: HTMLTextAreaElement;

	function handleSend() {
		if (input.trim() && !disabled) {
			onSend(input.trim());
			input = '';
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	}
</script>

<div class="border-t bg-background p-4">
	<div class="flex gap-2">
		<textarea
			bind:this={textarea}
			bind:value={input}
			onkeydown={handleKeydown}
			placeholder="Type your message..."
			disabled={disabled}
			class="flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px] max-h-[200px]"
			rows="1"
		/>
		<Button onclick={handleSend} disabled={disabled || !input.trim()} size="icon">
			<Send class="h-4 w-4" />
		</Button>
	</div>
</div>
