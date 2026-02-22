export interface Message {
	id: string;
	role: 'user' | 'assistant';
	content: string;
	timestamp: number;
}

export interface Conversation {
	id: string;
	title: string;
	messages: Message[];
	createdAt: number;
	updatedAt: number;
}

export interface ChatState {
	currentConversation: Conversation | null;
	conversations: Conversation[];
	isLoading: boolean;
	error: string | null;
}
