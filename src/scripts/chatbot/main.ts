import { state } from './store';
import { getChatbotResponse } from './api';
import { initUI, addMessage, removeLoadingIndicator, getChatInput, getChatForm, getChatSubmitButton } from './ui';

document.addEventListener("astro:page-load", () => {
    initUI();
    const chatInput = getChatInput();
    const chatForm = getChatForm();
    const chatSubmit = getChatSubmitButton();

    chatForm?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const message = chatInput?.value.trim();
        if (!message || state.isLoading) return;

        state.placeholderStopped = true;
        if (chatInput) chatInput.value = "";
        await addMessage("user", message);
        state.isLoading = true;
        if(chatSubmit) chatSubmit.disabled = true;

        await addMessage("assistant", "...");

        try {
            const response = await getChatbotResponse(message);
            removeLoadingIndicator();

            if (response.status === 429) {
                await addMessage("assistant", "Se ha alcanzado el límite diario de consultas. Vuelve mañana 🙏");
            } else if (!response.ok) {
                throw new Error("Server error");
            } else {
                const data = await response.json();
                await addMessage("assistant", data.content);
            }
        } catch (error) {
            console.error("Chat error:", error);
            removeLoadingIndicator();
            await addMessage("assistant", "Ha ocurrido un error. Inténtalo de nuevo.");
        } finally {
            state.isLoading = false;
            if(chatSubmit) chatSubmit.disabled = false;
            const chatMessages = document.getElementById("chat-messages");
            chatMessages?.scrollTo({
                top: chatMessages.scrollHeight,
                behavior: "smooth",
            });
        }
    });
});
