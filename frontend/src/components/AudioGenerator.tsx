"use client";

import React, { useState, useEffect, useRef } from 'react';
import { generateSpeech, fetchVoices } from '@/lib/api';
import { Sparkles, Play, Square, Loader2, Volume2 } from 'lucide-react';

export default function AudioGenerator() {
    const [text, setText] = useState('');
    const [voices, setVoices] = useState<string[]>([]);
    const [selectedVoice, setSelectedVoice] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const loadVoices = async () => {
            const fetched = await fetchVoices();
            if (fetched && fetched.length > 0) {
                setVoices(fetched);
                setSelectedVoice(fetched[0]);
            } else {
                // Fallback for mock if API is down
                setVoices(["Vinay", "Gavin"]);
                setSelectedVoice("Vinay");
            }
        };
        loadVoices();
    }, []);

    const handleGenerate = async () => {
        if (!text.trim() || !selectedVoice) return;
        
        setIsLoading(true);
        setAudioUrl(null);
        
        try {
            const url = await generateSpeech(text, selectedVoice);
            if (url) {
                setAudioUrl(url);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const togglePlayback = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
            {/* Top pill */}
            <div className="flex items-center gap-4 mb-4 glass-pill px-5 py-2 rounded-full text-xs font-medium text-purple-900/80 shadow-sm transition-all hover:bg-white/70">
                <div className="flex -space-x-2">
                   <div className="w-5 h-5 rounded-full bg-purple-200 border border-white" />
                   <div className="w-5 h-5 rounded-full bg-fuchsia-200 border border-white" />
                   <div className="w-5 h-5 rounded-full bg-pink-200 border border-white" />
                </div>
                <div>20K+ <span className="text-black/40 px-1">|</span> Trusted by 58,980+ users</div>
                <div className="flex text-yellow-500 text-[10px] tracking-tighter">★★★★★ <span className="text-black/60 font-semibold ml-1 text-xs tracking-normal">4.98/5</span></div>
            </div>

            {/* Main Generator Card */}
            <div className="w-full relative glass-card rounded-[2rem] p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                
                {/* Header Sub-bar */}
                <div className="flex flex-wrap items-center justify-between bg-[#f3e8fc]/60 px-4 py-2.5 rounded-xl text-sm font-semibold text-purple-900 mb-6">
                    <div className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-purple-700" />
                        <span>Average generation speed of 1.2s for 500 characters</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-purple-700/80">
                        <Sparkles className="w-3.5 h-3.5" />
                        Powered by StyleTTS2
                    </div>
                </div>

                <div className="flex flex-col gap-5">
                    <h2 className="text-base font-bold text-gray-800 px-1">Voice Synthesis Engine</h2>
                    
                    {/* Input Area */}
                    <div className="relative flex items-center gap-3">
                        <div className="w-1 h-12 bg-purple-500 rounded-full shrink-0" />
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Enter text for speech synthesis..."
                            className="w-full bg-transparent text-2xl lg:text-3xl font-medium text-gray-700 placeholder:text-gray-300 outline-none resize-none pt-2 h-16"
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading || !text.trim()}
                            className="shrink-0 flex items-center gap-2 bg-white border border-gray-200 shadow-sm text-gray-700 px-6 py-3 rounded-2xl font-semibold hover:border-purple-300 hover:text-purple-700 hover:shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                            Generate
                        </button>
                    </div>

                    {/* Result Player Area (Revealed on generation) */}
                    {audioUrl && (
                        <div className="mt-4 p-4 rounded-2xl bg-white/60 border border-purple-100 flex items-center justify-between shadow-sm animate-in slide-in-from-top-4 fade-in duration-500">
                            <audio 
                                ref={audioRef} 
                                src={audioUrl} 
                                onEnded={() => setIsPlaying(false)} 
                                className="hidden"
                            />
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={togglePlayback}
                                    className="w-12 h-12 flex items-center justify-center bg-purple-600 text-white rounded-xl shadow-md hover:bg-purple-700 transition-colors"
                                >
                                    {isPlaying ? <Square className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
                                </button>
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">Generated Sequence</p>
                                    <p className="text-xs text-purple-600 font-medium">{selectedVoice} • High Fidelity</p>
                                </div>
                            </div>
                            <a 
                                href={audioUrl} 
                                download="sonic-ai-audio.wav"
                                className="text-sm font-medium text-purple-600 hover:text-purple-800 px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                            >
                                Download .WAV
                            </a>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2 px-1">
                         <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                            <span className="w-4 h-4 rounded bg-gray-200/60 flex items-center justify-center text-[10px]">A</span>
                            Characters supported between 1-5000 for realistic assets.
                        </div>

                        {/* Voice Selector hidden in footer to keep the input clean */}
                        <div className="flex items-center gap-2 max-w-[150px]">
                            <select 
                                value={selectedVoice}
                                onChange={(e) => setSelectedVoice(e.target.value)}
                                className="w-full appearance-none bg-white border border-gray-200 text-sm font-semibold text-gray-700 rounded-xl px-4 py-2 outline-none cursor-pointer focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all shadow-sm"
                            >
                                {voices.map(v => (
                                    <option key={v} value={v}>{v}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
}
