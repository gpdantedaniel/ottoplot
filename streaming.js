const OpenAI = require("openai");

// Initialize OpenAI client pointing to your local Ollama instance
const openai = new OpenAI({
  baseURL: 'http://localhost:11434/v1',
  apiKey: 'ollama', // A value is required by the SDK, but Ollama ignores it
});

async function main() {
  try {
    // Request a streaming chat completion
    const stream = await openai.chat.completions.create({
        model: 'qwen3.6:27b', // Replace with any model you have pulled in Ollama
        messages: [{ role: 'user', content: 'Explain quantum computing in three sentences.' }],
        stream: true, // Crucial parameter to enable chunked delivery
    });

    // Iterate over the incoming stream chunks in real-time
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      process.stdout.write(content);
    }
  } catch (error) {
    console.error('Error streaming from Ollama:', error);
  }
}

main();