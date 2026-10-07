# AI Usage Documentation

## AI Tools Used
- **Antigravity (Gemini 3.1 Pro)**: Used as the primary AI pair programmer during the hackathon.

## What Each AI Tool Helped With
- **Antigravity**:
  - Scaffolding the React + Vite frontend and Express + MongoDB backend.
  - Designing the dark premium UI, incorporating Framer Motion for animations.
  - Setting up Tailwind CSS integration mid-project.
  - Writing the fallback/mock implementations for News, AI summarization, and Image generation (Demo Mode).
  - Building the clustering algorithm for news deduplication based on Jaccard string similarity.

## AI-Generated Code Examples
The clustering algorithm relies heavily on AI-assisted string similarity logic:
```javascript
const calculateSimilarity = (text1, text2) => {
  const set1 = getWords(text1);
  const set2 = getWords(text2);
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  if (union.size === 0) return 0;
  return intersection.size / union.size;
};
```

## Example of Incorrect/Unsafe Code & Resolution
**Issue**: Initially, when running a command to set up the Vite project (`npm create vite@latest .`), the AI did not properly switch into the `client` directory because of an improperly chained shell command (`mkdir pulse-shorts; cd pulse-shorts; mkdir client server; cd client;`). PowerShell threw a `PositionalParameterNotFound` error, causing Vite to initialize in the root folder instead of the `client` folder.

**Identification**: The AI checked the filesystem using `ls` after the command failed to notice that `package.json` and Vite configs were in the root directory.

**Fix**: The AI issued a move command to correctly transfer the initialized files into the `client` folder (`mkdir client; mv ... client/`) and properly CD'ed into the folder to run `npm install`.

## Personal Implementation & Understanding
I conceptualized the system architecture, the flow from News Aggregation -> Clustering -> AI Summarization -> Image Generation -> Shorts UI. I understood and maintained the boundaries between the frontend state management (React hooks) and the backend REST endpoints. I instructed the AI on the exact aesthetic requirements (dark premium, glassmorphism, vertical snapping) and reviewed the Tailwind application to ensure it matched the vision.

## Validation of AI Summaries
In the current Demo Mode, the AI summaries are generated using a deterministic fallback template combining the extracted headlines and keywords. When real LLM APIs (OpenAI/Gemini) are integrated, the prompt specifically instructs the model to adhere strictly to the provided source text (zero hallucination).
