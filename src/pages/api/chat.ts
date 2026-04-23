import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { message, history } = await request.json();

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), { status: 400 });
    }

    const GROQ_API_KEY = import.meta.env.GROQ_API_KEY;

    if (!GROQ_API_KEY) {
      console.error('GROQ_API_KEY is not defined');
      return new Response(JSON.stringify({ error: 'server_error' }), { status: 500 });
    }

    // Leer contexto desde Markdown
    let context = '';
    const contextPath = path.resolve(process.cwd(), 'src/data/chatbot-context.md');
    
    if (fs.existsSync(contextPath)) {
      context = fs.readFileSync(contextPath, 'utf-8');
    } else {
      console.warn('Chatbot context file not found at', contextPath);
      context = 'No hay información detallada disponible en este momento.';
    }

    const systemPrompt = `Responde preguntas sobre Marcos Burdaspar basándote ÚNICAMENTE en el siguiente contexto:\n\n${context}`;

    // Limitar historial a los últimos 10 mensajes
    const limitedHistory = history?.slice(-10) || [];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: systemPrompt },
          ...limitedHistory,
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (response.status === 429) {
      return new Response(JSON.stringify({ error: 'rate_limit' }), { status: 429 });
    }

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API error:', errorData);
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
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: 'server_error' }), { status: 500 });
  }
};
