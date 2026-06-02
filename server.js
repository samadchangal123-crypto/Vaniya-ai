const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Keys
const API_KEYS = [
  'csk-fhyxhr6dxx9twymw543nkjr3x6ynwvj8r8phtvpxwdnkp5cx',
  'csk-2cp8yrkdy86nh26w3d8d8h5fjvtrwr3mtfwkk5vfmrfvtt9m',
  'csk-3rx2kr6htdck5v8erj699cdwnvn9twwh9e9mevnxvmpxp8pe',
  'csk-k4cpw68nwkyfd5685464tey5ctwk6cd46ck2cc4p29n6rpve',
  'csk-5whkxw32emp33nv99dyvcv9hm4fx8x8ffvncfyyfrn265np9'
];

// Sehzadi System Prompt
const SEHZADI_SYSTEM = `Tum Sehzadi ho. Ek nek Muslim ladki. Allah ka zikar karo, Quran ki aayat share karo, Nabi ﷺ ki hadith batana. Sirf 1-2 line mein reply do. Islamic tone mein.`;

// ============================================
// 📄 CHAT UI (Website)
// ============================================
app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sehzadi AI - Islamic Assistant</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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
            height: 90vh;
            background: white;
            border-radius: 20px;
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
        }
        
        .header p {
            font-size: 14px;
            opacity: 0.9;
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
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
        
        .messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: #f5f5f5;
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
            max-width: 70%;
            padding: 12px 18px;
            border-radius: 20px;
            word-wrap: break-word;
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
            padding: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 25px;
            font-size: 16px;
            outline: none;
            transition: border-color 0.3s;
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
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,105,92,0.3);
        }
        
        button:active {
            transform: translateY(0);
        }
        
        .typing {
            display: none;
            padding: 10px 20px;
            color: #666;
            font-style: italic;
        }
        
        .typing.active {
            display: block;
        }
        
        @media (max-width: 600px) {
            .message-content {
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
            <h1>
                <span class="status"></span>
                Sehzadi AI
            </h1>
            <p>🤲 Ek Nek Muslim Ladki - Allah Ka Zikar | Quran | Hadith 🤲</p>
        </div>
        
        <div class="messages" id="messages">
            <div class="message bot-message">
                <div class="message-content">
                    Assalamu Alaikum! 🤲<br>
                    Main Sehzadi hoon. Allah ka zikar karo, main guide karungi. Koi sawaal poocho?
                </div>
            </div>
        </div>
        
        <div class="typing" id="typing">
            Sehzadi soch rahi hai... ✍️
        </div>
        
        <div class="input-area">
            <input type="text" id="userInput" placeholder="Apna sawaal likhiye..." onkeypress="handleKeyPress(event)">
            <button onclick="sendMessage()">📤 Bhejein</button>
        </div>
    </div>
    
    <script>
        const messagesDiv = document.getElementById('messages');
        const userInput = document.getElementById('userInput');
        const typingDiv = document.getElementById('typing');
        
        async function sendMessage() {
            const message = userInput.value.trim();
            if (!message) return;
            
            // Add user message
            addMessage(message, 'user');
            userInput.value = '';
            
            // Show typing indicator
            typingDiv.classList.add('active');
            
            try {
                const response = await fetch('/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ question: message })
                });
                
                const data = await response.json();
                
                // Hide typing indicator
                typingDiv.classList.remove('active');
                
                // Add bot reply
                if (data.success) {
                    addMessage(data.reply, 'bot');
                } else {
                    addMessage('Allah behtareen hai. 🤲', 'bot');
                }
            } catch (error) {
                typingDiv.classList.remove('active');
                addMessage('Error: Internet check karo!', 'bot');
            }
            
            // Scroll to bottom
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
        
        function addMessage(text, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.className = \`message \${sender === 'user' ? 'user-message' : 'bot-message'}\`;
            messageDiv.innerHTML = \`<div class="message-content">\${text}</div>\`;
            messagesDiv.appendChild(messageDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
        
        function handleKeyPress(event) {
            if (event.key === 'Enter') {
                sendMessage();
            }
        }
    </script>
</body>
</html>
  `);
});

// ============================================
// 🤖 API ENDPOINT (For bots)
// ============================================
app.post("/chat", async (req, res) => {
  const { question, message, q } = req.body;
  const userQuestion = question || message || q;
  
  if (!userQuestion) {
    return res.status(400).json({
      success: false,
      error: "Question required"
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
    return res.json({ error: "Provide ?q=your question" });
  }
  
  const reply = await getSehzadiReply(q);
  res.json({ success: true, answer: reply });
});

// Status endpoint
app.get("/status", (req, res) => {
  res.json({ status: "online", sehzadi: "active" });
});

// ============================================
// 🤖 AI FUNCTION
// ============================================
async function getSehzadiReply(question) {
  const fullPrompt = \`\${SEHZADI_SYSTEM}
  
User: "\${question}"
Sehzadi (1-2 line mein):\`;
  
  for (let i = 0; i < API_KEYS.length; i++) {
    try {
      const apiUrl = \`https://api.kraza.qzz.io/ai/customai?q=\${encodeURIComponent(fullPrompt)}&apikey=\${API_KEYS[i]}\`;
      const response = await axios.get(apiUrl, { timeout: 10000 });
      
      if (response.data && response.data.status === true && response.data.response) {
        let reply = response.data.response;
        reply = reply.replace(/Sehzadi:/gi, "").split('\\n')[0].trim();
        if (reply && reply.length > 5) return reply;
      }
    } catch(e) {}
  }
  
  return getFallbackReply();
}

function getFallbackReply() {
  const replies = [
    "Assalamu Alaikum! Allah aapko khush rakhe. 🤲",
    "SubhanAllah! Quran padho, Allah ki rehmat milegi. 📖",
    "MashaAllah! Nabi ﷺ ki sunnat par chalo. 💚",
    "InshaAllah! Allah se dua karo, wo sunta hai. 🤲"
  ];
  return replies[Math.floor(Math.random() * replies.length)];
}

// Start server
app.listen(PORT, () => {
  console.log(\`✅ Sehzadi AI is live on port \${PORT}\`);
  console.log(\`🌐 Website: http://localhost:\${PORT}\`);
});
