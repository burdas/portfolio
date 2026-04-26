import { state } from './store';

export async function getChatbotResponse(message: string) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history: state.history }),
  });
  return response;
}
