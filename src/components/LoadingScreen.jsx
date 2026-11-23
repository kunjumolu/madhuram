import React from 'react';

export default function LoadingScreen({ percent, isComplete, isDismissed }) {
  return (
    <div
      className={`fixed inset-0 z-40 overflow-hidden select-none transition-opacity duration-300 ease-out ${isDismissed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
    >
      {/* Background: Pristine First Frame (Frozen Stage Overview while preloading) */}
      <img
        src="/madhurem/frame_01.webp"
        alt="Wedding Stage"
        fetchPriority="high"
        className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none"
      />

      {/* Center Grass Lawn Loading Overlay (Positioned in 3D ground perspective) */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none flex flex-col items-center z-10"
        style={{
          top: '69%',
          left: '55%',
        }}
      >
        <div className="grass-perspective flex flex-col items-center text-center">
          {!isComplete ? (
            /* --- 1. Static Golden-Amber (#f0b256) Loading Text & Ribbon --- */
            <div className="flex flex-col items-center text-center">
              <div className="relative z-10 flex items-baseline justify-center gap-2 sm:gap-3">
                <span
                  className="font-script text-4xl sm:text-5xl md:text-6xl text-[#f0b256] font-normal tracking-wide"
                  style={{
                    textShadow: '0 2px 5px rgba(0, 0, 0, 0.9), 0 1px 2px rgba(0, 0, 0, 0.95)',
                  }}
                >
                  Loading
                </span>
                <span
                  className="font-serif-luxury italic text-2xl sm:text-3xl md:text-4xl font-semibold text-[#f0b256] tabular-nums inline-block min-w-[3.2ch] text-left"
                  style={{
                    textShadow: '0 2px 5px rgba(0, 0, 0, 0.9), 0 1px 2px rgba(0, 0, 0, 0.95)',
                  }}
                >
                  {percent}%
                </span>
              </div>

              {/* Delicate Golden Progress Ribbon */}
              <div className="relative z-10 w-36 sm:w-48 md:w-56 h-1 mt-1.5 rounded-full bg-black/60 border border-[#f0b256]/30 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#d99738] via-[#f0b256] to-[#ffd78a]"
                  style={{
                    width: `${percent}%`,
                  }}
                />
              </div>

              {/* Empty preserved subtitle slot */}
              <span className="relative z-10 text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-[#f0b256] font-sans-ui mt-1 opacity-85"></span>
            </div>
          ) : (
            /* --- 2. 'Scroll up to start exploring' Prompt in #f0b256 --- */
            <div className="flex flex-col items-center text-center">
              <span
                className="font-script text-2xl sm:text-3xl md:text-4xl text-[#f0b256] font-normal tracking-wide whitespace-nowrap"
                style={{
                  textShadow: '0 2px 5px rgba(0, 0, 0, 0.9), 0 1px 2px rgba(0, 0, 0, 0.95)',
                }}
              >
                Scroll up to start exploring
              </span>
              {/* Elegant minimal upward indicator cue */}
              <div className="mt-1 flex flex-col items-center opacity-85">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-[#f0b256] animate-bounce"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
