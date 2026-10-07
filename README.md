# PulseShorts
> **"Your world. One story at a time."**

PulseShorts transforms real-time news into short, visual, trustworthy stories displayed in a TikTok/Shorts-style vertical feed.

---

## Table of Contents
1. [Features](#features)
2. [Architecture](#architecture)
3. [Folder Structure](#folder-structure)
4. [Data Flow](#data-flow)
5. [AI & Deduplication](#ai--deduplication)
6. [MongoDB Schema](#mongodb-schema)
7. [API Reference](#api-reference)
8. [Environment Variables](#environment-variables)
9. [Local Setup](#local-setup)
10. [Deployment](#deployment)
11. [Limitations & Future Work](#limitations--future-work)

---

## Features
- **Real-time News Aggregation** — Pulls from Google News RSS, Reddit, and Hacker News.
- **Story Clustering** — Deduplicates overlapping stories from multiple sources using Jaccard Similarity.
- **AI Summarisation** — Condenses clusters into a concise summary with a "Why this matters" section.
- **AI Image Generation** — Generates contextual editorial visuals per story.
- **Vertical Feed UI** — Immersive, full-screen scrolling experience (TikTok/Shorts-style).
- **Source Transparency** — Clear attribution with direct links to original articles.
- **Search History** — Persists recent searches for quick re-use.

---

## Architecture

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4, Framer Motion |
| Backend | Node.js, Express 5 (ESM) |
| Database | MongoDB Atlas (Mongoose) |
| AI / LLM | OpenAI / Gemini (abstracted, swappable) |
| News Sources | Google News RSS, Reddit API, Hacker News API |

---

## Folder Structure
```
pulse-shorts/
├── client/                     # Vite + React frontend
│   ├── public/
│   ├── src/
│   │   ├── animations/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── LoadingScreen.jsx
│   │   │   ├── ShortsFeed.jsx
│   │   │   ├── SourceModal.jsx
│   │   │   └── StoryCard.jsx
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   └── Feed.jsx
│   │   ├── services/
│   │   ├── styles/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
├── server/                     # Express API backend
│   ├── config/
│   ├── controllers/
│   │   ├── newsController.js
│   │   └── storyController.js
│   ├── middleware/
│   ├── models/
│   │   ├── Story.js
│   │   ├── Source.js
│   │   └── SearchHistory.js
│   ├── routes/
│   │   ├── newsRoutes.js
│   │   ├── storyRoutes.js
│   │   └── searchHistoryRoutes.js
│   ├── services/
│   │   ├── ai/
│   │   │   └── aiService.js
│   │   ├── image/
│   │   │   └── imageService.js
│   │   └── news/
│   │       ├── clusterService.js
│   │       ├── googleNewsService.js
│   │       ├── hackerNewsService.js
│   │       ├── newsNormalizer.js
│   │       └── redditService.js
│   ├── utils/
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Data Flow

```
Search Query
  → POST /api/news/search
  → Fetch (Google News RSS + Reddit + Hacker News)
  → Normalize articles
  → Cluster by Jaccard Similarity
  → AI Summarisation (headline + 60-word summary + "Why it matters")
  → AI Image Generation
  → Save Story + Sources to MongoDB
  → Return to Frontend
  → Render vertical Shorts feed
```

---

## AI & Deduplication

### LLM Integration
The AI layer (`aiService.js`) is provider-agnostic. Switch between **OpenAI** and **Gemini** by changing `LLM_PROVIDER` in your `.env`. A robust fallback mode generates summaries from extracted article text when no API key is set.

### Clustering
`clusterService.js` implements **Jaccard Similarity** on article headlines and body text to group stories about the same event, eliminating duplicates across sources.

---

## MongoDB Schema

### Story
| Field | Type | Description |
|---|---|---|
| `clusterId` | String | Unique ID for the story cluster |
| `headline` | String | AI-generated headline |
| `summary` | String | 60-word AI summary |
| `whyItMatters` | String | AI-generated context snippet |
| `imageUrl` | String | Generated editorial image URL |
| `category` | String | News category tag |
| `sources` | [Source] | Referenced source documents |

### Source
| Field | Type | Description |
|---|---|---|
| `sourceName` | String | Publisher name |
| `url` | String | Link to original article |
| `headline` | String | Original article headline |
| `publishedAt` | Date | Publication timestamp |

### SearchHistory
Stores recent search queries for re-use in the UI.

---

## API Reference

### `POST /api/news/search`
Trigger a news fetch, cluster, summarise, and generate pipeline.

**Request body:**
```json
{ "keywords": ["AI", "climate"] }
```

**Response:** Array of processed `Story` objects.

---

### `GET /api/stories`
Paginated feed of previously generated stories.

**Query params:** `?page=1&limit=10`

---

### `GET /api/stories/:id`
Fetch a single story by ID.

---

## Environment Variables

Create a `.env` file inside the `server/` directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/pulse-shorts

# LLM — set provider to "openai" or "gemini"
LLM_PROVIDER=gemini
LLM_API_KEY=your_api_key_here

# Image generation
IMAGE_API_KEY=your_image_api_key_here
```

> **Note:** Leave `LLM_API_KEY` empty to run in fallback/demo mode.

---

## Local Setup

### Prerequisites
- Node.js ≥ 18
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repo
```bash
git clone https://github.com/your-username/pulse-shorts.git
cd pulse-shorts
```

### 2. Start the backend
```bash
cd server
npm install
# Copy and fill in .env (see Environment Variables above)
npm run dev       # nodemon with hot-reload
# or
npm start         # production
```

### 3. Start the frontend
```bash
cd client
npm install
npm run dev       # Vite dev server at http://localhost:5173
```

---

## Deployment

| Part | Platform | Notes |
|---|---|---|
| Frontend | **Vercel** | Build command: `npm run build`, output dir: `dist` |
| Backend | **Render / Railway** | Set all env vars in the platform dashboard |
| Database | **MongoDB Atlas** | Whitelist the server IP or use `0.0.0.0/0` for testing |

---

## Limitations & Future Work

### Current Limitations
- API routes are unauthenticated.
- Clustering uses keyword similarity — text embeddings would improve accuracy.
- Image generation depends on an external paid API.

### Planned Improvements
- [ ] User accounts and personalised feeds
- [ ] Persistent bookmarks across sessions
- [ ] Embedding-based clustering (e.g., sentence-transformers)
- [ ] Rate limiting and API key auth middleware
- [ ] PWA support for mobile install

---

## Screenshots
*(Add screenshots here)*
