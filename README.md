# 💬 Svelte AI Chatbot UI

[![Svelte](https://img.shields.io/badge/Svelte-5-FF3E00?logo=svelte)](https://svelte.dev/)
[![SvelteKit](https://img.shields.io/badge/SvelteKit-2-FF3E00?logo=svelte)](https://kit.svelte.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vercel AI SDK](https://img.shields.io/badge/Vercel%20AI-4.0-000000?logo=vercel)](https://sdk.vercel.ai/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A modern, production-ready AI chatbot interface built with Svelte 5, SvelteKit, and Vercel AI SDK. Features streaming responses, conversation history, markdown rendering, and a beautiful responsive UI.

![AI Chatbot Preview](https://via.placeholder.com/1200x600/1e293b/ffffff?text=Svelte+AI+Chatbot+UI)

## ✨ Features

- 🚀 **Streaming Responses** - Real-time token streaming for smooth AI responses
- 💾 **Conversation History** - Persistent chat history with localStorage
- 📝 **Markdown Support** - Beautiful markdown rendering in AI responses
- 🎨 **Modern UI** - Clean, responsive design with dark/light mode
- ⚡ **Fast & Lightweight** - Built with Svelte 5 for optimal performance
- 🔒 **Type-Safe** - Full TypeScript with strict mode
- 📱 **Responsive** - Works perfectly on desktop and mobile
- ♿ **Accessible** - ARIA labels and keyboard navigation
- 🌙 **Dark Mode** - System preference detection with manual toggle

## 🛠️ Tech Stack

- **Framework**: [Svelte 5](https://svelte.dev/) - Reactive UI framework with runes
- **Meta-Framework**: [SvelteKit 2](https://kit.svelte.dev/) - Full-stack Svelte framework
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **AI SDK**: [Vercel AI SDK](https://sdk.vercel.ai/) - Streaming AI responses
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- **Markdown**: [marked](https://marked.js.org/) - Markdown parser
- **Icons**: [Lucide Svelte](https://lucide.dev/) - Beautiful icon library
- **State**: Svelte Stores - Built-in reactive state management

## 📦 Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd svelte-ai-chatbot-ui
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables** (optional)

Create a `.env` file in the root directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

If you don't provide an API key, the app will use mock responses for development.

4. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🏗️ Project Structure

```
svelte-ai-chatbot-ui-1/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── ui/              # UI components (Button, Input, Card, etc.)
│   │   │   └── chat/            # Chat components (MessageBubble, ChatInput, etc.)
│   │   ├── stores/              # Svelte stores (chatStore)
│   │   ├── types.ts             # TypeScript types
│   │   └── utils.ts             # Utility functions
│   ├── routes/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── +server.ts   # AI streaming API route
│   │   └── +page.svelte         # Main chat page
│   ├── app.css                  # Global styles
│   ├── app.d.ts                 # TypeScript declarations
│   └── app.html                 # HTML template
├── static/                      # Static assets
└── README.md                    # This file
```

## 🔧 Key Features Explained

### Streaming Responses

The app uses Vercel AI SDK's `streamText` to stream AI responses token by token, providing a smooth user experience. The frontend reads the stream and updates the message in real-time.

### Conversation History

All conversations are stored in localStorage using Svelte stores. The chat history sidebar allows you to switch between conversations and create new ones.

### Markdown Rendering

AI responses are rendered as markdown using the `marked` library, supporting code blocks, lists, bold text, and more.

### Dark Mode

The app supports both light and dark themes with system preference detection. The theme preference is persisted in localStorage.

## Support

- Telegram: https://t.me/qahtan_n
- Twitter: https://x.com/qahtann_
