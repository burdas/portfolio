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

    // Leer contexto de repomix
    let context = '';
    const repomixPath = path.resolve(process.cwd(), 'repomix-output.xml');
    
    if (fs.existsSync(repomixPath)) {
      context = fs.readFileSync(repomixPath, 'utf-8');
      
      // Limpieza básica para ahorrar tokens: eliminar SVGs y comentarios largos
      context = context.replace(/<svg[\s\S]*?<\/svg>/gi, '[SVG OMITTED]');
      context = context.replace(/\/\*[\s\S]*?\*\//g, '');
      
      // Truncar a 12k caracteres para ajustarse al límite de 6k TPM de Groq
      if (context.length > 12000) {
        context = context.substring(0, 12000) + '... [TRUNCATED FOR TOKEN LIMIT]';
      }
    } else {
      console.warn('repomix-output.xml not found at', repomixPath);
      context = 'No hay contexto adicional disponible sobre el portfolio.';
    }

    const systemPrompt = `Eres el asistente del portfolio de Marcos Burdaspar. Responde preguntas sobre sus proyectos, habilidades y experiencia basándote ÚNICAMENTE en el siguiente contexto:\n\n${context}`;

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
