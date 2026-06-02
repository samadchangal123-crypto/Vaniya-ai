const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ============================================
// 🔑 SAARI 10 API KEYS
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
// 🤖 AI RESPONSE FUNCTION
// ============================================
async function getAIResponse(question) {
  for (let i = 0; i < API_KEYS.length; i++) {
    try {
      const url = `https://api.kraza.qzz.io/ai/customai?q=${encodeURIComponent(question)}&apikey=${API_KEYS[i]}`;
      const response = await axios.get(url, { timeout: 10000 });
      
      if (response.data && response.data.status === true && response.data.response) {
        let reply = response.data.response;
        reply = reply.replace(/assistant:/gi, "").replace(/AI:/gi, "").trim();
        if (reply && reply.length > 5) {
          return reply;
        }
      }
    } catch(e) {
      console.log(`API key ${i+1} failed, trying next...`);
    }
  }
  return getFallbackReply();
}

function getFallbackReply() {
  const replies = [
    "Assalamu Alaikum! Main MANO AI hoon. Kaisay madad kar sakti hoon? 🤲",
    "Allah aapko khush rakhe! Koi sawaal poocho? 🌟",
    "Main yahan hoon aapki help ke liye! Batao kya chahiye? 💚",
    "SARDAR RDX ki AI hoon main! Koi command chahiye? 🚀"
  ];
  return replies[Math.floor(Math.random() * replies.length)];
}

