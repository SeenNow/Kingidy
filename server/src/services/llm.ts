import fetch from 'node-fetch';
import { estimateMessageTokens } from '../utils/tokenizer';

export interface LLMResponse {
  reply: string;
  promptTokens: number | null;
  responseTokens: number | null;
  totalTokens: number | null;
}

export const callLLM = async (prompt: string, model = 'gpt-3.5-turbo'): Promise<LLMResponse> => {
  const apiKey = process.env.OPENAI_API_KEY;
  const gKey = process.env.GOOGLE_API_KEY;
  const gProject = process.env.GOOGLE_PROJECT_ID;
  if (!apiKey && !gKey) {
    // fallback: echo a reply and estimate tokens
    const reply = `Assistant (demo): Echoing your message: ${prompt}`;
    const promptTokens = estimateMessageTokens(prompt, 'USER');
    const responseTokens = estimateMessageTokens(reply, 'ASSISTANT');
    return { reply, promptTokens, responseTokens, totalTokens: promptTokens + responseTokens };
  }

  // If model indicates google Gemini and GOOGLE_API_KEY is set, call Google Generative AI REST API
  if (model && model.toLowerCase().includes('gemini') && gKey) {
    // Map friendly alias to actual Google generative model names used in this project
    const modelMapping: Record<string, string> = {
      'gemini-pro': 'models/chat-bison-001',
      'gemini-ultra': 'models/chat-bison-002'
    };
    const googleModel = modelMapping[model] || model.replace(/^gemini-/, model);
    const projectSegment = gProject ? `/projects/${gProject}` : '';
    const location = process.env.GOOGLE_LOCATION || 'us-central1';
    // Use Google GenAI endpoint - note: ensure your billing & permissions are setup for the project
    const endpointBase = `https://generative.googleapis.com/v1beta2${projectSegment}/locations/${location}/models/${googleModel}:generateText`;
    const url = `${endpointBase}?key=${gKey}`;
    const body = {
      text: prompt,
      temperature: 0.2,
      maxOutputTokens: 512
    };
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Google LLM API error: ${response.statusText} ${text}`);
    }
    const bodyData = await response.json();
    const reply = bodyData?.candidates?.[0]?.content ?? bodyData?.output?.[0]?.content ?? '';
    // Google Generative API does not always provide token usage in the same way, set null
    return { reply, promptTokens: null, responseTokens: null, totalTokens: null };
  }

  // Otherwise, OpenAI style call
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1024
    })
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`LLM API error: ${response.statusText} ${text}`);
  }
  const body = await response.json();
  const reply = body?.choices?.[0]?.message?.content ?? '';
  const usage = body?.usage;
  const promptTokens = usage?.prompt_tokens ?? null;
  const responseTokens = usage?.completion_tokens ?? usage?.response_tokens ?? null;
  const totalTokens = usage?.total_tokens ?? null;
  return { reply, promptTokens, responseTokens, totalTokens };
};
