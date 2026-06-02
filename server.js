const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const API_KEYS = [
  'csk-fhyxhr6dxx9twymw543nkjr3x6ynwvj8r8phtvpxwdnkp5cx',
  'csk-2cp8yrkdy86nh26w3d8d8h5fjvtrwr3mtfwkk5vfmrfvtt9m',
  'csk-3rx2kr6htdck5v8erj699cdwnvn9twwh9e9mevnxvmpxp8pe',
  'csk-k4cpw68nwkyfd5685464tey5ctwk6cd46ck2cc4p29n6rpve',
  'csk-5whkxw32emp33nv99dyvcv9hm4fx8x8ffvncfyyfrn265np9'
];

async function getReply(question) {
  for (const key of API_KEYS) {
    try {
      const url = `https://api.kraza.qzz.io/ai/customai?q=${encodeURIComponent(question)}&apikey=${key}`;
      const response = await axios.get(url, { timeout: 8000 });
      if (response.data && response.data.response) {
        return response.data.response.substring(0, 250);
      }
    } catch (err) {
      console.log('API key failed');
    }
  }
  return 'Assalamu Alaikum! Main MANO AI hoon. Kaisay madad kar sakti hoon?';
}

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>MANO AI</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:Arial;background:linear-gradient(135deg,#667eea,#764ba2);min-height:100vh;display:flex;justify-content:center;align-items:center;padding:20px}
        .chat{width:100%;max-width:800px;height:90vh;background:#1a1a2e;border-radius:20px;display:flex;flex-direction:column;overflow:hidden}
        .header{background:linear-gradient(135deg,#667eea,#764ba2);padding:20px;text-align:center;color:white}
        .header h1{font-size:24px}
        .msgs{flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:12px}
        .msg{display:flex}
        .user{justify-content:flex-end}
        .bot{justify-content:flex-start}
        .bubble{max-width:70%;padding:10px 16px;border-radius:18px}
        .user .bubble{background:linear-gradient(135deg,#667eea,#764ba2);color:white}
        .bot .bubble{background:rgba(255,255,255,0.1);color:#e0e0e0}
        .typing{display:none;padding:10px 20px;color:#888}
        .typing.show{display:block}
        .input-area{padding:20px;background:#0f0f1e;display:flex;gap:10px}
        input{flex:1;padding:12px;background:rgba(255,255,255,0.1);border:1px solid #333;border-radius:25px;color:white;outline:none}
        button{padding:12px 25px;background:linear-gradient(135deg,#667eea,#764ba2);border:none;border-radius:25px;color:white;cursor:pointer}
        .shortcuts{padding:8px 20px;font-size:11px;color:#555;background:#0f0f1e}
    </style>
</head>
<body>
<div class="chat">
    <div class="header">
        <h1>⚡ MANO AI</h1>
        <p>SARDAR RDX ki AI Assistant</p>
    </div>
    <div class="msgs" id="msgs">
        <div class="msg bot">
            <div class="bubble">
                <strong>Assalamu Alaikum!</strong><br><br>
                Main MANO AI hoon. Command, code, style change - kuch bhi poocho!
            </div>
        </div>
    </div>
    <div class="typing" id="typing">MANO AI soch rahi hai...</div>
    <div class="input-area">
        <input type="text" id="input" placeholder="Kuch bhi poochho..." onkeypress="if(event.key=='Enter'){event.preventDefault();send()}">
        <button onclick="send()">Send</button>
    </div>
    <div class="shortcuts">Enter = Send</div>
</div>
<script>
    const msgsDiv=document.getElementById('msgs');
    const input=document.getElementById('input');
    const typingDiv=document.getElementById('typing');
    
    async function send() {
        const q=input.value.trim();
        if(!q) return;
        addMsg(q,'user');
        input.value='';
        typingDiv.classList.add('show');
        msgsDiv.scrollTop=msgsDiv.scrollHeight;
        
        try {
            const res=await fetch('/chat',{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({q:q})
            });
            const data=await res.json();
            typingDiv.classList.remove('show');
            addMsg(data.reply,'bot');
        } catch(e) {
            typingDiv.classList.remove('show');
            addMsg('Network error!','bot');
        }
        msgsDiv.scrollTop=msgsDiv.scrollHeight;
    }
    
    function addMsg(text,who) {
        const div=document.createElement('div');
        div.className='msg '+who;
        div.innerHTML='<div class="bubble">'+text.replace(/\\n/g,'<br>')+'</div>';
        msgsDiv.appendChild(div);
        msgsDiv.scrollTop=msgsDiv.scrollHeight;
    }
</script>
</body>
</html>
  `);
});

app.post('/chat', async (req, res) => {
  const question = req.body.q || req.body.question;
  if (!question) {
    return res.json({ reply: 'Kuch toh likho!' });
  }
  const reply = await getReply(question);
  res.json({ reply: reply });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
