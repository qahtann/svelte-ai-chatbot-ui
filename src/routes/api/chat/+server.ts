import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { streamText } from 'ai';
import { openai } from 'ai/openai';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { messages } = await request.json();

		if (!messages || !Array.isArray(messages)) {
			return json({ error: 'Invalid request' }, { status: 400 });
		}

		const apiKey = process.env.OPENAI_API_KEY;

		if (!apiKey) {
			// Mock response for development using Vercel AI SDK format
			const mockResponse = `I'm a mock AI assistant. You said: "${messages[messages.length - 1]?.content || ''}". 

In a real implementation, you would need to set your OPENAI_API_KEY environment variable to use the actual OpenAI API.

Here's a sample response to demonstrate the streaming functionality. The response is being streamed token by token, which provides a smooth user experience.`;

			// Create a mock stream using Vercel AI SDK format
			const encoder = new TextEncoder();
			const stream = new ReadableStream({
				async start(controller) {
					const words = mockResponse.split(' ');
					for (let i = 0; i < words.length; i++) {
						const chunk = (i === 0 ? '' : ' ') + words[i];
						// Vercel AI SDK format: 0:"chunk"
						controller.enqueue(encoder.encode(`0:"${chunk.replace(/"/g, '\\"')}"\n`));
						await new Promise((resolve) => setTimeout(resolve, 50));
					}
					controller.close();
				}
			});

			return new Response(stream, {
				headers: {
					'Content-Type': 'text/plain; charset=utf-8',
					'Cache-Control': 'no-cache',
					Connection: 'keep-alive'
				}
			});
		}

		// Real OpenAI streaming
		const result = await streamText({
			model: openai('gpt-4'),
			messages: messages.map((msg: { role: string; content: string }) => ({
				role: msg.role as 'user' | 'assistant' | 'system',
				content: msg.content
			})),
			system: 'You are a helpful AI assistant. Be concise and friendly.'
		});

		return result.toDataStreamResponse();
	} catch (error) {
		console.error('Chat API error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
