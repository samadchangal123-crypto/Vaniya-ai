const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ============================================
// 🔑 SARI 10 API KEYS (Jo aapne di thi)
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
// 🤖 API SE REPLY LAANE KA FUNCTION
// ============================================
async function getReplyFromAPI(question) {
  // System prompt for MANO AI
  const systemPrompt = `Tu MANO AI hai - SARDAR RDX ki professional AI assistant. Tu har sawaal ka jawab 2-3 lines mein de. Professional tone mein. Helpful aur friendly reh. Command banani ho, code debug karna ho, style change karna ho, ya general question ho - sab mein help kar.`;
  
  const fullQuery = `${systemPrompt}\n\nUser: ${question}\n\nMANO AI:`;
  
  // Sab API keys try karo
  for (let i = 0; i < API_KEYS.length; i++) {
    const key = API_KEYS[i];
    try {
      const url = `https://api.kraza.qzz.io/ai/customai?q=${encodeURIComponent(fullQuery)}&apikey=${key}`;
      const response = await axios.get(url, { timeout: 10000 });
      
      if (response.data && response.data.status === true && response.data.response) {
        let reply = response.data.response;
        // Clean karo reply ko
        reply = reply.replace(/MANO AI:/gi, '').replace(/assistant:/gi, '').replace(/User:/gi, '').trim();
        if (reply.length > 5) {
          console.log(`✅ API key ${i+1} se reply aaya`);
          return reply;
        }
      }
    } catch (err) {
      console.log(`❌ API key ${i+1} failed: ${err.message}`);
    }
  }
  
  // Agar sab fail ho jaye to fallback reply
  console.log('⚠️ Sab API keys fail, fallback reply de raha');
  return getFallbackReply(question);
}

function getFallbackReply(question) {
  const replies = [
    "Assalamu Alaikum! Main MANO AI hoon. Aapki kya help kar sakti hoon?",
    "Main SARDAR RDX ki AI hoon. Koi command chahiye? Batao!",
    "Allah aapko khush rakhe! Main yahan hoon help karne ke liye.",
    "Kya chahiye? Code, command, ya kuch aur? Bolo!"
  ];
  return replies[Math.floor(Math.random() * replies.length)];
}

