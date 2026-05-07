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

export async function getSpendingAdvice(transactions: any[]) {
  if (!groq) throw new Error("AI features are currently unavailable.");

  const summaryData = transactions.map(t => ({
    type: t.type,
    amount: t.amount,
    category: t.category,
    description: t.description
  }));

  const systemPrompt = `
You are a witty and helpful financial coach for a piggy bank app.
Analyze the user's recent transactions and provide:
1. A quick summary of their spending behavior.
2. 3 actionable tips to save more money.
3. A motivational "pig-themed" quote.

Keep the advice concise, encouraging, and easy to read. 
Use Markdown for formatting.
`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Here are my recent transactions: ${JSON.stringify(summaryData)}` }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
    });

    return chatCompletion.choices[0]?.message?.content || "I couldn't analyze your data right now. Keep saving!";
  } catch (error) {
    console.error("Error getting advice from Groq:", error);
    return "The financial coach is taking a nap. Try again later!";
  }
}