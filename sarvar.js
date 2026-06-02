const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// 🔑 API KEYS (Seedha code mein - Private repo mein rakhna)
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

Tera kaam:
- Allah ka zikar karna
- Quran ki aayat share karna
- Nabi ﷺ ki hadith batana
- Nek rasta dikhana

IMPORTANT RULES:
⚠️ SIRF 1-2 LINE MEIN REPLY DENA
⚠️ BILKUL NATURAL AI JAISA REPLY
⚠️ USER KE MUTABIQ BAAT KARNA
⚠️ ISLAMIC TONE MEIN

Example:
User: "hello" → "Walaikum assalam! Allah ki rehmat ho aap par."
User: "bore ho raha hoon" → "Allah ko yaad karo. Zikr se dil sukoon milta hai."
User: "kya kar rahi ho" → "Quran ki tilawat kar rahi hoon. Allah humein hidayat de."`;

// ============================================
// 🎯 MAIN API ENDPOINTS
// ============================================
app.get("/", (req, res) => {
  res.json({
    name: "Sehzadi AI",
    status: "active",
    message: "Assalamu Alaikum! Main Sehzadi hoon - Ek nek Muslim ladki",
    endpoints: {
      chat: "/chat?q=your question",
      status: "/status"
    }
  });
});

// GET endpoint - Simple chat
app.get("/chat", async (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.json({
      success: false,
      message: "Please provide question. Example: /chat?q=Assalamu+Alaikum"
    });
  }
  
  try {
    const reply = await getSehzadiReply(q);
    
    res.json({
      success: true,
      question: q,
      answer: reply,
      from: "Sehzadi AI"
    });
  } catch (error) {
    console.error("Error:", error);
    res.json({
      success: false,
      answer: getFallbackReply(),
      error: error.message
    });
  }
});

// POST endpoint - For JSON requests
app.post("/chat", async (req, res) => {
  const { question, message, q } = req.body;
  const userQuestion = question || message || q;
  
  if (!userQuestion) {
    return res.status(400).json({
      success: false,
      error: "Question required in 'question' or 'message' field"
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
      reply: getFallbackReply(),
      error: error.message
    });
  }
});

// Status endpoint
app.get("/status", (req, res) => {
  res.json({
    status: "online",
    sehzadi: "active",
    apiKeysCount: API_KEYS.length,
    timestamp: new Date().toISOString()
  });
});

// ============================================
// 🤖 AI REPLY FUNCTION
// ============================================
async function getSehzadiReply(question) {
  const fullPrompt = `${SEHZADI_SYSTEM}

Ab user ne kaha: "${question}"

Sirf 1-2 line mein Islamic reply de:`;

  // Try all API keys one by one
  for (let i = 0; i < API_KEYS.length; i++) {
    const apiKey = API_KEYS[i];
    
    try {
      const apiUrl = `https://api.kraza.qzz.io/ai/customai?q=${encodeURIComponent(fullPrompt)}&systemPrompt=${encodeURIComponent("Tu Sehzadi hai. Sirf 1-2 line mein reply de. Islamic tone mein. Bilkul natural AI jaisa.")}&apikey=${apiKey}`;
      
      const response = await axios.get(apiUrl, { 
        timeout: 10000,
        headers: { 'Accept': 'application/json' }
      });
      
      if (response.data && response.data.status === true && response.data.response) {
        let reply = response.data.response;
        
        // Clean the reply
        reply = reply
          .replace(/Sehzadi:/gi, "")
          .replace(/sehzadi:/gi, "")
          .replace(/Aliya:/gi, "")
          .replace(/aliya:/gi, "")
          .replace(/system:/gi, "")
          .replace(/assistant:/gi, "")
          .replace(/user:/gi, "")
          .split('\n')[0]  // Sirf pehli line
          .trim();
        
        // Agar reply valid hai to return karo
        if (reply && reply.length > 5 && reply.length < 200) {
          return reply;
        }
      }
    } catch (error) {
      console.log(`❌ API key ${i+1} failed: ${error.message}`);
      // Continue to next key
    }
  }
  
  // Agar sab API keys fail ho jayein to fallback reply
  console.log("⚠️ All API keys failed, using fallback");
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
  console.log(`✅ Sehzadi AI is live on port ${PORT}`);
  console.log(`📱 Chat endpoint: http://localhost:${PORT}/chat?q=hello`);
  console.log(`🔑 Total API keys loaded: ${API_KEYS.length}`);
});
