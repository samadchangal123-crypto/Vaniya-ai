const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// 🔑 SARI API KEYS
// ============================================
const API_KEYS = [
  'csk-fhyxhr6dxx9twymw543nkjr3x6ynwvj8r8phtvpxwdnkp5cx',
  'csk-2cp8yrkdy86nh26w3d8d8h5fjvtrwr3mtfwkk5vfmrfvtt9m',
  'csk-3rx2kr6htdck5v8erj699cdwnvn9twwh9e9mevnxvmpxp8pe',
  'csk-k4cpw68nwkyfd5685464tey5ctwk6cd46ck2cc4p29n6rpve',
  'csk-5whkxw32emp33nv99dyvcv9hm4fx8x8ffvncfyyfrn265np9',
  'csk-k3rpw3xh225hcxdpjc2edj3wynw4r9kf4c6xc63djmpxj8tf',
  'csk-wyn2fedyfwcfv4c992w4kf4rfrrf8x94ed58ndd2wnfd5d8w',
  'csk-rr6j59ym83y43fett5kmvyj8w58tjv3m4y24dep2h8fym2vk',
  'csk-ww669p9x34mcmr36nkpek32v6ywdpnpn682xhy56t3d3f3re',
  'csk-p5kjy6fnjpp58jfmmtp464wfejpk8rynpfn64hwpnmv9ew6f'
];

// ============================================
// 👸 AI PERSONALITY (MANO AI Style)
// ============================================
const AI_SYSTEM = `Tu MANO AI hai - SARDAR RDX ki professional AI assistant.
Tera kaam:
- Code commands banana
- Style change karna
- Code debug karna
- General questions answer karna

Rules:
- Sirf 2-3 lines mein reply de
- Professional tone mein
- Helpful aur friendly
- Code blocks use kar sakti hai

Examples:
User: "command banao" → "Ye lo aapka command: !play [song name]"
User: "style change" → "Style updated! Konsa color chahiye?"
User: "debug" → "Error line 15 mein hai, ye fix karo:"`;

