
// Chat Widget Script
(function() {
    // --- SESSION ID PERSISTENCE ---
    function getSessionId() {
        let sessionId = localStorage.getItem("n8nChatSessionId");
        if (!sessionId) {
            sessionId = crypto.randomUUID();
            localStorage.setItem("n8nChatSessionId", sessionId);
        }
        return sessionId;
    }
    let currentSessionId = getSessionId();

    // --- STYLES ---
    const styles = `/* your CSS styles here (kept unchanged) */`;

    // Load Geist font
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://cdn.jsdelivr.net/npm/geist@1.0.0/dist/fonts/geist-sans/style.css';
    document.head.appendChild(fontLink);

    // Inject styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // --- DEFAULT CONFIG ---
    const defaultConfig = {
        webhook: { url: '', route: '' },
        branding: {
            logo: '',
            name: '',
            welcomeText: '',
            responseTimeText: '',
            poweredBy: {
                text: 'Powered by Gino',
                link: 'https://n8n.partnerlinks.io/m8a94i19zhqq?utm_source=nocodecreative.io'
            }
        },
        style: {
            primaryColor: '#854fff',
            secondaryColor: '#6b3fd4',
            position: 'right',
            backgroundColor: '#ffffff',
            fontColor: '#333333'
        }
    };

    // Merge user config
    const config = window.ChatWidgetConfig
        ? {
            webhook: { ...defaultConfig.webhook, ...window.ChatWidgetConfig.webhook },
            branding: { ...defaultConfig.branding, ...window.ChatWidgetConfig.branding },
            style: { ...defaultConfig.style, ...window.ChatWidgetConfig.style }
        }
        : defaultConfig;

    // Prevent multiple initializations
    if (window.N8NChatWidgetInitialized) return;
    window.N8NChatWidgetInitialized = true;

    // --- CREATE WIDGET DOM ---
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'n8n-chat-widget';

    // Apply theme colors
    widgetContainer.style.setProperty('--n8n-chat-primary-color', config.style.primaryColor);
    widgetContainer.style.setProperty('--n8n-chat-secondary-color', config.style.secondaryColor);
    widgetContainer.style.setProperty('--n8n-chat-background-color', config.style.backgroundColor);
    widgetContainer.style.setProperty('--n8n-chat-font-color', config.style.fontColor);

    const chatContainer = document.createElement('div');
    chatContainer.className = `chat-container${config.style.position === 'left' ? ' position-left' : ''}`;

    // New conversation screen
    const newConversationHTML = `
        <div class="brand-header">
            <img src="${config.branding.logo}" alt="${config.branding.name}">
            <span>${config.branding.name}</span>
            <button class="close-button">×</button>
        </div>
        <div class="new-conversation">
            <h2 class="welcome-text">${config.branding.welcomeText}</h2>
            <button class="new-chat-btn">Send us a message</button>
            <p class="response-text">${config.branding.responseTimeText}</p>
        </div>
    `;

    // Chat interface
    const chatInterfaceHTML = `
        <div class="chat-interface">
            <div class="brand-header">
                <img src="${config.branding.logo}" alt="${config.branding.name}">
                <span>${config.branding.name}</span>
                <button class="close-button">×</button>
            </div>
            <div class="chat-messages"></div>
            <div class="chat-input">
                <textarea placeholder="Type your message..." rows="1"></textarea>
                <button type="submit">Send</button>
            </div>
            <div class="chat-footer">
                <a href="${config.branding.poweredBy.link}" target="_blank">${config.branding.poweredBy.text}</a>
            </div>
        </div>
    `;

    chatContainer.innerHTML = newConversationHTML + chatInterfaceHTML;
    widgetContainer.appendChild(chatContainer);

    // Toggle button
    const toggleButton = document.createElement('button');
    toggleButton.className = `chat-toggle${config.style.position === 'left' ? ' position-left' : ''}`;
    toggleButton.innerHTML = `<svg ...></svg>`;
    widgetContainer.appendChild(toggleButton);

    document.body.appendChild(widgetContainer);

    // --- REFERENCES ---
    const newChatBtn = chatContainer.querySelector('.new-chat-btn');
    const chatInterface = chatContainer.querySelector('.chat-interface');
    const messagesContainer = chatContainer.querySelector('.chat-messages');
    const textarea = chatContainer.querySelector('textarea');
    const sendButton = chatContainer.querySelector('button[type="submit"]');

    // --- CHAT HISTORY ---
    function saveMessage(sender, text) {
        const history = JSON.parse(localStorage.getItem("n8nChatHistory") || "[]");
        history.push({ sender, text });
        localStorage.setItem("n8nChatHistory", JSON.stringify(history));
    }

    function loadMessages() {
        const saved = JSON.parse(localStorage.getItem("n8nChatHistory") || "[]");
        saved.forEach(m => {
            const div = document.createElement("div");
            div.className = `chat-message ${m.sender}`;
            div.textContent = m.text;
            messagesContainer.appendChild(div);
        });
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    loadMessages();

    // --- TYPING ANIMATION HELPERS ---
    function showTyping() { /* ... */ }
    function removeTyping() { /* ... */ }
    async function typeMessage(text, el, speed = 15) { /* ... */ }

    // --- SEND MESSAGE ---
    async function sendMessage(message) {
        const userDiv = document.createElement('div');
        userDiv.className = 'chat-message user';
        userDiv.textContent = message;
        messagesContainer.appendChild(userDiv);
        saveMessage("user", message);
        textarea.value = "";

        showTyping();

        try {
            const res = await fetch(config.webhook.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: "sendMessage", sessionId: currentSessionId, chatInput: message })
            });
            const data = await res.json();
            const botText = Array.isArray(data) ? data[0].output : data.output;

            removeTyping();
            const botDiv = document.createElement('div');
            botDiv.className = 'chat-message bot';
            messagesContainer.appendChild(botDiv);
            await typeMessage(botText, botDiv);
            saveMessage("bot", botText);
        } catch (err) {
            removeTyping();
            console.error("Error:", err);
        }
    }

    // --- EVENT LISTENERS ---
    newChatBtn.addEventListener('click', () => {
        chatContainer.querySelector('.new-conversation').style.display = 'none';
        chatInterface.classList.add('active');
    });

    sendButton.addEventListener('click', () => {
        if (textarea.value.trim()) sendMessage(textarea.value.trim());
    });

    textarea.addEventListener('keypress', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (textarea.value.trim()) sendMessage(textarea.value.trim());
        }
    });

    toggleButton.addEventListener('click', () => {
        chatContainer.classList.toggle('open');
    });

    chatContainer.querySelectorAll('.close-button').forEach(btn =>
        btn.addEventListener('click', () => chatContainer.classList.remove('open'))
    );

    // --- END CHAT BUTTON ---
    const endButton = document.createElement("button");
    endButton.textContent = "End Chat";
    chatContainer.querySelector('.brand-header').appendChild(endButton);
    endButton.addEventListener("click", () => {
        localStorage.removeItem("n8nChatSessionId");
        localStorage.removeItem("n8nChatHistory");
        messagesContainer.innerHTML = "";
        alert("Conversation ended. Next message will start fresh.");
        currentSessionId = getSessionId();
    });

})();
