import { encode } from 'gpt-3-encoder';

export const countTokens = (text: string) => {
  try {
    if (!text) return 0;
    const encoded = encode(text);
    return encoded.length;
  } catch (e) {
    // fallback to simple whitespace count
    return text.trim().split(/\s+/).length;
  }
};

export const estimateMessageTokens = (content: string, role: string) => {
  // heuristics; add a small base for assistant messages
  const base = role === 'ASSISTANT' ? 4 : 0;
  return base + countTokens(content);
};
