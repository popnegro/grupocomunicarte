const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * Initializes the GoogleGenerativeAI client.
 * Exits the process if the API key is missing.
 * @returns {GoogleGenerativeAI} The initialized client.
 */
function initializeGenAI() {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("Error: API_KEY environment variable is not set.");
    process.exit(1);
  }
  return new GoogleGenerativeAI(apiKey);
}

async function run() {
  try {
    const genAI = initializeGenAI();

    // For text-only input, use the gemini-pro model
    const modelName = process.env.MODEL_NAME || "gemini-pro";
    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = "Write a story about a magic backpack.";

    console.log(`Generating content with model "${modelName}"...`);

    const result = await model.generateContent(prompt);
    // It's good practice to check if the response and its parts exist
    const response = result.response;
    const text = response?.text();

    console.log("\n--- Generated Story ---");
    console.log(text || "No content was generated.");
    console.log("-----------------------\n");
  } catch (error) {
    console.error("An error occurred during content generation:", error);
  }
}

run();
