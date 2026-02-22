<script lang="ts">
	import { onMount } from 'svelte';
	import { chatStore } from '$lib/stores/chatStore';
	import MessageBubble from '$lib/components/chat/message-bubble.svelte';
	import ChatInput from '$lib/components/chat/chat-input.svelte';
	import ChatHistory from '$lib/components/chat/chat-history.svelte';
	import ScrollArea from '$lib/components/ui/scroll-area.svelte';
	import { generateId } from '$lib/utils';
	import type { Message } from '$lib/types';

	let messagesContainer: HTMLDivElement;
	let isStreaming = $state(false);

	onMount(() => {
		chatStore.load();
		if ($chatStore.conversations.length === 0) {
			chatStore.createConversation();
		} else if (!$chatStore.currentConversation) {
			chatStore.selectConversation($chatStore.conversations[0].id);
		}
		chatStore.save();
	});

	$effect(() => {
		if (messagesContainer && $chatStore.currentConversation) {
			scrollToBottom();
		}
	});

	function scrollToBottom() {
		setTimeout(() => {
			if (messagesContainer) {
				messagesContainer.scrollTop = messagesContainer.scrollHeight;
			}
		}, 100);
	}

	async function handleSend(message: string) {
		if (!$chatStore.currentConversation || isStreaming) return;

		const userMessage: Message = {
			id: generateId(),
			role: 'user',
			content: message,
			timestamp: Date.now()
		};

		chatStore.addMessage(userMessage);
		chatStore.save();
		chatStore.setLoading(true);
		isStreaming = true;
		chatStore.setError(null);

		// Update conversation title if it's the first message
		if ($chatStore.currentConversation.messages.length === 1) {
			const title = message.slice(0, 50) + (message.length > 50 ? '...' : '');
			$chatStore.currentConversation.title = title;
			chatStore.save();
		}

		try {
			const messages = $chatStore.currentConversation.messages.map((msg) => ({
				role: msg.role,
				content: msg.content
			}));

			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ messages })
			});

			if (!response.ok) {
				throw new Error('Failed to get response');
			}

			const reader = response.body?.getReader();
			const decoder = new TextDecoder();
			let assistantContent = '';

			if (reader) {
				while (true) {
					const { done, value } = await reader.read();
					if (done) break;

					const chunk = decoder.decode(value, { stream: true });
					const lines = chunk.split('\n');

					for (const line of lines) {
						if (line.trim()) {
							// Vercel AI SDK format: 0:"chunk" or data: {...}
							if (line.startsWith('0:"')) {
								try {
									const content = line.slice(3, -1).replace(/\\"/g, '"');
									assistantContent += content;
									chatStore.updateLastMessage(assistantContent);
									scrollToBottom();
								} catch (e) {
									// Ignore parse errors
								}
							} else if (line.startsWith('data: ')) {
								try {
									const data = JSON.parse(line.slice(6));
									if (data.content) {
										assistantContent += data.content;
										chatStore.updateLastMessage(assistantContent);
										scrollToBottom();
									}
								} catch (e) {
									// Ignore parse errors
								}
							}
						}
					}
				}
			}

			chatStore.save();
		} catch (error) {
			console.error('Error sending message:', error);
			chatStore.setError('Failed to send message. Please try again.');
		} finally {
			chatStore.setLoading(false);
			isStreaming = false;
		}
	}
</script>

<div class="flex h-screen">
	<ChatHistory />
	<div class="flex flex-1 flex-col">
		{#if $chatStore.currentConversation}
			<ScrollArea class="flex-1" bind:this={messagesContainer}>
				<div class="flex flex-col">
					{#each $chatStore.currentConversation.messages as message (message.id)}
						<MessageBubble {message} />
					{/each}
					{#if $chatStore.isLoading}
						<div class="flex gap-3 px-4 py-3">
							<div class="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
								<span class="text-white text-sm font-medium">AI</span>
							</div>
							<div class="bg-muted rounded-lg px-4 py-2">
								<div class="flex gap-1">
									<div class="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style="animation-delay: 0ms"></div>
									<div class="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style="animation-delay: 150ms"></div>
									<div class="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style="animation-delay: 300ms"></div>
								</div>
							</div>
						</div>
					{/if}
				</div>
			</ScrollArea>
			{#if $chatStore.error}
				<div class="border-t bg-destructive/10 text-destructive px-4 py-2 text-sm">
					{$chatStore.error}
				</div>
			{/if}
			<ChatInput disabled={isStreaming} onSend={handleSend} />
		{:else}
			<div class="flex flex-1 items-center justify-center">
				<p class="text-muted-foreground">Select a conversation or create a new one</p>
			</div>
		{/if}
	</div>
</div>
