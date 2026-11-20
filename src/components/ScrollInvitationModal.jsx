import React, { useEffect } from 'react';
import { MapPin, ExternalLink, X } from 'lucide-react';

export default function ScrollInvitationModal({ isOpen, onClose }) {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/65 backdrop-blur-xl transition-all duration-300"
      onClick={onClose}
    >
      {/* Scroll Modal Container with Unroll Animation */}
      <div
        className="relative w-full max-w-[340px] sm:max-w-[390px] flex flex-col items-center animate-scroll-unroll select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Antique Brass Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-3.5 -right-2.5 sm:-top-4 sm:-right-3 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#201408] border border-[#d4af37]/80 text-[#fae28c] flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl cursor-pointer hover:rotate-90"
          title="Close Invitation"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 1. TOP ROLLER ROD (Realistic Antique Dark Walnut & Gold Brass) */}
        <div className="relative w-full z-20 flex items-center justify-center">
          {/* Left Turned Finial Knob */}
          <div className="absolute -left-3 sm:-left-4 w-6 h-7 sm:w-7 sm:h-8 rounded-full bg-gradient-to-r from-[#1f1205] via-[#613c18] to-[#261506] border border-[#cba258]/60 shadow-[0_3px_8px_rgba(0,0,0,0.6)] flex items-center justify-center">
            <div className="w-2 h-3 sm:w-2.5 sm:h-3.5 rounded-full bg-gradient-to-b from-[#fae28c] via-[#b8860b] to-[#422e03]" />
          </div>

          {/* Central Cylindrical Roller */}
          <div
            className="w-full h-4 sm:h-5 rounded-full"
            style={{
              background:
                'linear-gradient(180deg, #1c1006 0%, #4a2d13 25%, #7a4e23 48%, #caa15a 53%, #593515 75%, #180d04 100%)',
              boxShadow:
                '0 4px 10px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 230, 180, 0.45), inset 0 -1px 2px rgba(0, 0, 0, 0.9)',
            }}
          />

          {/* Right Turned Finial Knob */}
          <div className="absolute -right-3 sm:-right-4 w-6 h-7 sm:w-7 sm:h-8 rounded-full bg-gradient-to-r from-[#261506] via-[#613c18] to-[#1f1205] border border-[#cba258]/60 shadow-[0_3px_8px_rgba(0,0,0,0.6)] flex items-center justify-center">
            <div className="w-2 h-3 sm:w-2.5 sm:h-3.5 rounded-full bg-gradient-to-b from-[#fae28c] via-[#b8860b] to-[#422e03]" />
          </div>
        </div>

        {/* 2. SCROLL BODY (Authentic Aged Warm-White Parchment) */}
        <div
          className="relative w-[95%] max-h-[82vh] overflow-y-auto px-5 py-6 sm:px-7 sm:py-7 border-x border-[#cba258]/45"
          style={{
            background:
              'radial-gradient(ellipse at 50% 30%, #fffefb 0%, #faf6eb 55%, #f4ead5 88%, #ece0c7 100%)',
            boxShadow:
              'inset 0 0 35px rgba(160, 120, 60, 0.16), inset 0 14px 16px -10px rgba(25, 15, 5, 0.45), inset 0 -14px 16px -10px rgba(25, 15, 5, 0.45), 0 20px 45px rgba(0, 0, 0, 0.65)',
          }}
        >
          {/* Delicate Antique Inner Filigree Border Frame */}
          <div className="absolute inset-2 sm:inset-2.5 border border-[#cba258]/30 pointer-events-none rounded-[2px]" />
          <div className="absolute inset-3 sm:inset-3.5 border border-[#cba258]/15 pointer-events-none rounded-[1px]" />

          {/* Vintage Ornamental Corner Flourishes */}
          <span className="absolute top-3.5 left-3.5 text-[#a88034]/50 text-[10px] select-none pointer-events-none">
            ❧
          </span>
          <span className="absolute top-3.5 right-3.5 text-[#a88034]/50 text-[10px] select-none pointer-events-none">
            ☙
          </span>
          <span className="absolute bottom-3.5 left-3.5 text-[#a88034]/50 text-[10px] select-none pointer-events-none">
            ❧
          </span>
          <span className="absolute bottom-3.5 right-3.5 text-[#a88034]/50 text-[10px] select-none pointer-events-none">
            ☙
          </span>

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Top Syrian Christian Cross Motif */}
            <div className="flex items-center justify-center gap-1.5 text-[#85601d] mb-1">
              <span className="text-[9px] opacity-70">✦</span>
              <span className="text-lg sm:text-xl font-serif">✝</span>
              <span className="text-[9px] opacity-70">✦</span>
            </div>

            {/* Title: Madhuramveppu Invitation */}
            <h2 className="font-heading text-xs sm:text-sm font-bold tracking-[0.22em] text-[#6e4e13] uppercase drop-shadow-sm">
              Madhuramveppu Invitation
            </h2>

            {/* Malayalam Calligraphy Subtitle */}
            <div className="text-base sm:text-lg text-[#8e6821] malayalam-script mt-0.5 mb-1.5 font-medium">
              മധുരംവെപ്പ്
            </div>

            {/* Graceful Vintage Divider */}
            <div className="flex items-center justify-center gap-2 w-36 sm:w-44 my-1 text-[#b8860b]/60">
              <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#b8860b]/50 to-transparent" />
              <span className="text-[10px]">❦</span>
              <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#b8860b]/50 to-transparent" />
            </div>

            {/* Groom & Bride Section (Spacious Hero) */}
            <div className="my-3 sm:my-4 flex flex-col items-center">
              <span className="font-heading text-[9px] uppercase tracking-[0.3em] text-[#8c7443] font-semibold mb-1 opacity-90">
                Celebrating
              </span>
              <h3 className="font-script text-3xl sm:text-4xl text-[#593e0b] leading-tight drop-shadow-sm px-2">
                Alen Reji
              </h3>
              <span className="font-serif-luxury italic text-xs sm:text-sm text-[#8c7443] my-0.5">
                &amp;
              </span>
              <h3 className="font-script text-3xl sm:text-4xl text-[#593e0b] leading-tight drop-shadow-sm px-2">
                Ammu Sanjayan
              </h3>
            </div>

            {/* Graceful Vintage Divider */}
            <div className="flex items-center justify-center gap-2 w-36 sm:w-44 my-1 text-[#b8860b]/60">
              <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#b8860b]/50 to-transparent" />
              <span className="text-[10px]">❦</span>
              <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#b8860b]/50 to-transparent" />
            </div>

            {/* Minimal & Elegant Event Details */}
            <div className="my-3 sm:my-4 space-y-3 w-full">
              {/* Date & Time */}
              <div className="flex flex-col items-center">
                <span className="font-heading text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-[#8a681c] font-bold mb-0.5">
                  Date &amp; Time
                </span>
                <div className="font-serif-luxury text-sm sm:text-base font-bold text-[#453009] tracking-wide">
                  Friday, 08 January 2027
                </div>
                <div className="font-serif-luxury italic text-xs sm:text-sm text-[#664e24]">
                  6:00 PM Onwards
                </div>
              </div>

              {/* Venue */}
              <div className="flex flex-col items-center pt-1">
                <span className="font-heading text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-[#8a681c] font-bold mb-0.5">
                  Celebration Venue
                </span>
                <div className="font-serif-luxury text-base sm:text-lg font-bold text-[#453009] tracking-wide">
                  The Grand Orchard
                </div>
                <div className="font-serif-luxury text-xs text-[#6e5831] max-w-[240px] leading-snug">
                  St. Thomas Hall &amp; Gardens, Kottayam
                </div>
              </div>
            </div>

            {/* Aesthetic Vintage Google Maps Link Button */}
            <div className="mt-2 mb-3">
              <a
                href="https://maps.google.com/?q=St.+Thomas+Hall+and+Gardens+Kottayam"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-full text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-[#261706] transition-all duration-300 hover:scale-105 active:scale-95 shadow-md cursor-pointer border border-[#cba258]/60 hover:shadow-lg"
                style={{
                  background:
                    'linear-gradient(135deg, #e4c46f 0%, #faeec2 45%, #d1a53e 85%, #e4c46f 100%)',
                }}
              >
                <MapPin className="w-3.5 h-3.5 text-[#261706]" />
                <span>View Venue Map</span>
                <ExternalLink className="w-3 h-3 text-[#261706] opacity-75" />
              </a>
            </div>

            {/* Minimal Romantic Blessing Note */}
            <div className="mt-1 text-[10px] sm:text-[11px] font-serif-luxury italic text-[#7a643b] max-w-[260px] leading-relaxed">
              &ldquo;Together with their families, cordially invite you to celebrate this sweet beginning.&rdquo;
            </div>
          </div>
        </div>

        {/* 3. BOTTOM ROLLER ROD (Realistic Antique Dark Walnut & Gold Brass) */}
        <div className="relative w-full z-20 flex items-center justify-center">
          {/* Left Turned Finial Knob */}
          <div className="absolute -left-3 sm:-left-4 w-6 h-7 sm:w-7 sm:h-8 rounded-full bg-gradient-to-r from-[#1f1205] via-[#613c18] to-[#261506] border border-[#cba258]/60 shadow-[0_3px_8px_rgba(0,0,0,0.6)] flex items-center justify-center">
            <div className="w-2 h-3 sm:w-2.5 sm:h-3.5 rounded-full bg-gradient-to-b from-[#fae28c] via-[#b8860b] to-[#422e03]" />
          </div>

          {/* Central Cylindrical Roller */}
          <div
            className="w-full h-4 sm:h-5 rounded-full"
            style={{
              background:
                'linear-gradient(180deg, #1c1006 0%, #4a2d13 25%, #7a4e23 48%, #caa15a 53%, #593515 75%, #180d04 100%)',
              boxShadow:
                '0 4px 10px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 230, 180, 0.45), inset 0 -1px 2px rgba(0, 0, 0, 0.9)',
            }}
          />

          {/* Right Turned Finial Knob */}
          <div className="absolute -right-3 sm:-right-4 w-6 h-7 sm:w-7 sm:h-8 rounded-full bg-gradient-to-r from-[#261506] via-[#613c18] to-[#1f1205] border border-[#cba258]/60 shadow-[0_3px_8px_rgba(0,0,0,0.6)] flex items-center justify-center">
            <div className="w-2 h-3 sm:w-2.5 sm:h-3.5 rounded-full bg-gradient-to-b from-[#fae28c] via-[#b8860b] to-[#422e03]" />
          </div>
        </div>
      </div>
    </div>
  );
}