// ============================================
// 🌐 PROFESSIONAL WEBSITE UI
// ============================================
app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MANO AI - Professional Assistant</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', 'Poppins', system-ui, -apple-system, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        
        .app-container {
            width: 100%;
            max-width: 1200px;
            height: 95vh;
            background: #0f0f1e;
            border-radius: 20px;
            box-shadow: 0 25px 50px rgba(0,0,0,0.3);
            display: flex;
            overflow: hidden;
            backdrop-filter: blur(10px);
        }
        
        /* Sidebar */
        .sidebar {
            width: 280px;
            background: rgba(30, 30, 46, 0.95);
            backdrop-filter: blur(10px);
            border-right: 1px solid rgba(255,255,255,0.1);
            padding: 20px;
            display: flex;
            flex-direction: column;
        }
        
        .logo {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .logo h2 {
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            font-size: 28px;
        }
        
        .status {
            display: flex;
            align-items: center;
            gap: 8px;
            justify-content: center;
            margin-top: 5px;
            color: #4caf50;
            font-size: 12px;
        }
        
        .status-dot {
            width: 8px;
            height: 8px;
            background: #4caf50;
            border-radius: 50%;
            animation: pulse 2s infinite;
        }
        
        .features {
            flex: 1;
            margin-top: 30px;
        }
        
        .feature-item {
            padding: 12px;
            margin: 8px 0;
            background: rgba(255,255,255,0.05);
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s;
            color: #ccc;
        }
        
        .feature-item:hover {
            background: rgba(102,126,234,0.3);
            transform: translateX(5px);
        }
        
        .feature-item.active {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
        }
        
        .owner-info {
            margin-top: auto;
            padding-top: 20px;
            border-top: 1px solid rgba(255,255,255,0.1);
            font-size: 12px;
            color: #888;
            text-align: center;
        }
        
        /* Main Chat Area */
        .main-chat {
            flex: 1;
            display: flex;
            flex-direction: column;
            background: #1a1a2e;
        }
        
        .chat-header {
            padding: 20px;
            background: rgba(0,0,0,0.3);
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        
        .chat-header h3 {
            color: white;
            margin-bottom: 5px;
        }
        
        .chat-header p {
            color: #888;
            font-size: 12px;
        }
        
        .messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        
        .message {
            display: flex;
            animation: slideIn 0.3s ease;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .user-message {
            justify-content: flex-end;
        }
        
        .bot-message {
            justify-content: flex-start;
        }
        
        .message-content {
            max-width: 70%;
            padding: 12px 18px;
            border-radius: 18px;
            word-wrap: break-word;
            line-height: 1.5;
        }
        
        .user-message .message-content {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border-bottom-right-radius: 4px;
        }
        
        .bot-message .message-content {
            background: rgba(255,255,255,0.1);
            color: #e0e0e0;
            border-bottom-left-radius: 4px;
        }
        
        .message-content pre {
            background: #0f0f1e;
            padding: 10px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 8px 0;
        }
        
        .message-content code {
            font-family: 'Courier New', monospace;
        }
        
        .typing-indicator {
            display: none;
            padding: 10px 20px;
            gap: 10px;
            align-items: center;
            color: #888;
        }
        
        .typing-indicator.active {
            display: flex;
        }
        
        .typing-dots {
            display: flex;
            gap: 4px;
        }
        
        .typing-dots span {
            width: 6px;
            height: 6px;
            background: #667eea;
            border-radius: 50%;
            animation: bounce 1.4s infinite;
        }
        
        @keyframes bounce {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-8px); }
        }
        
        .input-area {
            padding: 20px;
            background: rgba(0,0,0,0.3);
            border-top: 1px solid rgba(255,255,255,0.1);
        }
        
        .input-wrapper {
            display: flex;
            gap: 10px;
            background: rgba(255,255,255,0.05);
            border-radius: 25px;
            padding: 5px;
        }
        
        .input-wrapper input {
            flex: 1;
            background: transparent;
            border: none;
            padding: 12px 18px;
            color: white;
            font-size: 14px;
            outline: none;
        }
        
        .input-wrapper input::placeholder {
            color: #666;
        }
        
        .input-wrapper button {
            padding: 8px 25px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border: none;
            border-radius: 25px;
            color: white;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .input-wrapper button:hover {
            transform: scale(1.05);
        }
        
        .shortcuts {
            display: flex;
            gap: 10px;
            margin-top: 10px;
            padding: 0 10px;
            font-size: 11px;
            color: #666;
        }
        
        @media (max-width: 768px) {
            .sidebar {
                display: none;
            }
            .message-content {
                max-width: 85%;
            }
        }
    </style>
</head>
<body>
    <div class="app-container">
        <!-- Sidebar -->
        <div class="sidebar">
            <div class="logo">
                <h2>⚡ MANO AI</h2>
                <div class="status">
                    <span class="status-dot"></span>
                    <span>Online · Female AI Assistant</span>
                </div>
            </div>
            
            <div class="features">
                <div class="feature-item" onclick="setPrompt('command')">
                    💻 Code Generator
                </div>
                <div class="feature-item" onclick="setPrompt('style')">
                    🎨 Style Changer
                </div>
                <div class="feature-item" onclick="setPrompt('debug')">
                    🐛 Debug Helper
                </div>
                <div class="feature-item" onclick="setPrompt('general')">
                    💬 General Assistant
                </div>
            </div>
            
            <div class="owner-info">
                <div>👑 Owner: SARDAR RDX</div>
                <div style="font-size: 10px; margin-top: 5px;">Version 2.0 | Powered by AI</div>
            </div>
        </div>
        
        <!-- Main Chat -->
        <div class="main-chat">
            <div class="chat-header">
                <h3>🤖 MANO AI Assistant</h3>
                <p>Your expert AI assistant for commands, code & everything!</p>
            </div>
            
            <div class="messages" id="messages">
                <div class="message bot-message">
                    <div class="message-content">
                        <strong>Assalamu Alaikum wa Rahmatullahi wa Barakatuh! 🌹</strong><br><br>
                        Main <strong>MANO AI</strong> hoon — <strong>SARDAR RDX</strong> ki taraf se aapki expert AI assistant! 🌟<br><br>
                        Aap mujhse kuch bhi pooch sakti/sakte hain — command banwana ho, style change karwani ho, code debug karna ho, ya koi bhi general sawal ho — main hamesha help karne ke liye yahan hoon! 🚀<br><br>
                        Batao, aaj main aapki kya madad kar sakti hoon? 🚀
                    </div>
                </div>
            </div>
            
            <div class="typing-indicator" id="typingIndicator">
                <span>MANO AI is thinking</span>
                <div class="typing-dots">
                    <span>.</span><span>.</span><span>.</span>
                </div>
            </div>
            
            <div class="input-area">
                <div class="input-wrapper">
                    <input type="text" id="userInput" placeholder="Kuch bhi poochho — command edit, style change, code..." onkeypress="handleEnter(event)">
                    <button onclick="sendMessage()">Send ➤</button>
                </div>
                <div class="shortcuts">
                    <span>⏎ Enter = Send</span>
                    <span>⇧ Shift+Enter = new line</span>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        const messagesDiv = document.getElementById('messages');
        const userInput = document.getElementById('userInput');
        const typingIndicator = document.getElementById('typingIndicator');
        
        function setPrompt(type) {
            const prompts = {
                command: "Mujhe ek Facebook bot command chahiye jo !play song naam se gaana chala sake",
                style: "Mere bot ka style change karna hai, dark theme with purple gradient",
                debug: "Mera code error de raha hai, help karo: console.log('hello'",
                general: "Mujhe ek AI assistant banana hai, guide karo"
            };
            userInput.value = prompts[type];
            sendMessage();
        }
        
        function handleEnter(event) {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
            }
        }
        
        async function sendMessage() {
            const message = userInput.value.trim();
            if (!message) return;
            
            addMessage(message, 'user');
            userInput.value = '';
            
            typingIndicator.classList.add('active');
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
            
            try {
                const response = await fetch('/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ question: message })
                });
                
                const data = await response.json();
                typingIndicator.classList.remove('active');
                
                if (data.success) {
                    addMessage(data.reply, 'bot');
                } else {
                    addMessage("Error! Please try again. 🚀", 'bot');
                }
            } catch (error) {
                typingIndicator.classList.remove('active');
                addMessage("Network error! Check your connection. 🔌", 'bot');
            }
            
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
        
        function addMessage(text, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${sender === 'user' ? 'user-message' : 'bot-message'}`;
            
            // Format code blocks if present
            let formattedText = text;
            if (text.includes('```')) {
                formattedText = text.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
            } else if (text.includes('`')) {
                formattedText = text.replace(/`([^`]+)`/g, '<code>$1</code>');
            }
            
            messageDiv.innerHTML = `<div class="message-content">${formattedText.replace(/\n/g, '<br>')}</div>`;
            messagesDiv.appendChild(messageDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
    </script>
</body>
</html>`);
});

