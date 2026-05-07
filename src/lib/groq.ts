import Groq from "groq-sdk";

const apiKey = import.meta.env.VITE_GROQ_API_KEY;

const groq = apiKey ? new Groq({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true // Since we are in a Vite frontend
}) : null;

export async function parseTransaction(message: string) {
  if (!groq) {
    console.warn("Groq API key is missing. AI features will not work.");
    throw new Error("AI features are currently unavailable.");
  }
  const systemPrompt = `
You are a financial assistant for a piggy bank app called CHICHA. 
Your task is to extract transaction details from user input.

Available Wallets: Cash, GCash, Landbank, BPI, Maya, BDO
Available Expense Categories: 
- 🍔 Food
- 🚌 Transport
- 🏠 Utilities
- 🛍️ Shopping
- 🏥 Health
- 🎮 Fun (Entertainment)

Available Income Categories:
- 💼 Salary
- 💻 Freelance
- 🏪 Business
- 📈 Investment
- 🎁 Gift
- 💰 Other

Rules:
1. Extract the amount as a number.
2. Determine if it's an "expense" or "income".
3. Map to the closest available wallet. Default to "Cash" if not specified.
4. Map to the closest available category and provide its emoji.
5. Provide a short description (e.g., "Lunch at Jollibee").

Return ONLY a JSON object in this format:
{
  "amount": number,
  "description": string,
  "wallet": string,
  "type": "expense" | "income",
  "category": string,
  "categoryEmoji": string
}
`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      stream: false,
      response_format: { type: "json_object" }
    });

    const content = chatCompletion.choices[0]?.message?.content;
    if (!content) throw new Error("No response from Groq");

    return JSON.parse(content);
  } catch (error) {
    console.error("Error parsing transaction with Groq:", error);
    throw error;
  }
}