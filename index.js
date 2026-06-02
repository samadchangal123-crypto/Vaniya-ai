const Groq = require('groq-sdk');
const readline = require('readline');
require('dotenv').config();

// 1. Check karna ki .env file me API key dali hai ya nahi
if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY.includes("your_actual_api_key")) {
    console.error("❌ ERROR: Apni .env file me sahi Groq API Key dalein!");
    process.exit(1);
}

// 2. Groq client ko initialize karna
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// 3. Terminal se baat karne ke liye interface banana
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("=========================================");
console.log("🌸 Vaniya AI Chatbot Active Ho Gaya Hai! 🌸");
console.log("=========================================");
console.log("(Exit karne ke liye 'bye' ya 'exit' likhein)\n");

// 4. Main function jo AI se jawab lekar aayega
async function askVaniya(userMessage) {
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "Aapka naam Vaniya hai. Aap ek bohot hi polite, friendly aur smart female AI assistant hain. Aap user se dosti ke saath, hamesha Hindi ya Hinglish mein hi baat karti hain. Jawab ko short, sweet aur natural rakhein, bilkul robotic mat lagne dein."
                },
                {
                    role: "user",
                    content: userMessage
                }
            ],
            model: "llama3-8b-8192", // Fast aur free open-source model
            temperature: 0.7
        });

        return chatCompletion.choices[0]?.message?.content || "Main samajh nahi payi, kya aap dobara bolenge?";
    } catch (error) {
        return `❌ Error: ${error.message}`;
    }
}

// 5. Chat loop function jo chalta rahega
function startChat() {
    rl.question('Aap: ', async (userInput) => {
        // Agar user band karna chahe
        if (userInput.toLowerCase() === 'exit' || userInput.toLowerCase() === 'bye') {
            console.log('\nVaniya: Bye-bye! Apna khayal rakhna. 😊');
            rl.close();
            return;
        }

        if (!userInput.trim()) {
            startChat();
            return;
        }

        console.log('Vaniya soch rahi hai...');
        const response = await askVaniya(userInput);
        
        console.log(`\nVaniya: ${response}\n-----------------------------------------`);
        startChat(); // Loop ko dubara chalayein agle sawal ke liye
    });
}

// Chat shuru karein
startChat();
