import React, { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import FrameScrollCanvas from './components/FrameScrollCanvas';
import AudioPlayer from './components/AudioPlayer';
import { preloadAllFrames, TOTAL_FRAMES } from './utils/frames';

export default function App() {
  const [progress, setProgress] = useState({ loaded: 0, total: TOTAL_FRAMES, percent: 0 });
  const [isPreloadComplete, setIsPreloadComplete] = useState(false);
  const [images, setImages] = useState([]);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    // Preload all 240 frames
    preloadAllFrames(({ loaded, total, percent }) => {
      setProgress({ loaded, total, percent });
    }).then((loadedImages) => {
      setImages(loadedImages);
      setIsPreloadComplete(true);
    });
  }, []);

  const handleScrollStart = () => {
    if (!hasScrolled) {
      setHasScrolled(true);
    }
  };

  return (
    <div className="relative w-full h-full min-h-screen bg-[#060b08] text-[#faf7f2] overflow-hidden select-none">
      {/* 1. Permanent Frame Canvas: Zero blink, always active with base frame_01 background */}
      <FrameScrollCanvas
        images={images}
        isPreloadComplete={isPreloadComplete}
        onScrollStart={handleScrollStart}
      />

      {/* 2. Warm-white loading overlay & 'Scroll up to start exploring' prompt */}
      <LoadingScreen
        percent={progress.percent}
        isComplete={isPreloadComplete}
        isDismissed={hasScrolled}
      />

      {/* 3. Floating Ambient Audio Player with Mute/Unmute toggle */}
      <AudioPlayer />
    </div>
  );
}
