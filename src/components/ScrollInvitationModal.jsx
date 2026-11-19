import React, { useEffect } from 'react';
import { MapPin, ExternalLink, X, Calendar, Clock, Sparkles } from 'lucide-react';

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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md transition-all duration-300"
      onClick={onClose}
    >
      {/* Scroll Modal Container with Unroll Animation */}
      <div
        className="relative w-full max-w-lg md:max-w-xl flex flex-col items-center animate-scroll-unroll select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button Top-Right */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-2 sm:-top-4 sm:-right-4 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1b3322] border-2 border-[#d4af37] text-[#fbeea4] flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-xl cursor-pointer"
          title="Close Invitation"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. TOP ROLLER ROD */}
        <div className="relative w-full z-20 flex items-center justify-center">
          {/* Left Ornate Finial Knob */}
          <div className="absolute -left-3 sm:-left-5 w-6 h-8 sm:w-8 sm:h-10 rounded-full bg-gradient-to-r from-[#5c4308] via-[#fae28c] to-[#916b15] border border-[#fae28c] shadow-lg flex items-center justify-center">
            <div className="w-2.5 h-3.5 sm:w-3.5 sm:h-4.5 rounded-full bg-gradient-to-b from-[#ffffff] via-[#d4af37] to-[#422e03]" />
          </div>

          {/* Central Cylindrical Roller Rod */}
          <div
            className="w-full h-5 sm:h-6 rounded-full shadow-md"
            style={{
              background:
                'linear-gradient(180deg, #422e03 0%, #b8860b 20%, #fae28c 45%, #ffffff 55%, #d4af37 75%, #422e03 100%)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.45), inset 0 1px 2px rgba(255, 255, 255, 0.6)',
            }}
          />

          {/* Right Ornate Finial Knob */}
          <div className="absolute -right-3 sm:-right-5 w-6 h-8 sm:w-8 sm:h-10 rounded-full bg-gradient-to-r from-[#916b15] via-[#fae28c] to-[#5c4308] border border-[#fae28c] shadow-lg flex items-center justify-center">
            <div className="w-2.5 h-3.5 sm:w-3.5 sm:h-4.5 rounded-full bg-gradient-to-b from-[#ffffff] via-[#d4af37] to-[#422e03]" />
          </div>
        </div>

        {/* 2. SCROLL BODY (WARM WHITE PARCHMENT PAPER) */}
        <div
          className="relative w-[96%] sm:w-[97%] max-h-[78vh] sm:max-h-[82vh] overflow-y-auto px-5 py-6 sm:px-8 sm:py-8 border-x-2 border-[#d4af37]/60"
          style={{
            background:
              'radial-gradient(ellipse at 50% 20%, #ffffff 0%, #fdfcf7 45%, #fbf6ec 80%, #f5ecdc 100%)',
            boxShadow:
              'inset 0 16px 20px -10px rgba(90, 65, 10, 0.35), inset 0 -16px 20px -10px rgba(90, 65, 10, 0.35), 0 15px 40px rgba(0, 0, 0, 0.6)',
          }}
        >
          {/* Subtle Golden Filigree Corner Embellishments */}
          <div className="absolute top-2 left-2 text-[#b8860b]/40 text-xs select-none">
            ❧
          </div>
          <div className="absolute top-2 right-2 text-[#b8860b]/40 text-xs select-none">
            ☙
          </div>
          <div className="absolute bottom-2 left-2 text-[#b8860b]/40 text-xs select-none">
            ❧
          </div>
          <div className="absolute bottom-2 right-2 text-[#b8860b]/40 text-xs select-none">
            ☙
          </div>

          <div className="flex flex-col items-center text-center">
            {/* Top Syrian Christian Cross Motif */}
            <div className="flex items-center justify-center gap-2 text-[#8c6d1f] mb-1">
              <span className="text-xs">✦</span>
              <span className="text-xl sm:text-2xl font-serif">✝</span>
              <span className="text-xs">✦</span>
            </div>

            {/* Title at top first: Madhuramveppu Invitation */}
            <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-extrabold tracking-[0.2em] text-[#7a5913] uppercase drop-shadow-sm">
              Madhuramveppu Invitation
            </h2>

            {/* Malayalam Calligraphy Subtitle */}
            <div className="text-xl sm:text-2xl text-[#a07c24] malayalam-script mt-0.5 mb-1 font-medium">
              മധുരംവെപ്പ്
            </div>

            {/* Elegant Divider */}
            <div className="flex items-center justify-center gap-2 w-full max-w-xs my-2 text-[#b8860b]/70">
              <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#b8860b]/70 to-[#b8860b]" />
              <span className="text-xs">❦</span>
              <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#b8860b]/70 to-[#b8860b]" />
            </div>

            {/* Groom & Bride Names at Top */}
            <div className="my-2 sm:my-3">
              <p className="font-heading text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#8c7443] font-semibold mb-1">
                Celebrating The Sweet Beginning Of
              </p>
              <h3 className="font-script text-4xl sm:text-5xl md:text-6xl text-[#6b4e0e] leading-tight drop-shadow-sm">
                Alen Reji & Ammu Sanjayan
              </h3>
            </div>

            {/* Invitation Prose */}
            <p className="font-serif-luxury italic text-sm sm:text-base text-[#5c4722] max-w-md mx-auto leading-relaxed font-light mb-4">
              Together with their families, cordially invite your gracious presence with family to celebrate the traditional Syrian Christian sweetening evening as they prepare for Holy Matrimony.
            </p>

            {/* Family Details Card */}
            <div className="w-full bg-[#f4ebda]/60 rounded-xl p-3 sm:p-4 border border-[#d4af37]/35 mb-4 text-[#4a391a]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left border-b sm:border-b-0 sm:border-r border-[#d4af37]/30 pb-2 sm:pb-0 sm:pr-3">
                  <span className="font-heading text-[10px] uppercase tracking-wider text-[#8a681c] font-bold">
                    Groom
                  </span>
                  <div className="font-serif-luxury text-base font-bold text-[#6b4e0e]">
                    Alen Reji
                  </div>
                  <div className="text-[11px] text-[#635133] leading-tight mt-0.5">
                    S/o Reji Thomas & Soly Reji
                  </div>
                  <div className="text-[10px] text-[#7a6747]">
                    Sister: Aleena Reji
                  </div>
                  <div className="text-[10px] text-[#7a6747] italic">
                    Chettakulathinkara, Perumbavoor
                  </div>
                </div>

                <div className="flex flex-col items-center sm:items-start text-center sm:text-left pt-1 sm:pt-0 sm:pl-2">
                  <span className="font-heading text-[10px] uppercase tracking-wider text-[#8a681c] font-bold">
                    Bride
                  </span>
                  <div className="font-serif-luxury text-base font-bold text-[#6b4e0e]">
                    Ammu Sanjayan
                  </div>
                  <div className="text-[11px] text-[#635133] leading-tight mt-0.5">
                    D/o Sanjayan Nair & Bindu
                  </div>
                  <div className="text-[10px] text-[#7a6747]">
                    Brother: Dr. Sachu Sanjayan
                  </div>
                  <div className="text-[10px] text-[#7a6747] italic">
                    Sarangi House, Trivandrum
                  </div>
                </div>
              </div>
            </div>

            {/* Date & Time Section */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {/* Date Box */}
              <div className="flex items-center gap-3 bg-[#f7efe0]/80 rounded-xl p-3 border border-[#d4af37]/40 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-[#dfbc4f]/25 flex items-center justify-center text-[#7a5913] shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-heading text-[10px] uppercase tracking-wider text-[#8c7443] font-bold">
                    Day & Date
                  </div>
                  <div className="font-serif-luxury text-base sm:text-lg font-bold text-[#5c4308] leading-tight">
                    Friday, Jan 08, 2027
                  </div>
                  <div className="text-[10px] text-[#7a6747]">
                    Vrischigam 13, 1202 ME
                  </div>
                </div>
              </div>

              {/* Time Box */}
              <div className="flex items-center gap-3 bg-[#f7efe0]/80 rounded-xl p-3 border border-[#d4af37]/40 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-[#dfbc4f]/25 flex items-center justify-center text-[#7a5913] shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-heading text-[10px] uppercase tracking-wider text-[#8c7443] font-bold">
                    Ceremony Time
                  </div>
                  <div className="font-serif-luxury text-base sm:text-lg font-bold text-[#5c4308] leading-tight">
                    6:00 PM IST
                  </div>
                  <div className="text-[10px] text-[#7a6747]">
                    Followed by Dinner & Fellowship
                  </div>
                </div>
              </div>
            </div>

            {/* Venue Details & Map Button */}
            <div className="w-full bg-[#f4ebda]/70 rounded-xl p-4 border border-[#d4af37]/45 mb-4 text-center">
              <div className="inline-flex items-center gap-1.5 text-[#7a5913] mb-1">
                <MapPin className="w-4 h-4 text-[#8a681c]" />
                <span className="font-heading text-xs uppercase tracking-[0.2em] font-bold">
                  Celebration Venue
                </span>
              </div>
              <div className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#5c4308] mb-0.5">
                The Grand Orchard
              </div>
              <div className="text-xs sm:text-sm text-[#635133] mb-3 font-light">
                St. Thomas Hall & Gardens, Kottayam, Kerala
              </div>

              {/* Map Redirection Link Button */}
              <a
                href="https://maps.google.com/?q=St.+Thomas+Hall+and+Gardens+Kottayam"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#0d1e13] transition-all duration-300 hover:scale-105 active:scale-95 shadow-md cursor-pointer border border-[#b8860b]/40"
                style={{
                  background:
                    'linear-gradient(135deg, #dfbc4f 0%, #fbeea4 40%, #cfa12f 80%, #dfbc4f 100%)',
                }}
              >
                <MapPin className="w-4 h-4 text-[#0d1e13]" />
                <span>View on Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#0d1e13]" />
              </a>
            </div>

            {/* Blessing Note */}
            <div className="text-center text-[11px] text-[#7a6747] italic">
              &ldquo;May their sweet journey together be filled with eternal joy, love, and grace.&rdquo;
            </div>

            {/* Bottom Close Button inside Scroll */}
            <button
              onClick={onClose}
              className="mt-4 px-6 py-1.5 rounded-full text-xs tracking-wider uppercase text-[#7a5913] border border-[#d4af37]/50 hover:bg-[#d4af37]/15 transition-colors cursor-pointer"
            >
              Close Scroll
            </button>
          </div>
        </div>

        {/* 3. BOTTOM ROLLER ROD */}
        <div className="relative w-full z-20 flex items-center justify-center">
          {/* Left Ornate Finial Knob */}
          <div className="absolute -left-3 sm:-left-5 w-6 h-8 sm:w-8 sm:h-10 rounded-full bg-gradient-to-r from-[#5c4308] via-[#fae28c] to-[#916b15] border border-[#fae28c] shadow-lg flex items-center justify-center">
            <div className="w-2.5 h-3.5 sm:w-3.5 sm:h-4.5 rounded-full bg-gradient-to-b from-[#ffffff] via-[#d4af37] to-[#422e03]" />
          </div>

          {/* Central Cylindrical Roller Rod */}
          <div
            className="w-full h-5 sm:h-6 rounded-full shadow-md"
            style={{
              background:
                'linear-gradient(180deg, #422e03 0%, #b8860b 20%, #fae28c 45%, #ffffff 55%, #d4af37 75%, #422e03 100%)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.45), inset 0 1px 2px rgba(255, 255, 255, 0.6)',
            }}
          />

          {/* Right Ornate Finial Knob */}
          <div className="absolute -right-3 sm:-right-5 w-6 h-8 sm:w-8 sm:h-10 rounded-full bg-gradient-to-r from-[#916b15] via-[#fae28c] to-[#5c4308] border border-[#fae28c] shadow-lg flex items-center justify-center">
            <div className="w-2.5 h-3.5 sm:w-3.5 sm:h-4.5 rounded-full bg-gradient-to-b from-[#ffffff] via-[#d4af37] to-[#422e03]" />
          </div>
        </div>
      </div>
    </div>
  );
}
