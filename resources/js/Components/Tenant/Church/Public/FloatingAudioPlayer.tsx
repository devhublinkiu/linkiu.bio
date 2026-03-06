import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Play, ChevronLeft, ChevronRight, Volume2, VolumeX, X } from 'lucide-react';
import type { EpisodePublic } from './EpisodeCard';

export interface FloatingAudioPlayerProps {
    episodes: EpisodePublic[];
    currentIndex: number;
    onClose: () => void;
    onIndexChange: (index: number) => void;
}

export default function FloatingAudioPlayer({ episodes, currentIndex, onClose, onIndexChange }: FloatingAudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [muted, setMuted] = useState(false);

    const ep = episodes[currentIndex];
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < episodes.length - 1;

    const togglePlay = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;
        if (audio.paused) {
            audio.play().then(() => setIsPlaying(true)).catch(() => {});
        } else {
            audio.pause();
            setIsPlaying(false);
        }
    }, []);

    const goPrev = useCallback(() => {
        if (hasPrev) onIndexChange(currentIndex - 1);
        else if (audioRef.current) audioRef.current.currentTime = 0;
    }, [hasPrev, currentIndex, onIndexChange]);

    const goNext = useCallback(() => {
        if (hasNext) onIndexChange(currentIndex + 1);
        else if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    }, [hasNext, currentIndex, onIndexChange]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !ep?.audio_url) return;
        audio.src = ep.audio_url;
        setCurrentTime(0);
        setDuration(0);
        audio.load();
        audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }, [currentIndex, ep?.id, ep?.audio_url]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        const onTimeUpdate = () => setCurrentTime(audio.currentTime);
        const onLoadedMetadata = () => setDuration(audio.duration);
        const onEnded = () => {
            setIsPlaying(false);
            if (hasNext) onIndexChange(currentIndex + 1);
        };
        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);
        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('loadedmetadata', onLoadedMetadata);
        audio.addEventListener('ended', onEnded);
        audio.addEventListener('play', onPlay);
        audio.addEventListener('pause', onPause);
        return () => {
            audio.removeEventListener('timeupdate', onTimeUpdate);
            audio.removeEventListener('loadedmetadata', onLoadedMetadata);
            audio.removeEventListener('ended', onEnded);
            audio.removeEventListener('play', onPlay);
            audio.removeEventListener('pause', onPause);
        };
    }, [currentIndex, hasNext, onIndexChange]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.volume = muted ? 0 : volume;
    }, [volume, muted]);

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const t = Number(e.target.value);
        const audio = audioRef.current;
        if (audio) {
            audio.currentTime = t;
            setCurrentTime(t);
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = Number(e.target.value);
        setVolume(v);
        setMuted(v === 0);
    };

    const handleClose = useCallback(() => {
        audioRef.current?.pause();
        onClose();
    }, [onClose]);

    if (!ep) return null;

    return (
        <>
            <audio ref={audioRef} preload="metadata" />
            <div className="bg-gradient-to-b from-white to-slate-200 border-t border-slate-200 shadow-xl safe-area-pb mx-4 my-6 rounded-xl">
                <div className="max-w-lg mx-auto px-4 py-2">
                    <input
                        type="range"
                        min={0}
                        max={duration || 100}
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-1.5 accent-primary cursor-pointer"
                    />
                    <div className="grid grid-cols-2 gap-2 items-center mt-1 mb-2 text-xs">
                        <p className="font-semibold text-slate-900 truncate min-w-0" title={ep.title}>{ep.title}</p>
                        <p className="text-slate-500 text-right tabular-nums">
                            {Math.floor(currentTime / 60)}:{(Math.floor(currentTime % 60)).toString().padStart(2, '0')} / {ep.formatted_duration}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button type="button" onClick={goPrev} disabled={!hasPrev && currentTime === 0} className="p-2 rounded-full text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none" aria-label="Anterior">
                            <ChevronLeft className="size-6" />
                        </button>
                        <button type="button" onClick={togglePlay} className="p-2 rounded-full bg-primary text-white hover:opacity-90 shadow-md flex items-center justify-center min-w-[48px] min-h-[48px]" aria-label={isPlaying ? 'Pausar' : 'Reproducir'}>
                            {isPlaying ? (
                                <span className="flex gap-0.5 items-end">
                                    <span className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                                    <span className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                                    <span className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                                </span>
                            ) : (
                                <Play className="size-6 ml-0.5" />
                            )}
                        </button>
                        <button type="button" onClick={goNext} disabled={!hasNext} className="p-2 rounded-full text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none" aria-label="Siguiente">
                            <ChevronRight className="size-6" />
                        </button>
                        <div className="flex-1 min-w-0" />
                        <div className="flex items-center gap-1">
                            <button type="button" onClick={() => setMuted((m) => !m)} className="p-2 rounded-full text-slate-600 hover:bg-slate-100" aria-label={muted ? 'Activar sonido' : 'Silenciar'}>
                                {muted || volume === 0 ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
                            </button>
                            <input type="range" min={0} max={1} step={0.05} value={muted ? 0 : volume} onChange={handleVolumeChange} className="w-16 h-1.5 accent-primary cursor-pointer" aria-label="Volumen" />
                        </div>
                        <button type="button" onClick={handleClose} className="p-2 rounded-full text-slate-500 hover:bg-slate-100" aria-label="Cerrar">
                            <X className="size-5" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
