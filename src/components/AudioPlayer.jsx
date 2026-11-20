import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const userInteractedRef = useRef(false);
  const userManuallyPausedRef = useRef(false);

  // Smooth fade-in to target volume for a gentle, luxurious audio experience
  const fadeIn = (audio, targetVol = 0.65, duration = 1200) => {
    audio.volume = 0;
    const start = performance.now();
    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      audio.volume = progress * targetVol;
      if (progress < 1 && !audio.paused) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  };

  const playAudio = () => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    audio
      .play()
      .then(() => {
        setIsPlaying(true);
        userInteractedRef.current = true;
        fadeIn(audio, 0.65, 1000);
      })
      .catch((err) => {
        // Autoplay policy prevented playback, awaiting next explicit user gesture
        console.log('Audio playback waiting for user interaction:', err);
      });
  };

  const pauseAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const toggleAudio = (e) => {
    e?.stopPropagation();
    if (isPlaying) {
      userManuallyPausedRef.current = true;
      pauseAudio();
    } else {
      userManuallyPausedRef.current = false;
      playAudio();
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set initial audio properties
    audio.loop = true;

    // 1. Attempt immediate play (if browser autoplay policy permits it)
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          userInteractedRef.current = true;
          fadeIn(audio, 0.65, 1000);
        })
        .catch(() => {
          // Normal browser autoplay restriction: will start on first user interaction
        });
    }

    // 2. Start music on first interaction (click, touch, scroll, swipe, keypress)
    const handleFirstInteraction = () => {
      if (userInteractedRef.current || userManuallyPausedRef.current) return;
      playAudio();
      removeInteractionListeners();
    };

    const events = ['click', 'touchstart', 'touchend', 'pointerdown', 'wheel', 'keydown'];

    const removeInteractionListeners = () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleFirstInteraction, { capture: true });
        document.removeEventListener(event, handleFirstInteraction, { capture: true });
      });
    };

    events.forEach((event) => {
      window.addEventListener(event, handleFirstInteraction, { capture: true, passive: true });
      document.addEventListener(event, handleFirstInteraction, { capture: true, passive: true });
    });

    return () => {
      removeInteractionListeners();
      if (audio) {
        audio.pause();
      }
    };
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-45 sm:bottom-6 sm:right-6 pointer-events-auto select-none">
      {/* Native HTML5 Audio element */}
      <audio
        ref={audioRef}
        src="/music.mp3"
        loop
        preload="auto"
        playsInline
      />

      {/* Floating Mute/Unmute Luxury Button */}
      <button
        type="button"
        onClick={toggleAudio}
        aria-label={isPlaying ? 'Mute background music' : 'Unmute background music'}
        title={isPlaying ? 'Mute background music' : 'Play / Unmute background music'}
        className={`group relative w-11 h-11 sm:w-12 sm:h-12 rounded-full backdrop-blur-md border flex items-center justify-center transition-all duration-300 shadow-2xl cursor-pointer active:scale-95 hover:scale-105 ${
          isPlaying
            ? 'bg-[#1c1815]/85 border-[#d4af37] text-[#f0b256] shadow-[0_0_20px_rgba(212,175,55,0.4)]'
            : 'bg-[#141210]/75 border-white/20 text-[#a89b82] hover:border-[#d4af37]/50 hover:text-[#d4af37]'
        }`}
      >
        {isPlaying ? (
          <>
            {/* Subtle animated sound wave pulse aura */}
            <span className="absolute inset-0 rounded-full border border-[#f0b256]/30 animate-ping opacity-35 pointer-events-none" />
            <Volume2 className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-[#f0b256] transition-transform group-hover:scale-110" />
          </>
        ) : (
          <VolumeX className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-[#a89b82] group-hover:text-[#d4af37] transition-colors" />
        )}
      </button>
    </div>
  );
}
