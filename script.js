const API_URL = "const API_URL = "https://victoire-pisa-api.pratamaridho217.workers.dev/chat";
const STORAGE_KEY = "victoire-pisa-chat-v1";

const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");
const chatNote = document.querySelector(".chat-note");

const history = [];

function saveHistory() {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(history.slice(-40))
        );
    } catch (error) {
        console.warn("Riwayat tidak dapat disimpan:", error);
    }
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

function loadHistory() {
    try {
        const saved = JSON.parse(
            localStorage.getItem(STORAGE_KEY) || "[]"
        );

        if (!Array.isArray(saved)) return;

        saved.slice(-40).forEach((item) => {
            if (!item || typeof item.text !== "string") return;

            const isUser = item.role === "user";

            addMessage(
                isUser ? "Kamu" : "Victoire Pisa",
                item.text,
                isUser
            );

            history.push({
                role: item.role === "user" ? "user" : "model",
                text: item.text
            });
        });
    } catch (error) {
        console.warn("Riwayat chat tidak dapat dimuat:", error);
    }
}

function localGreeting(message) {
    const normalized = message
        .toLocaleLowerCase("id-ID")
        .trim()
        .replace(/[!.?,]+$/g, "");

    const greetings = [
        "hai",
        "halo",
        "hello",
        "hi",
        "hey",
        "pagi",
        "selamat pagi",
        "siang",
        "selamat siang",
        "sore",
        "selamat sore",
        "malam",
        "selamat malam",
        "tes",
        "test"
    ];

    if (!greetings.includes(normalized)) return null;

    return "Halo juga! 💜 Aku Victoire Pisa. Senang kamu datang! Gimana kabarmu hari ini? Untuk sekarang, aku bisa membalas sapaan sederhana saat koneksi AI sedang diperbaiki.";
}

function openChat() {
    const chatSection = document.getElementById("chat");

    if (chatSection) {
        chatSection.scrollIntoView({ behavior: "smooth" });
    }

    if (userInput) {
        setTimeout(() => userInput.focus(), 500);
    }
}

chatForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const message = userInput.value.trim();
    if (!message) return;

    addMessage("Kamu", message, true);

    history.push({
        role: "user",
        text: message
    });

    saveHistory();
    userInput.value = "";
    userInput.disabled = true;

    const button = chatForm.querySelector("button");

    if (button) button.disabled = true;

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
                history: history.slice(-12, -1)
            })
        });

        const data = await response.json();

        if (!response.ok || !data.reply) {
            throw new Error(
                data.detail ||
                data.error ||
                "Permintaan AI gagal."
            );
        }

        addMessage("Victoire Pisa", data.reply);

        history.push({
            role: "model",
            text: data.reply
        });

        const badge = document.querySelector(".demo-badge");

        if (badge) {
            badge.textContent = "AI CONNECTED";
        }

        if (chatNote) {
            chatNote.textContent = "Terhubung ke backend AI.";
        }
    } catch (error) {
        const fallback = localGreeting(message);

        if (fallback) {
            addMessage("Victoire Pisa", fallback);

            history.push({
                role: "model",
                text: fallback
            });

            const badge = document.querySelector(".demo-badge");

            if (badge) {
                badge.textContent = "LOCAL GREETING";
            }

            if (chatNote) {
                chatNote.textContent =
                    "Sapaan lokal aktif. Koneksi AI masih diperiksa.";
            }
        } else {
            addMessage(
                "Victoire Pisa",
                "Koneksi AI belum berhasil. Kita masih perlu memperbaiki sambungan server."
            );

            if (chatNote) {
                chatNote.textContent =
                    "Sapaan sederhana tersedia; koneksi AI belum tersambung.";
            }
        }
    } finally {
        if (history.length > 40) {
            history.splice(0, history.length - 40);
        }

        saveHistory();
        userInput.disabled = false;

        if (button) button.disabled = false;

        userInput.focus();
    }
});

loadHistory();
