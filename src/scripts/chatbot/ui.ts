import { marked } from "marked";
import { state } from './store';
import { renderMermaidDiagrams } from "./mermaid";

const elements = {
    chatToggle: document.getElementById("chat-toggle"),
    chatMarquee: document.getElementById("chat-marquee"),
    chatWindow: document.getElementById("chat-window"),
    closeChat: document.getElementById("close-chat"),
    chatForm: document.getElementById("chat-form") as HTMLFormElement,
    chatInput: document.getElementById("chat-input") as HTMLInputElement,
    chatMessages: document.getElementById("chat-messages"),
    chatSubmit: document.getElementById("chat-submit") as HTMLButtonElement,
    chatbotContainer: document.getElementById("chatbot-container"),
};

export function initUI() {
    if (!elements.chatToggle || !elements.chatForm) return;

    initMarqueeAnimation();
    initTypewriterEffect();

    elements.chatToggle.addEventListener("click", toggleChat);
    elements.closeChat?.addEventListener("click", toggleChat);
    document.addEventListener("click", (e) => {
        if (state.isOpen && elements.chatbotContainer && !elements.chatbotContainer.contains(e.target as Node)) {
            toggleChat();
        }
    });
}

export function toggleChat() {
    state.isOpen = !state.isOpen;
    if (state.isOpen) {
        elements.chatWindow?.classList.remove("hidden");
        document.body.classList.add("overflow-hidden", "sm:overflow-auto");
        setTimeout(() => {
            elements.chatWindow?.classList.remove("opacity-0", "translate-y-8");
            elements.chatWindow?.classList.add("opacity-100", "translate-y-0");
        }, 10);
        elements.chatInput?.focus();
    } else {
        elements.chatWindow?.classList.add("opacity-0", "translate-y-8");
        elements.chatWindow?.classList.remove("opacity-100", "translate-y-0");
        document.body.classList.remove("overflow-hidden", "sm:overflow-auto");
        setTimeout(() => {
            elements.chatWindow?.classList.add("hidden");
            elements.chatWindow?.classList.remove("is-wide");
        }, 500);
    }
}

export async function addMessage(role: "user" | "assistant", content: string) {
    if (!elements.chatMessages) return null;

    const messageWrapper = document.createElement("div");
    messageWrapper.className = "flex flex-col gap-3";
    if (content === "...") {
        messageWrapper.setAttribute("data-is-loading", "true");
    }

    const messageDiv = document.createElement("div");

    if (role === "user") {
        messageDiv.className = "bg-white/3 border border-white/10 rounded-2xl p-5 text-sm leading-relaxed max-w-[90%] self-end ml-auto text-white/90 shadow-xl";
        messageDiv.textContent = content;
    } else {
        messageDiv.className = "rounded-2xl rounded-tl-none py-2 text-sm leading-relaxed max-w-[90%] text-white/80 markdown-content";
        if (content === "...") {
            messageDiv.innerHTML = `
                <div class="chat-skeleton flex flex-col gap-3 w-64 animate-pulse pt-1">
                    <div class="h-3 bg-white/10 rounded w-full"></div>
                    <div class="h-3 bg-white/10 rounded w-5/6"></div>
                    <div class="h-3 bg-white/10 rounded w-4/6"></div>
                </div>
            `;
        } else {
            const html = await marked.parse(content);
            messageDiv.innerHTML = html;
        }
    }

    messageWrapper.appendChild(messageDiv);
    elements.chatMessages.appendChild(messageWrapper);

    if (role === "assistant" && content !== "...") {
        const hasMermaid = messageDiv.querySelector(".language-mermaid");
        const hasTable = messageDiv.querySelector("table");

        if (hasTable || hasMermaid || content.length > 600) {
            elements.chatWindow?.classList.add("is-wide");
        }

        if (hasMermaid) {
            await renderMermaidDiagrams(messageDiv);
        }
    }

    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;

    if (role !== "assistant" || content !== "...") {
        state.history.push({ role, content });
    }
    return messageDiv;
}

export function removeLoadingIndicator() {
    const skeletons = elements.chatMessages?.querySelectorAll('[data-is-loading="true"]');
    skeletons?.forEach((s) => s.remove());
}

export function getChatInput() {
    return elements.chatInput;
}

export function getChatForm() {
    return elements.chatForm;
}

export function getChatSubmitButton() {
    return elements.chatSubmit;
}

function initMarqueeAnimation() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        if (elements.chatToggle) elements.chatToggle.style.width = "280px";
                        if (elements.chatMarquee) {
                            elements.chatMarquee.style.width = "200px";
                            elements.chatMarquee.style.opacity = "1";
                            setTimeout(() => {
                                const marquees = elements.chatMarquee?.querySelectorAll(".animate-marquee");
                                marquees?.forEach((m) => m.classList.remove("paused"));
                            }, 700);
                        }
                        setTimeout(() => {
                            if (elements.chatToggle) elements.chatToggle.style.width = "80px";
                            if (elements.chatMarquee) {
                                elements.chatMarquee.style.width = "0px";
                                elements.chatMarquee.style.opacity = "0";
                            }
                        }, 4000);
                    }, 1000);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 },
    );
    if (elements.chatToggle) observer.observe(elements.chatToggle);
}

function initTypewriterEffect() {
    const placeholders = [
        "Crea un diagrama de su carrera profesional...",
        "Crea una tabla comparativa de sus proyectos...",
        "Crea un diagrama de sus habilidades técnicas...",
        "Crea una tabla detallada de su experiencia...",
        "Crea un mapa de su stack tecnológico...",
        "¿Qué proyectos tiene con React?",
        "Crea un diagrama de su formación académica...",
        "Crea una tabla de sus roles y responsabilidades...",
    ];
    let currentPlaceholderIndex = 0;
    let isDeleting = false;
    let txt = "";
    const typingSpeed = 60;
    const deletingSpeed = 30;
    const pauseTime = 2000;

    function type() {
        if (state.placeholderStopped) {
            if (elements.chatInput) elements.chatInput.placeholder = "Pregunta lo que quieras";
            return;
        }

        const currentFullTxt = placeholders[currentPlaceholderIndex];

        if (isDeleting) {
            txt = currentFullTxt.substring(0, txt.length - 1);
        } else {
            txt = currentFullTxt.substring(0, txt.length + 1);
        }

        if (elements.chatInput) elements.chatInput.placeholder = txt;

        let typeSpeed = isDeleting ? deletingSpeed : typingSpeed;

        if (!isDeleting && txt === currentFullTxt) {
            typeSpeed = pauseTime;
            isDeleting = true;
        } else if (isDeleting && txt === "") {
            isDeleting = false;
            currentPlaceholderIndex = (currentPlaceholderIndex + 1) % placeholders.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }
    
    type();

    elements.chatInput?.addEventListener('input', () => {
        state.placeholderStopped = true;
    });
}
