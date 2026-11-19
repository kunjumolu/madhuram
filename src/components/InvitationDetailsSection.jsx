import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  Share2,
  CalendarPlus,
  Utensils,
  Music,
  CheckCircle,
  ExternalLink,
  ArrowUp,
} from 'lucide-react';

export default function InvitationDetailsSection({ onOpenRSVP, onBackToFrames }) {
  const handleAddToCalendar = () => {
    // Generate .ics calendar file content
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Madhuramveppu Invitation//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:Madhuramveppu Celebration — Alen & Ammu
DESCRIPTION:Traditional Madhuramveppu Pre-wedding Sweetening Ceremony of Alen Reji & Ammu Sanjayan.
LOCATION:St. Thomas Hall & Gardens, Kottayam, Kerala
DTSTART:20261128T130000Z
DTEND:20261128T163000Z
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Alen_and_Ammu_Madhuramveppu.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Madhuramveppu — Alen & Ammu',
          text: 'Join us for the Madhuramveppu celebration of Alen Reji & Ammu Sanjayan!',
          url: window.location.href,
        });
      } catch (err) {
        // Ignored if user cancels share dialog
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Invitation link copied to clipboard! Share it with family and friends.');
    }
  };

  return (
    <section className="relative z-30 w-full min-h-screen py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#060b08] via-[#091711] to-[#040806]">
      {/* Decorative Golden Ambient Backdrops */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#d4af37] via-transparent to-transparent" />

      <div className="max-w-5xl mx-auto flex flex-col items-center">
        {/* Back to frames button */}
        {onBackToFrames && (
          <button
            onClick={onBackToFrames}
            className="btn-outline-gold mb-6 flex items-center gap-2 text-xs py-2 px-5 hover:border-[#d4af37]"
          >
            <ArrowUp className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Return to Stage View</span>
          </button>
        )}

        {/* Top Ornament */}
        <div className="flex items-center gap-3 text-[#d4af37] mb-4">
          <div className="w-12 sm:w-20 h-[1px] bg-gradient-to-r from-transparent to-[#d4af37]" />
          <span className="font-heading text-xs uppercase tracking-[0.3em] text-[#fbeea4]">
            Formal Invitation
          </span>
          <div className="w-12 sm:w-20 h-[1px] bg-gradient-to-l from-transparent to-[#d4af37]" />
        </div>

        {/* Malayalam Calligraphy Title */}
        <div className="text-3xl sm:text-4xl text-[#f3df9b] malayalam-script mb-2 drop-shadow">
          മധുരംവെപ്പ്
        </div>

        {/* Main Names */}
        <h2 className="font-script text-5xl sm:text-7xl md:text-8xl text-center gold-text-shimmer leading-tight mb-4">
          Alen Reji & Ammu Sanjayan
        </h2>

        <p className="font-serif-luxury italic text-center text-lg sm:text-2xl text-[#dcd1ba] max-w-2xl mb-12 font-light">
          Together with their families, cordially invite you to celebrate the traditional sweetening evening as they prepare for Holy Matrimony.
        </p>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-16">
          {/* Card 1: Date */}
          <div className="luxury-glass rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center group hover:border-[#d4af37]/60 transition-all duration-300">
            <div className="w-14 h-14 rounded-full bg-[#d4af37]/15 flex items-center justify-center text-[#d4af37] mb-4 group-hover:scale-110 transition-transform">
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className="font-heading text-xs uppercase tracking-[0.2em] text-[#c9bea7] mb-1">
              Date
            </h3>
            <div className="font-serif-luxury text-2xl sm:text-3xl font-semibold text-[#faf7f2] mb-1">
              Saturday
            </div>
            <div className="font-heading text-xl text-[#fbeea4] mb-2">
              November 28, 2026
            </div>
            <span className="text-xs text-[#a3947b]">
              Vrischigam 13, 1202 ME
            </span>
          </div>

          {/* Card 2: Time */}
          <div className="luxury-glass rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center group hover:border-[#d4af37]/60 transition-all duration-300">
            <div className="w-14 h-14 rounded-full bg-[#d4af37]/15 flex items-center justify-center text-[#d4af37] mb-4 group-hover:scale-110 transition-transform">
              <Clock className="w-7 h-7" />
            </div>
            <h3 className="font-heading text-xs uppercase tracking-[0.2em] text-[#c9bea7] mb-1">
              Time
            </h3>
            <div className="font-serif-luxury text-2xl sm:text-3xl font-semibold text-[#faf7f2] mb-1">
              6:30 PM IST
            </div>
            <div className="font-heading text-sm text-[#fbeea4] mb-2 tracking-wide">
              Evening Fellowship
            </div>
            <span className="text-xs text-[#a3947b]">
              Followed by Madhuramveppu & Dinner
            </span>
          </div>

          {/* Card 3: Venue */}
          <div className="luxury-glass rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center group hover:border-[#d4af37]/60 transition-all duration-300">
            <div className="w-14 h-14 rounded-full bg-[#d4af37]/15 flex items-center justify-center text-[#d4af37] mb-4 group-hover:scale-110 transition-transform">
              <MapPin className="w-7 h-7" />
            </div>
            <h3 className="font-heading text-xs uppercase tracking-[0.2em] text-[#c9bea7] mb-1">
              Venue
            </h3>
            <div className="font-serif-luxury text-2xl sm:text-3xl font-semibold text-[#faf7f2] mb-1">
              The Grand Orchard
            </div>
            <div className="text-sm text-[#fbeea4] mb-3">
              St. Thomas Garden Grounds, Kottayam
            </div>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#d4af37] hover:underline"
            >
              <span>View on Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Traditional Program Flow */}
        <div className="w-full luxury-glass rounded-3xl p-6 sm:p-10 mb-16 border border-[#d4af37]/25">
          <div className="text-center mb-8">
            <span className="font-heading text-xs uppercase tracking-[0.25em] text-[#d4af37]">
              Evening Schedule
            </span>
            <h3 className="font-script text-4xl sm:text-5xl text-[#faf7f2] mt-1">
              Programme Timeline
            </h3>
          </div>

          <div className="space-y-6 max-w-2xl mx-auto">
            {[
              {
                time: '06:30 PM',
                title: 'Arrival & Welcome Drinks',
                desc: 'Guests arrive to the candlelit garden with warm fellowship & refreshing welcome drinks.',
                icon: Utensils,
              },
              {
                time: '07:00 PM',
                title: 'Solemn Prayer & Thanksgiving',
                desc: 'Offering praise and seeking the Almighty’s grace upon Alen & Ammu.',
                icon: Heart,
              },
              {
                time: '07:30 PM',
                title: 'The Madhuramveppu Ceremony',
                desc: 'Elders, family, and loved ones feed the traditional sweet delicacies and palchor to the bride & groom.',
                icon: CheckCircle,
              },
              {
                time: '08:15 PM',
                title: 'Cake Cutting & Musical Celebration',
                desc: 'Toasting to eternal joy with celebratory cake, joyful music, and laughter.',
                icon: Music,
              },
              {
                time: '08:45 PM',
                title: 'Grand Festive Dinner',
                desc: 'A lavish Kerala banquet served with love for all our cherished guests.',
                icon: Utensils,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 sm:gap-6 p-4 rounded-xl hover:bg-white/[0.03] transition-colors border-l-2 border-[#d4af37]/40"
              >
                <div className="font-mono text-sm sm:text-base font-semibold text-[#d4af37] pt-0.5 whitespace-nowrap">
                  {item.time}
                </div>
                <div className="flex-1">
                  <h4 className="font-serif-luxury text-lg sm:text-xl font-semibold text-[#faf7f2]">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#b8ab95] mt-0.5 font-light">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Culture & Meaning Card */}
        <div className="w-full max-w-3xl luxury-glass-light rounded-2xl p-6 sm:p-8 text-center mb-16 border border-[#d4af37]/20">
          <h4 className="font-heading text-sm uppercase tracking-[0.2em] text-[#d4af37] mb-2">
            The Meaning of Madhuramveppu
          </h4>
          <p className="font-serif-luxury text-base sm:text-lg text-[#ded3be] leading-relaxed font-light">
            In Syrian Christian culture of Kerala, Madhuramveppu (&ldquo;giving of sweets&rdquo;) is an age-old tradition celebrated on the eve of holy matrimony. As sweet rice porridge (palchor) and confectionery are blessed and placed in the mouths of the couple, prayers are whispered that their married life together may be saturated with kindness, sweetness, mutual devotion, and divine abundance.
          </p>
        </div>

        {/* Action Buttons: RSVP, Add to Calendar, Share */}
        <div className="flex flex-wrap items-center justify-center gap-4 w-full">
          <button onClick={onOpenRSVP} className="btn-gold flex items-center gap-2">
            <Heart className="w-4 h-4 fill-current" />
            <span>RSVP for Celebration</span>
          </button>

          <button
            onClick={handleAddToCalendar}
            className="btn-outline-gold flex items-center gap-2"
          >
            <CalendarPlus className="w-4 h-4 text-[#d4af37]" />
            <span>Add to Calendar</span>
          </button>

          <button
            onClick={handleShare}
            className="btn-outline-gold flex items-center gap-2"
          >
            <Share2 className="w-4 h-4 text-[#d4af37]" />
            <span>Share Invitation</span>
          </button>
        </div>

        {/* Footer Note */}
        <footer className="mt-20 text-center text-xs text-[#8e826e] space-y-2">
          <p className="font-script text-2xl text-[#d4af37]">
            With loving prayers from the Reji & Sanjayan Families
          </p>
          <p className="tracking-wider uppercase text-[10px]">
            We look forward to blessing this sweet beginning with you
          </p>
        </footer>
      </div>
    </section>
  );
}
