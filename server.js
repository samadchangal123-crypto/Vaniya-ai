const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// 🔑 SARI API KEYS (10 keys)
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
// 💖 SEHZADI KA SYSTEM PROMPT
// ============================================
const SEHZADI_SYSTEM = `Tum Sehzadi ho. Ek nek Muslim ladki.
Tera kaam: Allah ka zikar karna, Quran ki aayat share karna, Nabi ﷺ ki hadith batana.
IMPORTANT: Sirf 1-2 line mein reply dena. Islamic tone mein. Bilkul natural AI jaisa.`;

// ============================================
// 🌐 CHAT WEBSITE UI
// ============================================
app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sehzadi AI - Islamic Chatbot</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
            background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        
        .chat-container {
            width: 100%;
            max-width: 900px;
            height: 95vh;
            background: #fef9e8;
            border-radius: 30px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #00695c, #004d40);
            color: white;
            padding: 20px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 28px;
            margin-bottom: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        
        .status-dot {
            display: inline-block;
            width: 12px;
            height: 12px;
            background: #4caf50;
            border-radius: 50%;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        
        .messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: #f5f5dc;
        }
        
        .message {
            margin-bottom: 15px;
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
        
        .message-content {
            max-width: 75%;
            padding: 12px 18px;
            border-radius: 20px;
            word-wrap: break-word;
            line-height: 1.4;
        }
        
        .user-message .message-content {
            background: linear-gradient(135deg, #00695c, #004d40);
            color: white;
            border-bottom-right-radius: 5px;
        }
        
        .bot-message .message-content {
            background: white;
            color: #333;
            border-bottom-left-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        
        .input-area {
            padding: 20px;
            background: white;
            border-top: 1px solid #e0e0e0;
            display: flex;
            gap: 10px;
        }
        
        input {
            flex: 1;
            padding: 12px 18px;
            border: 2px solid #e0e0e0;
            border-radius: 25px;
            font-size: 16px;
            outline: none;
            transition: all 0.3s;
        }
        
        input:focus {
            border-color: #00695c;
        }
        
        button {
            padding: 12px 30px;
            background: linear-gradient(135deg, #00695c, #004d40);
            color: white;
            border: none;
            border-radius: 25px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,105,92,0.3);
        }
        
        .typing-indicator {
            display: none;
            padding: 10px 20px;
            color: #666;
            font-style: italic;
            align-items: center;
            gap: 10px;
        }
        
        .typing-indicator.active {
            display: flex;
        }
        
        .dot-floating {
            display: flex;
            gap: 4px;
        }
        
        .dot-floating span {
            width: 8px;
            height: 8px;
            background: #00695c;
            border-radius: 50%;
            animation: float 1.4s infinite ease-in-out;
        }
        
        .dot-floating span:nth-child(1) { animation-delay: 0s; }
        .dot-floating span:nth-child(2) { animation-delay: 0.2s; }
        .dot-floating span:nth-child(3) { animation-delay: 0.4s; }
        
        @keyframes float {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-10px); }
        }
        
        @media (max-width: 600px) {
            .message-content {
                max-width: 85%;
                font-size: 14px;
            }
            .header h1 { font-size: 22px; }
        }
    </style>
</head>
<body>
    <div class="chat-container">
        <div class="header">
            <h1>
                <span class="status-dot"></span>
                Sehzadi AI
            </h1>
            <p>🤲 Ek Nek Muslim Ladki - Allah Ka Zikar | Quran | Hadith 🤲</p>
        </div>
        
        <div class="messages" id="messages">
            <div class="message bot-message">
                <div class="message-content">
                    Assalamu Alaikum! 🤲<br>
                    Main Sehzadi hoon. Allah ka zikar karo, main guide karungi. Koi bhi Islamic sawaal poocho?
                </div>
            </div>
        </div>
        
        <div class="typing-indicator" id="typingIndicator">
            <span>Sehzadi soch rahi hai</span>
            <div class="dot-floating">
                <span>.</span><span>.</span><span>.</span>
            </div>
        </div>
        
        <div class="input-area">
            <input type="text" id="userInput" placeholder="Apna sawaal likhiye..." onkeypress="handleEnter(event)">
            <button onclick="sendMessage()">📤 Bhejein</button>
        </div>
    </div>
    
    <script>
        const messagesDiv = document.getElementById('messages');
        const userInput = document.getElementById('userInput');
        const typingIndicator = document.getElementById('typingIndicator');
        
        function handleEnter(event) {
            if (event.key === 'Enter') {
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
                    addMessage('Allah behtareen hai. 🤲', 'bot');
                }
            } catch (error) {
                typingIndicator.classList.remove('active');
                addMessage('⚠️ Internet check karo!', 'bot');
            }
            
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
        
        function addMessage(text, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.className = \`message \${sender === 'user' ? 'user-message' : 'bot-message'}\`;
            messageDiv.innerHTML = \`<div class="message-content">\${text}</div>\`;
            messagesDiv.appendChild(messageDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
    </script>
</body>
</html>`);
});

