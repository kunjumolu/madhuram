import React, { useState } from 'react';
import { X, Heart, CheckCircle2, Send } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RSVPModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    guests: '1',
    diet: 'both',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    // Launch celebratory gold and cream confetti
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#fbeea4', '#ffffff', '#e8c35a'],
      });
    } catch (err) {
      // Ignored if confetti fails
    }
  };

  const handleWhatsAppRSVP = () => {
    const text = `*Madhuramveppu RSVP for Alen & Ammu*\n\nName: ${formData.name || 'A Guest'}\nGuests: ${formData.guests}\nWishes: ${formData.message || 'Hearty congratulations!'}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg luxury-glass rounded-3xl p-6 sm:p-8 border border-[#d4af37]/40 shadow-2xl text-[#faf7f2]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-[#d4af37] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            <div className="text-center mb-6">
              <span className="font-heading text-xs uppercase tracking-[0.25em] text-[#d4af37]">
                Celebrate With Us
              </span>
              <h3 className="font-script text-4xl sm:text-5xl text-[#faf7f2] mt-1">
                Confirm Your Presence
              </h3>
              <p className="font-serif-luxury text-sm text-[#c9bea7] mt-1">
                Please let us know by November 20th so we may prepare your feast.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#d4af37] mb-1 font-sans-ui">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Thomas Mathew & Family"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-[#d4af37]/30 focus:border-[#d4af37] focus:outline-none text-[#faf7f2] placeholder-[#8a7f6c] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#d4af37] mb-1 font-sans-ui">
                  Number of Attendees
                </label>
                <select
                  value={formData.guests}
                  onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#091711] border border-[#d4af37]/30 focus:border-[#d4af37] focus:outline-none text-[#faf7f2] text-sm"
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="5+">5+ Guests (Family)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#d4af37] mb-1 font-sans-ui">
                  Warm Wishes / Message for the Couple
                </label>
                <textarea
                  rows="3"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="May God bless Alen & Ammu with eternal joy..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-[#d4af37]/30 focus:border-[#d4af37] focus:outline-none text-[#faf7f2] placeholder-[#8a7f6c] text-sm resize-none"
                />
              </div>

              <div className="pt-2 flex flex-col gap-2.5">
                <button type="submit" className="btn-gold w-full flex items-center justify-center gap-2">
                  <Heart className="w-4 h-4 fill-current" />
                  <span>Confirm RSVP</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppRSVP}
                  className="btn-outline-gold w-full flex items-center justify-center gap-2 text-xs py-2.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send RSVP via WhatsApp</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-8">
            <CheckCircle2 className="w-16 h-16 text-[#d4af37] mx-auto mb-4 animate-bounce" />
            <h3 className="font-script text-4xl sm:text-5xl gold-text-shimmer mb-2">
              Thank You!
            </h3>
            <p className="font-serif-luxury text-lg text-[#faf7f2] mb-3">
              Your response has been warmly received.
            </p>
            <p className="text-xs text-[#c9bea7] max-w-sm mx-auto mb-6">
              Alen, Ammu, and both families are deeply excited to welcome you and share the sweetness of this blessed night.
            </p>
            <button onClick={onClose} className="btn-gold text-xs px-6 py-2.5">
              Back to Invitation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