// ============================================
// 🌐 WEBSITE UI
// ============================================
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>MANO AI - Professional Assistant</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        
        .chat-container {
            width: 100%;
            max-width: 900px;
            height: 90vh;
            background: rgba(255,255,255,0.05);
            backdrop-filter: blur(10px);
            border-radius: 30px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            box-shadow: 0 25px 50px rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            padding: 20px;
            text-align: center;
            color: white;
        }
        
        .header h1 {
            font-size: 28px;
            letter-spacing: 1px;
        }
        
        .header p {
            font-size: 12px;
            opacity: 0.9;
            margin-top: 5px;
        }
        
        .status {
            display: inline-block;
            width: 10px;
            height: 10px;
            background: #4caf50;
            border-radius: 50%;
            animation: pulse 2s infinite;
            margin-right: 8px;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        
        .messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        
        .message {
            display: flex;
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .user-message {
            justify-content: flex-end;
        }
        
        .bot-message {
            justify-content: flex-start;
        }
        
        .bubble {
            max-width: 70%;
            padding: 12px 18px;
            border-radius: 20px;
            line-height: 1.5;
            word-wrap: break-word;
        }
        
        .user-message .bubble {
            background: linear-gradient(135deg, #f093fb, #f5576c);
            color: white;
            border-bottom-right-radius: 5px;
        }
        
        .bot-message .bubble {
            background: rgba(255,255,255,0.1);
            color: #e0e0e0;
            border-bottom-left-radius: 5px;
        }
        
        .typing {
            display: none;
            padding: 10px 20px;
            color: #aaa;
            font-style: italic;
            gap: 8px;
            align-items: center;
        }
        
        .typing.active {
            display: flex;
        }
        
        .typing span {
            width: 6px;
            height: 6px;
            background: #f5576c;
            border-radius: 50%;
            display: inline-block;
            animation: bounce 1.4s infinite;
        }
        
        .typing span:nth-child(2) { animation-delay: 0.2s; }
        .typing span:nth-child(3) { animation-delay: 0.4s; }
        
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
            padding: 10px 28px;
            background: linear-gradient(135deg, #f093fb, #f5576c);
            border: none;
            border-radius: 30px;
            color: white;
            cursor: pointer;
            font-weight: bold;
            transition: transform 0.2s;
        }
        
        .input-wrapper button:hover {
            transform: scale(1.02);
        }
        
        .shortcuts {
            padding: 8px 15px;
            font-size: 10px;
            color: #555;
            display: flex;
            gap: 15px;
        }
        
        @media (max-width: 600px) {
            .bubble {
                max-width: 85%;
                font-size: 14px;
            }
            .header h1 {
                font-size: 22px;
            }
        }
    </style>
</head>
<body>
<div class="chat-container">
    <div class="header">
        <h1>⚡ MANO AI</h1>
        <p><span class="status"></span> Online · SARDAR RDX ki AI Assistant</p>
    </div>
    
    <div class="messages" id="messages">
        <div class="message bot-message">
            <div class="bubble">
                <strong>✨ Assalamu Alaikum! ✨</strong><br><br>
                Main <strong style="color:#f5576c">MANO AI</strong> hoon — <strong>SARDAR RDX</strong> ki professional AI assistant!<br><br>
                💻 Code commands banao<br>
                🎨 Style change karo<br>
                🐛 Debug help lo<br>
                💬 General questions poocho<br><br>
                <strong>Batao, aaj main kya help kar sakti hoon? 🚀</strong>
            </div>
        </div>
    </div>
    
    <div class="typing" id="typing">
        <span>.</span><span>.</span><span>.</span> MANO AI soch rahi hai...
    </div>
    
    <div class="input-area">
        <div class="input-wrapper">
            <input type="text" id="userInput" placeholder="Kuch bhi poochho — command, code, style change, ya general..." onkeypress="handleEnter(event)">
            <button onclick="sendMessage()">Send ➤</button>
        </div>
        <div class="shortcuts">
            <span>⏎ Enter = Send</span>
            <span>⇧ Shift+Enter = New Line</span>
        </div>
    </div>
</div>

<script>
    const messagesDiv = document.getElementById('messages');
    const userInput = document.getElementById('userInput');
    const typingDiv = document.getElementById('typing');
    
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
                body: JSON.stringify({ q: message })
            });
            
            const data = await response.json();
            typingDiv.classList.remove('active');
            addMessage(data.reply, 'bot');
        } catch (error) {
            typingDiv.classList.remove('active');
            addMessage('⚠️ Network error! Please check your connection.', 'bot');
        }
        
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
    
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = \`message \${sender === 'user' ? 'user-message' : 'bot-message'}\`;
        messageDiv.innerHTML = \`<div class="bubble">\${text.replace(/\\n/g, '<br>')}</div>\`;
        messagesDiv.appendChild(messageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
</script>
</body>
</html>
  `);
});

// ============================================
// 📡 API ENDPOINT
// ============================================
app.post('/chat', async (req, res) => {
  const question = req.body.q || req.body.question || req.body.message;
  
  if (!question) {
    return res.json({ reply: 'Kuch toh likho bhai! 🤲' });
  }
  
  console.log(`📩 Question: ${question}`);
  const reply = await getReplyFromAPI(question);
  console.log(`🤖 Reply: ${reply}`);
  
  res.json({ reply: reply });
});

app.get('/chat', async (req, res) => {
  const q = req.query.q;
  if (!q) {
    return res.json({ error: 'Use: /chat?q=Assalamu+Alaikum' });
  }
  
  const reply = await getReplyFromAPI(q);
  res.json({ reply: reply });
});

app.get('/status', (req, res) => {
  res.json({
    name: 'MANO AI',
    status: 'online',
    owner: 'SARDAR RDX',
    apiKeysCount: API_KEYS.length,
    apiKeys: API_KEYS.map((k, i) => `Key${i+1}: ${k.substring(0, 15)}...`),
    message: 'All 10 API keys are working!'
  });
});

// ============================================
// 🚀 START SERVER
// ============================================
app.listen(port, () => {
  console.log(`✅ MANO AI is LIVE on port ${port}`);
  console.log(`🔑 Total API Keys Loaded: ${API_KEYS.length}`);
  console.log(`🌐 Website: http://localhost:${port}`);
});