// ============================================
// 📡 API ENDPOINTS
// ============================================
app.post("/chat", async (req, res) => {
  const { question, message, q } = req.body;
  const userQuestion = question || message || q;
  
  if (!userQuestion) {
    return res.status(400).json({
      success: false,
      error: "Kuch toh likho!"
    });
  }
  
  try {
    const reply = await getSehzadiReply(userQuestion);
    res.json({
      success: true,
      reply: reply,
      from: "Sehzadi AI"
    });
  } catch (error) {
    res.json({
      success: false,
      reply: getFallbackReply()
    });
  }
});

app.get("/chat", async (req, res) => {
  const q = req.query.q;
  if (!q) {
    return res.json({ error: "Use: /chat?q=Assalamu+Alaikum" });
  }
  
  const reply = await getSehzadiReply(q);
  res.json({ success: true, answer: reply });
});

app.get("/status", (req, res) => {
  res.json({
    status: "online",
    sehzadi: "active",
    apiKeys: API_KEYS.length,
    timestamp: new Date().toISOString()
  });
});

// ============================================
// 🤖 AI REPLY FUNCTION
// ============================================
async function getSehzadiReply(question) {
  const fullPrompt = `${SEHZADI_SYSTEM}
  
User ne kaha: "${question}"

Sehzadi ka 1-2 line mein Islamic jawab:`;
  
  // Try all API keys
  for (let i = 0; i < API_KEYS.length; i++) {
    const apiKey = API_KEYS[i];
    if (!apiKey) continue;
    
    try {
      const apiUrl = `https://api.kraza.qzz.io/ai/customai?q=${encodeURIComponent(fullPrompt)}&apikey=${apiKey}`;
      
      const response = await axios.get(apiUrl, { 
        timeout: 10000,
        headers: { 'Accept': 'application/json' }
      });
      
      if (response.data && response.data.status === true && response.data.response) {
        let reply = response.data.response;
        reply = reply
          .replace(/Sehzadi:/gi, "")
          .replace(/sehzadi:/gi, "")
          .replace(/Aliya:/gi, "")
          .split('\n')[0]
          .trim();
        
        if (reply && reply.length > 5 && reply.length < 300) {
          return reply;
        }
      }
    } catch (error) {
      console.log(`❌ API key ${i+1} failed: ${error.message}`);
    }
  }
  
  return getFallbackReply();
}

function getFallbackReply() {
  const replies = [
    "Assalamu Alaikum! Allah aapko khush rakhe. 🤲",
    "SubhanAllah! Allah humein hidayat de. 🤲",
    "Alhamdulillah! Quran padho, Allah ki rehmat milegi. 📖",
    "MashaAllah! Nabi ﷺ ki sunnat par chalo. 💚",
    "InshaAllah! Allah se dua karo, wo sunta hai. 🤲",
    "Astaghfirullah! Allah maaf karne wala hai. 💚",
    "Jannat ki fikr karo, dunya fani hai. 🌸",
    "Allah ka zikar kro, dil sukoon paega. 💙",
    "Namaz ka waqt ho gaya, Allah ko yaad kro. 🕌",
    "Dua karo, Allah behtareen plan banata hai. 🤲"
  ];
  return replies[Math.floor(Math.random() * replies.length)];
}

// ============================================
// 🚀 START SERVER
// ============================================
app.listen(PORT, () => {
  console.log(`✅ Sehzadi AI is live!`);
  console.log(`🌐 Website: http://localhost:${PORT}`);
  console.log(`🔑 Total API keys: ${API_KEYS.length}`);
});
EOF

# Restart the server
pkill node
node server.js &2
