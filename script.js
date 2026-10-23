const API_URL = "https://victoire-pisa-api.pratamaridho217.workers.dev/chat";

const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");
const chatNote = document.querySelector(".chat-note");
const history = [];

function openChat() {
    document.getElementById("chat").scrollIntoView({
        behavior: "smooth"
    });
    setTimeout(() => userInput.focus(), 500);
}

function addMessage(name, message, isUser = false) {
    const wrapper = document.createElement("div");
    wrapper.className = isUser
        ? "message user-message"
        : "message companion-message";

    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    avatar.textContent = isUser ? "YOU" : "VP";

    const content = document.createElement("div");
    content.className = "message-content";

    const sender = document.createElement("strong");
    sender.textContent = name;

    const text = document.createElement("p");
    text.textContent = message;

    content.append(sender, text);
    wrapper.append(avatar, content);
    chatWindow.appendChild(wrapper);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

chatForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const message = userInput.value.trim();
    if (!message) return;

    addMessage("Kamu", message, true);

    userInput.value = "";
    userInput.disabled = true;

    const button = chatForm.querySelector("button");
    button.disabled = true;

    if (chatNote) {
        chatNote.textContent = "Victoire sedang berpikir...";
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message,
                history
            })
        });

        const data = await response.json();

        if (!response.ok || !data.reply) {
            throw new Error(
                data.detail || data.error || "Permintaan AI gagal."
            );
        }

        addMessage("Victoire Pisa", data.reply);

        history.push(
            { role: "user", text: message },
            { role: "model", text: data.reply }
        );

        if (history.length > 12) {
            history.splice(0, history.length - 12);
        }

        const badge = document.querySelector(".demo-badge");
        if (badge) badge.textContent = "AI CONNECTED";

        if (chatNote) {
            chatNote.textContent = "Terhubung ke backend AI.";
        }
    } catch (error) {
        addMessage(
            "Victoire Pisa",
            "Koneksi AI belum berhasil. " + error.message
        );

        if (chatNote) {
            chatNote.textContent =
                "Koneksi gagal. Periksa Worker dan secret Gemini.";
        }
    } finally {
        userInput.disabled = false;
        button.disabled = false;
        userInput.focus();
    }
});