// ============================================
// 📡 API ENDPOINT
// ============================================
app.post("/chat", async (req, res) => {
  const { question, message, q } = req.body;
  const userQuestion = question || message || q;
  
  if (!userQuestion) {
    return res.status(400).json({ success: false, error: "Kuch toh likho!" });
  }
  
  try {
    const reply = await getAIResponse(userQuestion);
    res.json({ success: true, reply: reply });
  } catch (error) {
    res.json({ success: false, reply: getFallbackReply() });
  }
});

app.get("/chat", async (req, res) => {
  const q = req.query.q;
  if (!q) return res.json({ error: "Use /chat?q=your question" });
  
  const reply = await getAIResponse(q);
  res.json({ success: true, answer: reply });
});

app.get("/status", (req, res) => {
  res.json({ status: "online", ai: "MANO AI", owner: "SARDAR RDX" });
});

// ============================================
// 🤖 AI FUNCTION
// ============================================
async function getAIResponse(question) {
  const fullPrompt = `${AI_SYSTEM}

User: "${question}"

MANO AI (2-3 lines mein professional reply):`;
  
  for (let i = 0; i < API_KEYS.length; i++) {
    try {
      const apiUrl = `https://api.kraza.qzz.io/ai/customai?q=${encodeURIComponent(fullPrompt)}&apikey=${API_KEYS[i]}`;
      const response = await axios.get(apiUrl, { timeout: 10000 });
      
      if (response.data && response.data.status === true && response.data.response) {
        let reply = response.data.response;
        reply = reply.replace(/MANO AI:/gi, "").replace(/assistant:/gi, "").split('\n')[0].trim();
        if (reply && reply.length > 5) return reply;
      }
    } catch(e) {}
  }
  
  return getFallbackReply();
}

function getFallbackReply() {
  const replies = [
    "Main MANO AI hoon! Aapki kya madad kar sakti hoon? 🚀",
    "Command chahiye? Batao kaunsa bot hai! 💻",
    "Style change karna hai? Colors batao! 🎨",
    "Code debug? Error screenshot bhejo! 🐛"
  ];
  return replies[Math.floor(Math.random() * replies.length)];
}

app.listen(PORT, () => {
  console.log(`✅ MANO AI is live on port ${PORT}`);
  console.log(`🌐 http://localhost:${PORT}`);
});
