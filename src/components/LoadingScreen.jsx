import React, { useState, useEffect } from 'react';

export default function LoadingScreen({ percent, isComplete, onFinish }) {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (isComplete) {
      // Begin smooth dissolve when 100% preloading finishes
      setIsFadingOut(true);
      const timer = setTimeout(() => {
        onFinish();
      }, 550);
      return () => clearTimeout(timer);
    }
  }, [isComplete, onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden bg-[#060b08] select-none transition-opacity duration-500 ease-out ${isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
    >
      {/* Background: Pristine First Frame (Stage Overview) */}
      <img
        src="/madhurem/frame_01.jpg"
        alt="Wedding Stage"
        className="w-full h-full object-cover object-center select-none pointer-events-none"
      />

      {/* Center Grass Lawn Loading Overlay (Positioned between banquet table and chairs in 3D ground perspective) */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none flex flex-col items-center"
        style={{
          top: '69%',
          left: '55%',
        }}
      >
        <div className="grass-perspective flex flex-col items-center text-center">
          {/* Fancy Wedding Style Loading Title & Percentage */}
          <div className="relative z-10 flex items-baseline justify-center gap-2 sm:gap-3">
            <span
              className="font-script text-4xl sm:text-5xl md:text-6xl text-[#fae6b1] font-normal tracking-wide"
              style={{
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.85)',
              }}
            >
              Loading
            </span>
            <span
              className="font-serif-luxury italic text-2xl sm:text-3xl md:text-4xl font-semibold text-[#f5dfa8]"
              style={{
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.85)',
              }}
            >
              {percent}%
            </span>
          </div>

          {/* Delicate Gold Progress Ribbon lying on the grass plane */}
          <div className="relative z-10 w-36 sm:w-48 md:w-56 h-1 mt-1 rounded-full bg-black/50 border border-[#dfbc4f]/35 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-200 ease-out bg-gradient-to-r from-[#dfbc4f] via-[#fff0c8] to-[#dfbc4f]"
              style={{
                width: `${percent}%`,
              }}
            />
          </div>

          {/* Subtle elegant subtitle in warm champagne/beige */}
          <span
            className="relative z-10 text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-[#e0caa0] font-sans-ui mt-1 opacity-85"
            style={{
              textShadow: '0 1px 4px rgba(0, 0, 0, 0.95)',
            }}
          >

          </span>
        </div>
      </div>
    </div>
  );
}
