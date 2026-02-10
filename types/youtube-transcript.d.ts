declare module 'youtube-transcript' {
    export interface TranscriptConfig {
        lang?: string;
        country?: string;
    }
    export interface TranscriptItem {
        text: string;
        duration: number;
        offset: number;
    }
    export class YoutubeTranscript {
        static fetchTranscript(videoId: string, config?: TranscriptConfig): Promise<TranscriptItem[]>;
    }
}
