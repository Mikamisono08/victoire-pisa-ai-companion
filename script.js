const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

function openChat() {
    document.getElementById("chat").scrollIntoView({
        behavior: "smooth"
    });

    setTimeout(() => {
        userInput.focus();
    }, 500);
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

    content.appendChild(sender);
    content.appendChild(text);

    wrapper.appendChild(avatar);
    wrapper.appendChild(content);

    chatWindow.appendChild(wrapper);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function getDemoReply(message) {
    const text = message.toLowerCase();

    if (
        text.includes("halo") ||
        text.includes("hai") ||
        text.includes("hello")
    ) {
        return "Halo juga! Senang kamu datang. Apa yang ingin kita lakukan hari ini?";
    }

    if (
        text.includes("nama") ||
        text.includes("siapa kamu")
    ) {
        return "Aku adalah antarmuka companion yang terinspirasi oleh Victoire Pisa. Versi ini masih berupa prototipe.";
    }

    if (
        text.includes("anime") ||
        text.includes("game")
    ) {
        return "Kita bisa mengembangkan proyek ini dengan tema anime dan game. Fitur AI sungguhan akan ditambahkan setelah backend disiapkan.";
    }

    if (
        text.includes("terima kasih") ||
        text.includes("makasih")
    ) {
        return "Sama-sama! Mari kita kembangkan proyek ini sedikit demi sedikit.";
    }

    return "Pesanmu sudah diterima! Saat ini aku masih menggunakan balasan demo. Setelah backend AI terhubung, percakapan bisa dibuat lebih cerdas.";
}

chatForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const message = userInput.value.trim();

    if (!message) {
        return;
    }

    addMessage("Kamu", message, true);

    userInput.value = "";
    userInput.focus();

    const reply = getDemoReply(message);

    setTimeout(() => {
        addMessage("Victoire Pisa", reply);
    }, 500);
});
