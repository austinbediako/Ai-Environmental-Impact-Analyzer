const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    console.log("Testing model: gemini-flash-latest...");
    
    // Just a tiny prompt to see if it even connects
    const result = await model.generateContent("test");
    console.log("Success! Model is available.");
  } catch (error) {
    console.error("Error with gemini-flash-latest:", error.message);
    
    console.log("\nAttempting to list all models...");
    // The SDK might not have a direct listModels but we can try to fetch the list via REST if needed or check documentation
    // In many versions of the SDK, listModels is not directly exposed on the genAI object as a public method in the same way.
  }
}

listModels();
