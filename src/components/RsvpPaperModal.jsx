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

    // Celebratory golden rose petal confetti
    try {
      confetti({
        particleCount: 55,
        spread: 70,
        origin: { y: 0.55 },
        colors: ['#d4af37', '#f0b256', '#8b1d24', '#fcedd7', '#1a0a03'],
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
        className="relative w-[94vw] max-w-[490px] sm:max-w-[530px] md:max-w-[570px] max-h-[92vh] animate-popup-3d flex items-center justify-center"
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
          className="absolute inset-0 flex flex-col pointer-events-auto overflow-y-auto overflow-x-hidden"
          style={{
            paddingTop: '12%',
            paddingBottom: '8%',
            paddingLeft: '21%',
            paddingRight: '9%',
          }}
        >
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="my-auto flex flex-col">
              {/* Form Input Fields: Shifted right to avoid rose/vines, high contrast dark text, crisp ruled lines */}
              <div className="flex flex-col gap-3 sm:gap-3.5">
                {/* 1. Name Field */}
                <div className="flex flex-col">
                  <label className="font-script text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a0a03] leading-tight">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Write your name here..."
                    className="w-full bg-transparent border-none border-b-2 border-[#2a1206] focus:border-[#1a0a03] text-[#150802] font-serif-luxury italic font-bold text-lg sm:text-xl md:text-2xl py-1 px-0.5 focus:outline-none placeholder:text-[#4a2c17]/75 transition-colors"
                    style={{
                      boxShadow: 'none',
                    }}
                  />
                </div>

                {/* 2. Attendance Selection (I will be coming / I won't be able to make it) */}
                <div className="flex flex-col">
                  <span className="font-script text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a0a03] leading-tight mb-1.5">
                    Will you attend?
                  </span>
                  <div className="flex flex-col gap-2 sm:gap-2.5">
                    {/* Option 1: I will be coming (Default) */}
                    <div
                      onClick={() => setAttending('yes')}
                      className="flex items-center gap-2.5 cursor-pointer group select-none py-0.5"
                    >
                      <span
                        className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-[#1a0a03] flex items-center justify-center transition-all ${attending === 'yes' ? 'bg-[#1a0a03]' : 'bg-transparent'
                          }`}
                      >
                        {attending === 'yes' && (
                          <span className="w-2 h-2 rounded-full bg-[#fcedd7]" />
                        )}
                      </span>
                      <span
                        className={`font-serif-luxury italic text-base sm:text-lg md:text-xl transition-colors ${attending === 'yes'
                          ? 'text-[#1a0a03] font-bold'
                          : 'text-[#3e2415] opacity-85 font-medium'
                          }`}
                      >
                        I will be coming
                      </span>
                    </div>

                    {/* Option 2: I won't be able to make it */}
                    <div
                      onClick={() => setAttending('no')}
                      className="flex items-center gap-2.5 cursor-pointer group select-none py-0.5"
                    >
                      <span
                        className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-[#1a0a03] flex items-center justify-center transition-all ${attending === 'no' ? 'bg-[#1a0a03]' : 'bg-transparent'
                          }`}
                      >
                        {attending === 'no' && (
                          <span className="w-2 h-2 rounded-full bg-[#fcedd7]" />
                        )}
                      </span>
                      <span
                        className={`font-serif-luxury italic text-base sm:text-lg md:text-xl transition-colors ${attending === 'no'
                          ? 'text-[#1a0a03] font-bold'
                          : 'text-[#3e2415] opacity-85 font-medium'
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
                    <label className="font-script text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a0a03] leading-tight">
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
                      className="w-full bg-transparent border-none border-b-2 border-[#2a1206] focus:border-[#1a0a03] text-[#150802] font-serif-luxury italic font-bold text-lg sm:text-xl md:text-2xl py-1 px-0.5 focus:outline-none placeholder:text-[#4a2c17]/75 transition-colors"
                      style={{
                        boxShadow: 'none',
                      }}
                    />
                  </div>
                )}

                {/* 4. Wishes or Messages (Optional) */}
                <div className="flex flex-col">
                  <label className="font-script text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a0a03] leading-tight">
                    Wishes or Messages{' '}
                    <span className="font-serif-luxury italic text-sm sm:text-base opacity-75 font-normal">
                      (Optional)
                    </span>
                  </label>
                  <textarea
                    rows={2}
                    value={wishes}
                    onChange={(e) => setWishes(e.target.value)}
                    placeholder="Leave your blessings and warm words..."
                    className="w-full bg-transparent border-none border-b-2 border-[#2a1206] focus:border-[#1a0a03] text-[#150802] font-serif-luxury italic font-semibold text-base sm:text-lg md:text-xl py-1 px-0.5 focus:outline-none resize-none placeholder:text-[#4a2c17]/75 transition-colors"
                    style={{
                      boxShadow: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Submit RSVP Button: positioned snuggly right after the last text field, NOT at the bottom */}
              <div className="flex justify-center pt-3 sm:pt-4 pb-1">
                <button
                  type="submit"
                  className="group cursor-pointer bg-transparent border-none p-0 focus:outline-none flex flex-col items-center transition-transform duration-200 hover:scale-105 active:scale-95"
                  style={{
                    boxShadow: 'none',
                    outline: 'none',
                  }}
                  aria-label="Submit RSVP"
                >
                  <span
                    className="font-script text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a0a03] group-hover:text-[#8b1d24] tracking-wide transition-colors"
                    style={{
                      textShadow: '0 1px 2px rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    Submit RSVP ♡
                  </span>
                  <div className="w-24 sm:w-32 h-0.5 sm:h-1 bg-[#1a0a03] mt-0.5 rounded-full" />
                </button>
              </div>
            </form>
          ) : (
            /* Heartfelt Handwritten Confirmation Screen */
            <div className="h-full flex flex-col items-center justify-center text-center py-6 px-2 my-auto">
              <span
                className="font-script text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a0a03] leading-tight"
                style={{
                  textShadow: '0 1px 2px rgba(255, 255, 255, 0.7)',
                }}
              >
                {attending === 'yes' ? 'We Rejoice with You!' : 'Thank You for Letting Us Know'}
              </span>

              <p className="font-serif-luxury italic font-semibold text-lg sm:text-xl text-[#1a0a03] mt-3 leading-relaxed max-w-[320px]">
                {attending === 'yes'
                  ? `Dearest ${name || 'Friend'}, your presence has been warmly noted for ${guestCount || 1
                  } guest(s). We eagerly look forward to celebrating together! ♡`
                  : `Dearest ${name || 'Friend'}, thank you for letting us know. You will be dearly missed in our celebrations! ♡`}
              </p>

              {wishes.trim() && (
                <div className="mt-3 p-2 border-t border-b border-[#2a1206]/40 max-w-[300px]">
                  <p className="font-alt-script text-lg sm:text-xl text-[#1a0a03] italic font-medium">
                    "{wishes.trim()}"
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="mt-6 font-script text-xl sm:text-2xl font-bold text-[#1a0a03] hover:text-[#8b1d24] underline cursor-pointer bg-transparent border-none focus:outline-none transition-colors"
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
