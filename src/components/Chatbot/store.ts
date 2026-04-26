export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export const state = {
  isOpen: false,
  history: [] as ChatMessage[],
  isLoading: false,
  placeholderStopped: false,
};
