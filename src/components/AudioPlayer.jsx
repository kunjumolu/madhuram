import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const intervalRef = useRef(null);

  // Soft ambient wedding melody synthesizer via Web Audio API
  const startSynthMelody = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }

      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      const ctx = audioCtxRef.current;

      const chords = [
        [261.63, 329.63, 392.0, 523.25], // C major
        [220.0, 261.63, 329.63, 440.0],  // A minor
        [174.61, 220.0, 261.63, 349.23], // F major
        [196.0, 246.94, 293.66, 392.0],  // G major
      ];

      let chordIndex = 0;

      const playChordNote = (freq, delayTime) => {
        setTimeout(() => {
          if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;

          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.15);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.2);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start();
          osc.stop(ctx.currentTime + 3.3);
        }, delayTime);
      };

      const step = () => {
        const currentChord = chords[chordIndex % chords.length];
        chordIndex++;

        currentChord.forEach((note, idx) => {
          playChordNote(note, idx * 350);
        });
      };

      step();
      intervalRef.current = setInterval(step, 3000);
    } catch (e) {
      console.warn('Web Audio not allowed or supported', e);
    }
  };

  const stopSynthMelody = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
      audioCtxRef.current.suspend();
    }
  };

  const toggleAudio = () => {
    if (isPlaying) {
      stopSynthMelody();
      setIsPlaying(false);
    } else {
      startSynthMelody();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      stopSynthMelody();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <button
        onClick={toggleAudio}
        className={`w-10 h-10 rounded-full luxury-glass border flex items-center justify-center transition-all duration-300 shadow-xl ${
          isPlaying
            ? 'border-[#d4af37] text-[#fbeea4] shadow-[0_0_15px_rgba(212,175,55,0.35)]'
            : 'border-white/10 text-[#c9bea7] hover:border-[#d4af37]/40'
        }`}
        title={isPlaying ? 'Mute music' : 'Play ambient music'}
      >
        {isPlaying ? (
          <Volume2 className="w-4 h-4 text-[#d4af37] animate-pulse" />
        ) : (
          <Music className="w-4 h-4 text-[#a89b82]" />
        )}
      </button>
    </div>
  );
}
