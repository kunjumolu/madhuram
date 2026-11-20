import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function ScrollInvitationModal({ isOpen, onClose }) {
  const [shouldRender, setShouldRender] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
    } else if (shouldRender && !isClosing) {
      triggerClose();
    }
  }, [isOpen]);

  const triggerClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      setShouldRender(false);
      setIsClosing(false);
      onClose();
    }, 300); // Matches popup3DClose duration
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && shouldRender) {
        triggerClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shouldRender, isClosing]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/15 backdrop-blur-[2px] transition-opacity duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={triggerClose}
    >
      {/* 3D Animated Image Popup Container */}
      <div
        className={`relative w-[82vw] max-w-[400px] sm:max-w-[450px] max-h-[82vh] flex items-center justify-center select-none ${
          isClosing ? 'animate-3d-close' : 'animate-3d-open'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Minimal Floating Close Button */}
        <button
          onClick={triggerClose}
          className="absolute -top-3.5 -right-3.5 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/75 hover:bg-black text-[#faf7f2] border border-white/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl cursor-pointer hover:rotate-90"
          title="Close Invitation"
        >
          <X className="w-4 h-4" />
        </button>

        {/* The Invitation Details Image (popup.png) */}
        <img
          src="/popup.png"
          alt="Invitation Details"
          className="w-full h-auto max-h-[80vh] object-contain rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6),0_4px_15px_rgba(0,0,0,0.3)] pointer-events-auto"
        />
      </div>
    </div>
  );
}
