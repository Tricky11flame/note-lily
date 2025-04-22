export async function summarizeNote(content: string) {
    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY}`, // safer: use backend route
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'Summarize this note in a concise and clear way.',
          },
          {
            role: 'user',
            content,
          },
        ],
      }),
    })
  
    const json = await res.json()
    return json?.choices?.[0]?.message?.content
  }
  