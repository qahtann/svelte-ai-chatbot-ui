import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import type { Conversation, Message } from '../types';
import { generateId } from '../utils';

const STORAGE_KEY = 'chat-conversations';

function createChatStore() {
	const { subscribe, set, update } = writable<{
		currentConversation: Conversation | null;
		conversations: Conversation[];
		isLoading: boolean;
		error: string | null;
	}>({
		currentConversation: null,
		conversations: [],
		isLoading: false,
		error: null
	});

	return {
		subscribe,
		load: () => {
			if (!browser) return;
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				try {
					const conversations = JSON.parse(stored) as Conversation[];
					update((state) => ({
						...state,
						conversations
					}));
				} catch (error) {
					console.error('Failed to load conversations:', error);
				}
			}
		},
		save: () => {
			if (!browser) return;
			update((state) => {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(state.conversations));
				return state;
			});
		},
		createConversation: (title?: string) => {
			const conversation: Conversation = {
				id: generateId(),
				title: title || 'New Chat',
				messages: [],
				createdAt: Date.now(),
				updatedAt: Date.now()
			};
			update((state) => ({
				...state,
				currentConversation: conversation,
				conversations: [conversation, ...state.conversations]
			}));
			return conversation;
		},
		selectConversation: (id: string) => {
			update((state) => {
				const conversation = state.conversations.find((c) => c.id === id);
				return {
					...state,
					currentConversation: conversation || null
				};
			});
		},
		addMessage: (message: Message) => {
			update((state) => {
				if (!state.currentConversation) return state;
				const conversation = {
					...state.currentConversation,
					messages: [...state.currentConversation.messages, message],
					updatedAt: Date.now()
				};
				const conversations = state.conversations.map((c) =>
					c.id === conversation.id ? conversation : c
				);
				return {
					...state,
					currentConversation: conversation,
					conversations
				};
			});
		},
		updateLastMessage: (content: string) => {
			update((state) => {
				if (!state.currentConversation || state.currentConversation.messages.length === 0)
					return state;
				const messages = [...state.currentConversation.messages];
				const lastMessage = messages[messages.length - 1];
				if (lastMessage.role === 'assistant') {
					messages[messages.length - 1] = { ...lastMessage, content };
				} else {
					messages.push({
						id: generateId(),
						role: 'assistant',
						content,
						timestamp: Date.now()
					});
				}
				const conversation = {
					...state.currentConversation,
					messages,
					updatedAt: Date.now()
				};
				const conversations = state.conversations.map((c) =>
					c.id === conversation.id ? conversation : c
				);
				return {
					...state,
					currentConversation: conversation,
					conversations
				};
			});
		},
		deleteConversation: (id: string) => {
			update((state) => {
				const conversations = state.conversations.filter((c) => c.id !== id);
				const currentConversation =
					state.currentConversation?.id === id ? null : state.currentConversation;
				return {
					...state,
					conversations,
					currentConversation
				};
			});
		},
		setLoading: (isLoading: boolean) => {
			update((state) => ({ ...state, isLoading }));
		},
		setError: (error: string | null) => {
			update((state) => ({ ...state, error }));
		}
	};
}

export const chatStore = createChatStore();

export const conversations = derived(chatStore, ($store) => $store.conversations);
export const currentConversation = derived(chatStore, ($store) => $store.currentConversation);
export const isLoading = derived(chatStore, ($store) => $store.isLoading);
export const error = derived(chatStore, ($store) => $store.error);
