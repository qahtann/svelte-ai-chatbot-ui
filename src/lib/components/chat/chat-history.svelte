<script lang="ts">
	import { Plus, Trash2, Moon, Sun } from 'lucide-svelte';
	import Button from '../ui/button.svelte';
	import { chatStore } from '../../stores/chatStore';
	import { formatTimestamp } from '../../utils';
	import type { Conversation } from '../../types';

	let theme = $state<'light' | 'dark'>('dark');

	$effect(() => {
		const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
		if (stored) {
			theme = stored;
		} else {
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			theme = prefersDark ? 'dark' : 'light';
		}
		document.documentElement.classList.toggle('dark', theme === 'dark');
	});

	function toggleTheme() {
		theme = theme === 'dark' ? 'light' : 'dark';
		document.documentElement.classList.toggle('dark', theme === 'dark');
		localStorage.setItem('theme', theme);
	}

	function createNewChat() {
		chatStore.createConversation();
	}

	function selectChat(conversation: Conversation) {
		chatStore.selectConversation(conversation.id);
	}

	function deleteChat(id: string, e: MouseEvent) {
		e.stopPropagation();
		chatStore.deleteConversation(id);
	}
</script>

<div class="flex h-screen w-64 flex-col border-r bg-card">
	<div class="flex items-center justify-between border-b p-4">
		<h1 class="text-lg font-semibold">Chat History</h1>
		<div class="flex gap-2">
			<Button variant="ghost" size="icon" onclick={toggleTheme}>
				{#if theme === 'dark'}
					<Sun class="h-4 w-4" />
				{:else}
					<Moon class="h-4 w-4" />
				{/if}
			</Button>
			<Button variant="ghost" size="icon" onclick={createNewChat}>
				<Plus class="h-4 w-4" />
			</Button>
		</div>
	</div>
	<div class="flex-1 overflow-y-auto">
		{#each $chatStore.conversations as conversation (conversation.id)}
			<button
				onclick={() => selectChat(conversation)}
				class="w-full border-b p-3 text-left hover:bg-accent transition-colors relative group"
				class:bg-accent={$chatStore.currentConversation?.id === conversation.id}
			>
				<div class="flex items-start justify-between gap-2">
					<div class="flex-1 min-w-0">
						<p class="text-sm font-medium truncate">{conversation.title}</p>
						<p class="text-xs text-muted-foreground">
							{formatTimestamp(conversation.updatedAt)}
						</p>
					</div>
					<Button
						variant="ghost"
						size="icon"
						class="opacity-0 group-hover:opacity-100 h-6 w-6"
						onclick={(e) => deleteChat(conversation.id, e)}
					>
						<Trash2 class="h-3 w-3" />
					</Button>
				</div>
			</button>
		{/each}
	</div>
</div>
