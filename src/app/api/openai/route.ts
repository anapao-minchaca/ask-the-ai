import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const query = body.query;
        
        if (typeof query !== 'string') {
            return NextResponse.json({ error: 'Invalid query' }, { status: 400 });
        }
        
        const chatResponse = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: query }],
    });
    
    const responseText = chatResponse.choices[0]?.message?.content || 'No response';
    
    return NextResponse.json({ response: responseText });
} catch (error) {
    console.error('OpenAI error:', error);
    return NextResponse.json({ error: 'Failed to fetch response from OpenAI' }, { status: 500 });
}
}