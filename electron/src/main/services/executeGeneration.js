import OpenAI from 'openai'

export const executeGeneration = async (prompt) => {
    const client = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: process.env.DEEPSEEK_API_KEY
    });

    const completion = await client.chat.completions.create({
        model: 'deepseek-v4-flash',
        messages: [{role: 'user', content: prompt}]
    })

    // Should somehow restrict to code generation
    const code = completion.choices[0].message.content;

    return code;
}
