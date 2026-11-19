import React, { useEffect } from 'react';

export default function LoadingScreen({ percent, isComplete, onFinish }) {
  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        onFinish();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isComplete, onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-black select-none">
      {/* Background: First Frame of madhurem folder */}
      <div className="absolute inset-0 z-0">
        <img
          src="/madhurem/frame_01.jpg"
          alt="Stage"
          className="w-full h-full object-cover object-center filter brightness-[0.65] contrast-[1.05]"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(6, 15, 10, 0.4) 0%, rgba(4, 9, 6, 0.8) 75%, rgba(2, 5, 3, 0.95) 100%)',
          }}
        />
      </div>

      {/* Minimal Center: Only Loading and Percentage */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="font-heading text-4xl sm:text-5xl font-semibold text-[#fbeea4] tracking-wider drop-shadow-md mb-3">
          {percent}%
        </div>

        {/* Minimal Gold Progress Line */}
        <div className="w-44 sm:w-56 h-1 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full gold-gradient-bg transition-all duration-200 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>

        <span className="text-[10px] uppercase tracking-[0.35em] text-[#d4af37] font-sans-ui mt-3 opacity-80">
          Loading
        </span>
      </div>
    </div>
  );
}
