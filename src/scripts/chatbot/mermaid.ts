let mermaidLoaded = false;

export function loadMermaid() {
  if (mermaidLoaded) return Promise.resolve();
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js";
    script.onload = () => {
      mermaidLoaded = true;
      // @ts-ignore
      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        securityLevel: "loose",
        fontFamily: "JetBrains Mono",
      });
      resolve(true);
    };
    document.head.appendChild(script);
  });
}

export async function renderMermaidDiagrams(messageDiv: HTMLElement) {
    await loadMermaid();
    const mermaidBlocks = messageDiv.querySelectorAll(".language-mermaid");

    for (const [index, block] of Array.from(mermaidBlocks).entries()) {
        const pre = block.parentElement;
        if (pre) {
            const container = document.createElement("div");
            container.className = "mermaid-outer my-6 bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col items-center group cursor-zoom-in";

            const scrollContainer = document.createElement("div");
            scrollContainer.className = "w-full overflow-x-auto scrollbar-hide flex justify-center";

            const mermaidDiv = document.createElement("div");
            const uniqueId = `mermaid-${Date.now()}-${index}`;
            mermaidDiv.id = uniqueId;
            mermaidDiv.className = "mermaid min-w-full opacity-0 transition-opacity duration-500";

            const zoomHint = document.createElement("div");
            zoomHint.className = "text-[10px] text-white/20 mt-2 opacity-0 group-hover:opacity-100 transition-opacity";
            zoomHint.textContent = "Click para expandir";

            scrollContainer.appendChild(mermaidDiv);
            container.appendChild(scrollContainer);
            container.appendChild(zoomHint);
            pre.replaceWith(container);

            container.addEventListener("click", () => {
                const svg = mermaidDiv.querySelector("svg");
                if (!svg) return;

                const modal = document.createElement("div");
                modal.className = "fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-10 cursor-zoom-out";
                
                const closeBtn = document.createElement("button");
                closeBtn.innerHTML = "✕";
                closeBtn.className = "absolute top-6 right-6 text-white text-2xl hover:scale-110 transition-transform";

                const svgClone = svg.cloneNode(true) as SVGElement;
                svgClone.style.width = "auto";
                svgClone.style.height = "auto";
                svgClone.style.maxWidth = "90vw";
                svgClone.style.maxHeight = "80vh";
                svgClone.classList.add("drop-shadow-2xl");

                modal.appendChild(closeBtn);
                modal.appendChild(svgClone);
                document.body.appendChild(modal);

                modal.addEventListener("click", () => modal.remove());
            });

            let code = block.textContent || "";
            code = sanitizeMermaidCode(code);

            if (!code) {
                container.remove();
                continue;
            }

            mermaidDiv.textContent = code;

            try {
                // @ts-ignore
                await mermaid.run({ nodes: [mermaidDiv] });
                mermaidDiv.classList.add("opacity-100");
            } catch (err) {
                console.error("Mermaid render error:", err, "Code:", code);
                try {
                    const cleanCode = code.replace(/[^\x20-\x7E\n]/g, "");
                    mermaidDiv.textContent = cleanCode;
                    // @ts-ignore
                    await mermaid.run({ nodes: [mermaidDiv] });
                    mermaidDiv.classList.add("opacity-100");
                } catch (err2) {
                    container.innerHTML = `<div class="text-[10px] text-white/20 italic p-2 text-center">Diagrama técnico (error de sintaxis)</div>`;
                }
            }
        }
    }
}

function sanitizeMermaidCode(code: string): string {
    code = code
        .trim()
        .replace(/^```mermaid\s*/i, "")
        .replace(/```\s*$/i, "")
        .replace(/^(mermaid\s*)+/i, "")
        .trim();

    const validStarts = ["graph", "sequenceDiagram", "classDiagram", "stateDiagram", "erDiagram", "journey", "gantt", "pie", "quadrantChart", "mindmap", "timeline", "gitGraph", "C4Context"];
    const firstLine = code.split("\n")[0].trim();
    const hasValidStart = validStarts.some(start => firstLine.toLowerCase().startsWith(start.toLowerCase()));

    if (!hasValidStart && !firstLine.includes("{")) {
        const lines = code.split("\n");
        const startIndex = lines.findIndex(line => validStarts.some(start => line.trim().toLowerCase().startsWith(start.toLowerCase())));
        if (startIndex !== -1) {
            code = lines.slice(startIndex).join("\n").trim();
        } else {
            code = "graph TD\n" + code;
        }
    }

    if (code.length < 5) return "";

    const processedLines = code.split('\n').map(line => {
        const nodeRegex = /(\w+)(\[|\(|\{)(.*?)(\]|\)|\})/;
        const match = line.match(nodeRegex);

        if (match) {
            const id = match[1];
            const opening = match[2];
            let content = match[3];
            
            // Corrige el delimitador de cierre para que coincida con el de apertura
            const closingMap: { [key: string]: string } = { '[': ']', '(': ')', '{': '}' };
            const correctClosing = closingMap[opening];

            // Limpia el contenido: quita sintaxis de flechas, paréntesis y comillas dobles
            content = content.replace(/->|-->|==>|=>|-->>/g, ''); 
            content = content.replace(/[()"]/g, "'"); // Reemplaza caracteres problemáticos por comillas simples

            // Elimina comillas si están al principio y al final del contenido
            if (content.startsWith('"') && content.endsWith('"')) {
                content = content.substring(1, content.length - 1);
            }

            return `${id}${opening}"${content.trim()}"${correctClosing}`;
        }
        return line;
    });

    return processedLines.join('\n');
}
