import type { APIRoute } from 'astro';
import { getEntry } from 'astro:content';
import { GROQ_API_URL, GROQ_MODEL, MAX_HISTORY_LENGTH } from '../../config';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { message, history } = await request.json();

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), { status: 400 });
    }

    const GROQ_API_KEY = import.meta.env.GROQ_API_KEY;

    if (!GROQ_API_KEY) {
      return new Response(JSON.stringify({ error: 'server_error' }), { status: 500 });
    }

    const chatbotEntry = await getEntry('chatbot', 'context');
    const context = chatbotEntry?.body || 'No hay información detallada disponible en este momento.';

    const systemPrompt = `Responde preguntas sobre Marcos Burdaspar basándote ÚNICAMENTE en el siguiente contexto:\n\n${context}`;
    const limitedHistory = history?.slice(-MAX_HISTORY_LENGTH) || [];

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          ...limitedHistory,
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    clearTimeout(timeoutId);

    if (response.status === 429) {
      return new Response(JSON.stringify({ error: 'rate_limit' }), { status: 429 });
    }

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'server_error' }), { status: 500 });
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    return new Response(JSON.stringify({ content: assistantMessage }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: 'server_error' }), { status: 500 });
  }
};
