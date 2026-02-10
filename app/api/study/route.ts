import { NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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

        // 3. Generate Summary & Notes with Gemini
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: 'Gemini API Key is not configured' }, { status: 500 });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `
      You are an expert AI tutor. Your goal is to generate structured study notes from the following video transcript.
      
      Transcript:
      "${transcriptText.substring(0, 30000)}" // Limit to ~30k chars to stay within safe token limits for Flash 1.5 if transcript is huge.
      
      Output Format (JSON):
      {
        "summary": "A comprehensive summary of the video (2-3 paragraphs)",
        "studyNotes": "Markdown formatted study notes with headings, bullet points, and key concepts."
      }
      
      Ensure the study notes are detailed, easy to understand, and capturing the core essence of the video. Return ONLY the JSON.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up JSON if wrapped in markdown code blocks
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            const data = JSON.parse(cleanJson);
            return NextResponse.json(data);
        } catch (e) {
            console.error('JSON parsing error', e);
            // Fallback if AI didn't return valid JSON
            return NextResponse.json({
                summary: "Error parsing AI response.",
                studyNotes: text // Return raw text as notes
            });
        }

    } catch (error) {
        console.error('Study tool error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
