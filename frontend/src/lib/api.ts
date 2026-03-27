export const fetchVoices = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/voices`, {
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch voices');
        const data = await response.json();
        return data.voices || [];
    } catch (error) {
        console.error("Error fetching voices:", error);
        return [];
    }
};

export const generateSpeech = async (text: string, voice: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
            },
            body: JSON.stringify({ text, target_voice: voice })
        });
        if (!response.ok) throw new Error('Failed to generate speech');
        const data = await response.json();
        return data.audio_url; // Returns the mock S3 URL
    } catch (error) {
        console.error("Error generating speech:", error);
        return null;
    }
};
