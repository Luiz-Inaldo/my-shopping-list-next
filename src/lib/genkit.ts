import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// 1. Inicialização correta
const ai = genkit({
  plugins: [googleAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY })],
  model: 'google-genai/gemini-3-flash-preview'
});

const helloFlow = ai.defineFlow('helloFlow', async (name) => {
  // make a generation request
  const { text } = await ai.generate(`Hello Gemini, my name is ${name}`);
  console.log(text);
});

helloFlow('World');

export { ai, helloFlow };
