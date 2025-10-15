import OpenAI from "openai";

// Reference javascript_openai integration
// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function extractTransactionFromSms(smsText: string): Promise<{
  merchantName: string;
  amount: string;
  category: string;
  lastFourDigits?: string;
  description?: string;
} | null> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `You are a transaction extraction expert. Extract transaction details from SMS messages. 
          Respond with JSON in this exact format: 
          { "merchantName": string, "amount": string (number only, no currency symbols), "category": string (one of: Shopping, Food, Travel, Fuel, Groceries, Utilities, Entertainment, Healthcare, Other), "lastFourDigits": string (if mentioned), "description": string }
          If the SMS is not a transaction SMS, return null.`,
        },
        {
          role: "user",
          content: smsText,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "null");
    return result;
  } catch (error) {
    console.error("Error extracting transaction from SMS:", error);
    return null;
  }
}

export async function analyzeEmailForCreditCard(emailSubject: string, emailBody: string): Promise<{
  type: "statement" | "offer" | "bill" | "other";
  summary: string;
  changes?: {
    field: string;
    oldValue: string;
    newValue: string;
    impact: string;
  }[];
  billAmount?: string;
  dueDate?: string;
} | null> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `You are a credit card email analyzer. Analyze emails related to credit cards and extract key information.
          Respond with JSON in this format:
          {
            "type": "statement" | "offer" | "bill" | "other",
            "summary": "Simple explanation of what this email means for the user",
            "changes": [{ "field": string, "oldValue": string, "newValue": string, "impact": string }] (if offer/terms changed),
            "billAmount": string (if it's a bill),
            "dueDate": string (if it's a bill)
          }
          Focus on changes in rewards, fees, interest rates, and offers. Explain in simple terms.`,
        },
        {
          role: "user",
          content: `Subject: ${emailSubject}\n\nBody: ${emailBody}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "null");
    return result;
  } catch (error) {
    console.error("Error analyzing email:", error);
    return null;
  }
}

export async function summarizeOfferChange(oldOffer: string, newOffer: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are a financial advisor. Explain credit card offer changes in simple, friendly language. Focus on what changed and what it means for the user.",
        },
        {
          role: "user",
          content: `Old offer: ${oldOffer}\n\nNew offer: ${newOffer}\n\nExplain the changes in 2-3 sentences.`,
        },
      ],
    });

    return response.choices[0].message.content || "Offer has been updated.";
  } catch (error) {
    console.error("Error summarizing offer change:", error);
    return "Offer has been updated. Please review the details.";
  }
}
