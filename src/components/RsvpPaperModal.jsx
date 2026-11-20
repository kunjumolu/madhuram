import React, { useState } from 'react';
import confetti from 'canvas-confetti';

export default function RsvpPaperModal({ isOpen, onClose }) {
  const [name, setName] = useState('');
  const [attending, setAttending] = useState('yes'); // 'yes' (I will be coming) is default
  const [guestCount, setGuestCount] = useState(1);
  const [wishes, setWishes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitted(true);

    // Subtle celebratory golden-rose petal confetti
    try {
      confetti({
        particleCount: 50,
        spread: 65,
        origin: { y: 0.55 },
        colors: ['#d4af37', '#f0b256', '#8b1d24', '#fcedd7', '#4a2e1b'],
      });
    } catch (err) {
      // Confetti fallback
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 select-none bg-black/25 backdrop-blur-[3px] transition-all duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-[94vw] max-w-[480px] sm:max-w-[520px] md:max-w-[560px] max-h-[92vh] animate-popup-3d flex items-center justify-center"
        style={{ aspectRatio: '941 / 1672' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-3 -right-2 sm:-top-3.5 sm:-right-3.5 z-40 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1c1815]/90 text-[#f0b256] border border-[#f0b256]/60 flex items-center justify-center shadow-2xl hover:bg-[#2a241f] hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
          aria-label="Close Invitation Paper"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Paper Background Image with natural deckled edges */}
        <img
          src="/paper.png"
          alt="Wedding Invitation Paper"
          className="w-full h-full object-contain rounded-lg drop-shadow-[0_20px_45px_rgba(0,0,0,0.75)] select-none pointer-events-none"
        />

        {/* RSVP Handwritten Form Container directly on the parchment paper */}
        <div
          className="absolute inset-0 flex flex-col justify-between pointer-events-auto overflow-y-auto overflow-x-hidden"
          style={{
            padding: '7% 12% 8% 12%',
          }}
        >
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="h-full flex flex-col justify-between">
              {/* Top Header: Situated to the right of the red rose in the corner */}
              <div className="flex justify-end pt-1 sm:pt-2">
                <div className="text-right">
                  <h2
                    className="font-script text-3xl sm:text-4xl md:text-5xl text-[#3e2415] tracking-wide leading-none"
                    style={{
                      textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)',
                    }}
                  >
                    RSVP
                  </h2>
                  <p className="font-serif-luxury italic text-xs sm:text-sm text-[#5c3a21]/80 mt-0.5">
                    Madhuramveppu Celebration
                  </p>
                </div>
              </div>

              {/* Form Input Fields (Handwritten style, no borders or overlays, single ruled lines) */}
              <div className="flex flex-col gap-2.5 sm:gap-3.5 my-auto pt-1 sm:pt-2">
                {/* 1. Name Field */}
                <div className="flex flex-col">
                  <label className="font-script text-xl sm:text-2xl text-[#3e2415] leading-tight">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Write your name here..."
                    className="w-full bg-transparent border-none border-b border-[#5c3a21]/50 focus:border-[#3e2415] text-[#3e2415] font-serif-luxury italic text-base sm:text-lg py-0.5 px-0.5 focus:outline-none placeholder:text-[#8a684f]/60 transition-colors"
                    style={{
                      boxShadow: 'none',
                    }}
                  />
                </div>

                {/* 2. Attendance Selection (I will be coming / I won't be able to make it) */}
                <div className="flex flex-col">
                  <span className="font-script text-xl sm:text-2xl text-[#3e2415] leading-tight mb-1">
                    Will you attend?
                  </span>
                  <div className="flex flex-col gap-1 sm:gap-1.5">
                    {/* Option 1: I will be coming (Default) */}
                    <div
                      onClick={() => setAttending('yes')}
                      className="flex items-center gap-2 cursor-pointer group select-none py-0.5"
                    >
                      <span
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border border-[#5c3a21] flex items-center justify-center transition-all ${
                          attending === 'yes' ? 'bg-[#3e2415]' : 'bg-transparent'
                        }`}
                      >
                        {attending === 'yes' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#fcedd7]" />
                        )}
                      </span>
                      <span
                        className={`font-serif-luxury italic text-sm sm:text-base transition-colors ${
                          attending === 'yes'
                            ? 'text-[#3e2415] font-semibold'
                            : 'text-[#6d4d33] opacity-80'
                        }`}
                      >
                        I will be coming
                      </span>
                    </div>

                    {/* Option 2: I won't be able to make it */}
                    <div
                      onClick={() => setAttending('no')}
                      className="flex items-center gap-2 cursor-pointer group select-none py-0.5"
                    >
                      <span
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border border-[#5c3a21] flex items-center justify-center transition-all ${
                          attending === 'no' ? 'bg-[#3e2415]' : 'bg-transparent'
                        }`}
                      >
                        {attending === 'no' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#fcedd7]" />
                        )}
                      </span>
                      <span
                        className={`font-serif-luxury italic text-sm sm:text-base transition-colors ${
                          attending === 'no'
                            ? 'text-[#3e2415] font-semibold'
                            : 'text-[#6d4d33] opacity-80'
                        }`}
                      >
                        I won't be able to make it
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Number of Guests (Only visible if 'I will be coming' is selected) */}
                {attending === 'yes' && (
                  <div className="flex flex-col transition-all duration-300">
                    <label className="font-script text-xl sm:text-2xl text-[#3e2415] leading-tight">
                      Number of Guests
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="15"
                      required={attending === 'yes'}
                      value={guestCount}
                      onChange={(e) => setGuestCount(e.target.value)}
                      placeholder="1"
                      className="w-full bg-transparent border-none border-b border-[#5c3a21]/50 focus:border-[#3e2415] text-[#3e2415] font-serif-luxury italic text-base sm:text-lg py-0.5 px-0.5 focus:outline-none placeholder:text-[#8a684f]/60 transition-colors"
                      style={{
                        boxShadow: 'none',
                      }}
                    />
                  </div>
                )}

                {/* 4. Wishes or Messages (Optional) */}
                <div className="flex flex-col">
                  <label className="font-script text-xl sm:text-2xl text-[#3e2415] leading-tight">
                    Wishes or Messages{' '}
                    <span className="font-serif-luxury italic text-xs text-[#5c3a21]/75">
                      (Optional)
                    </span>
                  </label>
                  <textarea
                    rows={2}
                    value={wishes}
                    onChange={(e) => setWishes(e.target.value)}
                    placeholder="Leave your blessings and warm words..."
                    className="w-full bg-transparent border-none border-b border-[#5c3a21]/50 focus:border-[#3e2415] text-[#3e2415] font-serif-luxury italic text-sm sm:text-base py-0.5 px-0.5 focus:outline-none resize-none placeholder:text-[#8a684f]/60 transition-colors"
                    style={{
                      boxShadow: 'none',
                    }}
                  />
                </div>
              </div>

              {/* 5. Handwritten Submit Button */}
              <div className="flex justify-center pt-2 pb-1">
                <button
                  type="submit"
                  className="group cursor-pointer bg-transparent border-none p-0 focus:outline-none flex flex-col items-center transition-transform duration-200 hover:scale-105 active:scale-95"
                  style={{
                    boxShadow: 'none',
                    outline: 'none',
                  }}
                >
                  <span
                    className="font-script text-2xl sm:text-3xl text-[#3e2415] group-hover:text-[#6b3f1f] tracking-wide transition-colors"
                    style={{
                      textShadow: '0 1px 2px rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    Submit RSVP ♡
                  </span>
                  <div className="w-20 sm:w-28 h-0.5 bg-gradient-to-r from-transparent via-[#5c3a21]/60 to-transparent mt-0.5" />
                </button>
              </div>
            </form>
          ) : (
            /* Heartfelt Handwritten Confirmation Screen */
            <div className="h-full flex flex-col items-center justify-center text-center py-6 px-2 my-auto">
              <span
                className="font-script text-3xl sm:text-4xl text-[#3e2415] leading-tight"
                style={{
                  textShadow: '0 1px 2px rgba(255, 255, 255, 0.6)',
                }}
              >
                {attending === 'yes' ? 'We Rejoice with You!' : 'Thank You for Letting Us Know'}
              </span>

              <p className="font-serif-luxury italic text-base sm:text-lg text-[#3e2415] mt-3 leading-relaxed max-w-[320px]">
                {attending === 'yes'
                  ? `Dearest ${name || 'Friend'}, your presence has been warmly noted for ${
                      guestCount || 1
                    } guest(s). We eagerly look forward to celebrating together! ♡`
                  : `Dearest ${name || 'Friend'}, thank you for letting us know. You will be dearly missed in our celebrations! ♡`}
              </p>

              {wishes.trim() && (
                <div className="mt-3 p-2 border-t border-b border-[#5c3a21]/30 max-w-[300px]">
                  <p className="font-alt-script text-base text-[#5c3a21] italic">
                    "{wishes.trim()}"
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="mt-6 font-script text-lg sm:text-xl text-[#5c3a21] hover:text-[#3e2415] underline cursor-pointer bg-transparent border-none focus:outline-none transition-colors"
              >
                Edit Response
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
