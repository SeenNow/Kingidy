# Kingidy GraphQL Server

This folder contains a minimal GraphQL server (MVP) for Kingidy.

Features:
- GraphQL API with queries and mutations for `Chat` and `Message`
- Token estimation util on message creation (simple whitespace-based estimate)
- Prisma schema for local SQLite database to simplify local dev

Setup (local dev):

1. Install dependencies

```powershell
cd server
npm install
```

2. Copy `.env.example` to `.env` and set values

3. Create and migrate DB (Prisma / SQLite)

```powershell
npx prisma generate
npx prisma migrate dev --name init
```

4. Start server

```powershell
npm run dev
```

Query playground: http://localhost:4000/graphql (GraphiQL)

	- Set `GOOGLE_API_KEY` and `GOOGLE_PROJECT_ID` in `server/.env` for Google Generative AI usage (Gemini models).
	- The server will call Google Generative AI using `GOOGLE_API_KEY` when the selected model string contains `gemini`.
	- Token usage reporting from Google may not match OpenAI token counts; use `gpt-3-encoder` or `@dqbd/tiktoken` for estimation locally.
Support for Google Gemini:
	- Set `GOOGLE_API_KEY` and `GOOGLE_PROJECT_ID` in `server/.env` for Google Generative AI usage (Gemini models).
	- Optionally set `GOOGLE_LOCATION` (e.g., `us-central1`). The server selects Gemini adapter when the model string contains `gemini`.
	- Model names are mapped in the server for convenience: `gemini-pro` -> `models/chat-bison-001`, `gemini-ultra` -> `models/chat-bison-002`. You can directly specify the target model string as well.

Next steps:
- Add authentication and user management
- Integrate a real LLM provider (OpenAI) and use `@dqbd/tiktoken` for accurate tokens
- Add subscriptions (websockets) for real-time messages
- Change DB to Postgres for production readiness