// ============================================
// 🌐 WEBSITE UI
// ============================================
app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MANO AI - SARDAR RDX ki AI Assistant</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', 'Poppins', system-ui, sans-serif;
            background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        
        .app {
            width: 100%;
            max-width: 1000px;
            height: 95vh;
            background: rgba(255,255,255,0.05);
            backdrop-filter: blur(10px);
            border-radius: 30px;
            box-shadow: 0 25px 50px rgba(0,0,0,0.3);
            display: flex;
            overflow: hidden;
            border: 1px solid rgba(255,255,255,0.1);
        }
        
        /* Sidebar */
        .sidebar {
            width: 260px;
            background: rgba(0,0,0,0.4);
            padding: 20px;
            display: flex;
            flex-direction: column;
            border-right: 1px solid rgba(255,255,255,0.1);
        }
        
        .logo {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .logo h2 {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            font-size: 28px;
        }
        
        .status {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-top: 8px;
            font-size: 12px;
            color: #4caf50;
        }
        
        .dot {
            width: 8px;
            height: 8px;
            background: #4caf50;
            border-radius: 50%;
            animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
            0%,100% { opacity: 1; }
            50% { opacity: 0.3; }
        }
        
        .features {
            flex: 1;
            margin-top: 20px;
        }
        
        .feature {
            padding: 12px 15px;
            margin: 8px 0;
            background: rgba(255,255,255,0.05);
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s;
            color: #ccc;
            font-size: 14px;
        }
        
        .feature:hover {
            background: rgba(245,87,108,0.3);
            transform: translateX(5px);
            color: white;
        }
        
        .owner {
            margin-top: auto;
            padding-top: 20px;
            border-top: 1px solid rgba(255,255,255,0.1);
            text-align: center;
            font-size: 12px;
            color: #888;
        }
        
        /* Main Chat */
        .main {
            flex: 1;
            display: flex;
            flex-direction: column;
        }
        
        .chat-header {
            padding: 20px;
            background: rgba(0,0,0,0.3);
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        
        .chat-header h3 {
            color: white;
            font-size: 18px;
        }
        
        .chat-header p {
            color: #aaa;
            font-size: 12px;
            margin-top: 5px;
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
                transform: translateY(15px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .user-msg {
            justify-content: flex-end;
        }
        
        .bot-msg {
            justify-content: flex-start;
        }
        
        .bubble {
            max-width: 75%;
            padding: 12px 18px;
            border-radius: 20px;
            line-height: 1.5;
            word-wrap: break-word;
        }
        
        .user-msg .bubble {
            background: linear-gradient(135deg, #f093fb, #f5576c);
            color: white;
            border-bottom-right-radius: 5px;
        }
        
        .bot-msg .bubble {
            background: rgba(255,255,255,0.1);
            color: #e0e0e0;
            border-bottom-left-radius: 5px;
        }
        
        .typing-indicator {
            display: none;
            padding: 10px 20px;
            gap: 10px;
            align-items: center;
            color: #aaa;
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
            background: #f5576c;
            border-radius: 50%;
            animation: bounce 1.4s infinite;
        }
        
        @keyframes bounce {
            0%,60%,100% { transform: translateY(0); }
            30% { transform: translateY(-8px); }
        }
        
        .input-container {
            padding: 20px;
            background: rgba(0,0,0,0.3);
            border-top: 1px solid rgba(255,255,255,0.1);
        }
        
        .input-wrapper {
            display: flex;
            gap: 10px;
            background: rgba(255,255,255,0.05);
            border-radius: 30px;
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
            padding: 8px 28px;
            background: linear-gradient(135deg, #f093fb, #f5576c);
            border: none;
            border-radius: 30px;
            color: white;
            cursor: pointer;
            font-weight: bold;
            transition: transform 0.2s;
        }
        
        .input-wrapper button:hover {
            transform: scale(1.03);
        }
        
        .shortcuts {
            display: flex;
            gap: 15px;
            padding: 8px 12px;
            font-size: 10px;
            color: #555;
        }
        
        @media (max-width: 768px) {
            .sidebar {
                display: none;
            }
            .bubble {
                max-width: 85%;
            }
        }
    </style>
</head>
<body>
<div class="app">
    <div class="sidebar">
        <div class="logo">
            <h2>⚡ MANO AI</h2>
            <div class="status">
                <span class="dot"></span>
                <span>Online · Female AI</span>
            </div>
        </div>
        
        <div class="features">
            <div class="feature" onclick="setPrompt('code')">💻 Code Generator</div>
            <div class="feature" onclick="setPrompt('style')">🎨 Style Changer</div>
            <div class="feature" onclick="setPrompt('debug')">🐛 Debug Helper</div>
            <div class="feature" onclick="setPrompt('general')">💬 General Assistant</div>
            <div class="feature" onclick="setPrompt('command')">🤖 Bot Command</div>
        </div>
        
        <div class="owner">
            <div>👑 Owner: SARDAR RDX</div>
            <div style="font-size: 10px; margin-top: 5px;">Powered by 10x API</div>
        </div>
    </div>
    
    <div class="main">
        <div class="chat-header">
            <h3>🤖 MANO AI Assistant</h3>
            <p>Your personal AI for commands, code & everything!</p>
        </div>
        
        <div class="messages" id="messages">
            <div class="message bot-msg">
                <div class="bubble">
                    <strong>✨ Assalamu Alaikum! ✨</strong><br><br>
                    Main <strong style="color:#f5576c">MANO AI</strong> hoon — <strong>SARDAR RDX</strong> ki professional AI assistant! 🌟<br><br>
                    ✅ Code commands banao<br>
                    ✅ Style change karo<br>
                    ✅ Debug help lo<br>
                    ✅ Kuch bhi poocho<br><br>
                    <strong>Batao, aaj main kya help kar sakti hoon? 🚀</strong>
                </div>
            </div>
        </div>
        
        <div class="typing-indicator" id="typing">
            <span>MANO AI is thinking</span>
            <div class="typing-dots">
                <span>.</span><span>.</span><span>.</span>
            </div>
        </div>
        
        <div class="input-container">
            <div class="input-wrapper">
                <input type="text" id="userInput" placeholder="Kuch bhi poochho — command, code, style change..." onkeypress="handleEnter(event)">
                <button onclick="sendMessage()">Send ➤</button>
            </div>
            <div class="shortcuts">
                <span>⏎ Enter = Send</span>
                <span>⇧ Shift+Enter = New Line</span>
            </div>
        </div>
    </div>
</div>

<script>
    const messagesDiv = document.getElementById('messages');
    const userInput = document.getElementById('userInput');
    const typingDiv = document.getElementById('typing');
    
    function setPrompt(type) {
        const prompts = {
            code: "Mujhe ek Discord bot command chahiye jo !play song naam se gaana chalaye",
            style: "Mere bot ka theme change karna hai, dark mode with neon green color",
            debug: "Mera code error de raha: console.log('hello' — missing closing bracket",
            general: "AI assistant kaise banate hain? Simple guide do",
            command: "Facebook bot ke liye !help command banao"
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
        
        typingDiv.classList.add('active');
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        
        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: message })
            });
            
            const data = await response.json();
            typingDiv.classList.remove('active');
            addMessage(data.reply, 'bot');
        } catch (error) {
            typingDiv.classList.remove('active');
            addMessage("⚠️ Network error! Check your connection.", 'bot');
        }
        
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
    
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender === 'user' ? 'user-msg' : 'bot-msg'}`;
        messageDiv.innerHTML = `<div class="bubble">${text.replace(/\\n/g, '<br>')}</div>`;
        messagesDiv.appendChild(messageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
</script>
</body>
</html>
  `);
});

// ============================================
// 📡 API ENDPOINTS
// ============================================
app.post("/chat", async (req, res) => {
  const question = req.body.question || req.body.q || req.body.message;
  
  if (!question) {
    return res.json({ reply: "Kuch toh likho bhai! 🤲" });
  }
  
  const reply = await getAIResponse(question);
  res.json({ reply: reply });
});

app.get("/chat", async (req, res) => {
  const q = req.query.q;
  if (!q) {
    return res.json({ error: "Use: /chat?q=Assalamu+Alaikum" });
  }
  
  const reply = await getAIResponse(q);
  res.json({ reply: reply });
});

app.get("/status", (req, res) => {
  res.json({
    name: "MANO AI",
    status: "online",
    owner: "SARDAR RDX",
    apiKeys: API_KEYS.length,
    timestamp: new Date().toISOString()
  });
});

// ============================================
// 🚀 START SERVER
// ============================================
app.listen(PORT, () => {
  console.log(`✅ MANO AI is LIVE!`);
  console.log(`🔑 Total API Keys: ${API_KEYS.length}`);
  console.log(`🌐 Website: http://localhost:${PORT}`);
});
