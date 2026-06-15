import OpenAI from 'openai'

export const executeGeneration = async (prompt) => {
    const client = new OpenAI({
        baseURL: 'http://localhost:11434/v1',
        apiKey: 'ollama',
    });

    const completion = await client.chat.completions.create({
        model: 'qwen3.6:27b',
        messages: [{role: 'user', content: prompt}]
    })

    // Should somehow restrict to code generation
    const code = completion.choices[0].message.content;

    return code;
}
