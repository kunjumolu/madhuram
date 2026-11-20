import React from 'react';

export default function LoadingScreen({ percent, isComplete, isDismissed }) {
  return (
    <div
      className={`fixed inset-0 z-40 overflow-hidden select-none transition-opacity duration-300 ease-out ${
        isDismissed ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background: Pristine First Frame (Frozen Stage Overview while preloading) */}
      <img
        src="/madhurem/frame_01.jpg"
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
            /* --- 1. Static Warm-White Loading Text & Ribbon (No Shivering / No Layout Shift) --- */
            <div className="flex flex-col items-center text-center">
              <div className="relative z-10 flex items-baseline justify-center gap-2 sm:gap-3">
                <span
                  className="font-script text-4xl sm:text-5xl md:text-6xl text-[#faf6ee] font-normal tracking-wide"
                  style={{
                    textShadow: '0 2px 5px rgba(0, 0, 0, 0.9), 0 1px 2px rgba(0, 0, 0, 0.95)',
                  }}
                >
                  Loading
                </span>
                <span
                  className="font-serif-luxury italic text-2xl sm:text-3xl md:text-4xl font-semibold text-[#f5efe4] tabular-nums inline-block min-w-[3.2ch] text-left"
                  style={{
                    textShadow: '0 2px 5px rgba(0, 0, 0, 0.9), 0 1px 2px rgba(0, 0, 0, 0.95)',
                  }}
                >
                  {percent}%
                </span>
              </div>

              {/* Delicate Warm-White Progress Ribbon */}
              <div className="relative z-10 w-36 sm:w-48 md:w-56 h-1 mt-1.5 rounded-full bg-black/60 border border-[#faf6ee]/25 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#e3dac9] via-[#ffffff] to-[#e3dac9]"
                  style={{
                    width: `${percent}%`,
                  }}
                />
              </div>

              {/* Empty preserved subtitle slot */}
              <span className="relative z-10 text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-[#f5efe4] font-sans-ui mt-1 opacity-85"></span>
            </div>
          ) : (
            /* --- 2. 'Scroll up to start exploring' Prompt (Warm-white, same font & theme) --- */
            <div className="flex flex-col items-center text-center">
              <span
                className="font-script text-2xl sm:text-3xl md:text-4xl text-[#faf6ee] font-normal tracking-wide whitespace-nowrap"
                style={{
                  textShadow: '0 2px 5px rgba(0, 0, 0, 0.9), 0 1px 2px rgba(0, 0, 0, 0.95)',
                }}
              >
                Scroll up to start exploring
              </span>
              {/* Elegant minimal upward indicator cue */}
              <div className="mt-1 flex flex-col items-center opacity-85">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-[#faf6ee] animate-bounce"
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
