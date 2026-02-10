import { NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';
import OpenAI from 'openai';

// Initialize OpenAI client for OpenRouter
const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY || '',
});

export async function POST(request: Request) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json({ error: 'Video URL is required' }, { status: 400 });
        }

        // 1. Validate YouTube URL and extract ID
        const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        if (!videoIdMatch) {
            return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
        }
        const videoId = videoIdMatch[1];

        // 2. Fetch Transcript
        let transcriptText = '';
        try {
            const transcript = await YoutubeTranscript.fetchTranscript(videoId);
            transcriptText = transcript.map(item => item.text).join(' ');
        } catch (error) {
            console.error('Transcript error:', error);
            return NextResponse.json({ error: 'Could not fetch video transcript. The video might not have captions enabled.' }, { status: 422 });
        }

        // 3. Generate Summary & Notes with OpenRouter (Gemini)
        if (!process.env.OPENROUTER_API_KEY) {
            return NextResponse.json({ error: 'OpenRouter API Key is not configured' }, { status: 500 });
        }

        const completion = await openai.chat.completions.create({
            model: 'google/gemini-2.0-flash-lite-preview-02-05:free', // Use a free/cheap model
            messages: [
                {
                    role: 'system',
                    content: `You are an expert AI tutor. Your goal is to generate structured study notes from the provided video transcript.
          Output Format (JSON):
          {
            "summary": "A comprehensive summary of the video (2-3 paragraphs)",
            "studyNotes": "Markdown formatted study notes with headings, bullet points, and key concepts."
          }
          Ensure the study notes are detailed, easy to understand, and capturing the core essence of the video. Return ONLY the JSON.`
                },
                {
                    role: 'user',
                    content: `Transcript: "${transcriptText.substring(0, 30000)}"`
                }
            ],
            response_format: { type: 'json_object' }
        });

        const content = completion.choices[0].message.content;

        if (!content) {
            throw new Error('No content received from AI');
        }

        try {
            const data = JSON.parse(content);
            return NextResponse.json(data);
        } catch (e) {
            console.error('JSON parsing error', e);
            return NextResponse.json({
                summary: "Error parsing AI response.",
                studyNotes: content
            });
        }

    } catch (error) {
        console.error('Study tool error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
