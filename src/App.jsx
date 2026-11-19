import React, { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import FrameScrollCanvas from './components/FrameScrollCanvas';
import AudioPlayer from './components/AudioPlayer';
import { preloadAllFrames, TOTAL_FRAMES } from './utils/frames';

export default function App() {
  const [progress, setProgress] = useState({ loaded: 0, total: TOTAL_FRAMES, percent: 0 });
  const [isPreloadComplete, setIsPreloadComplete] = useState(false);
  const [images, setImages] = useState([]);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    // Preload all 240 frames
    preloadAllFrames(({ loaded, total, percent }) => {
      setProgress({ loaded, total, percent });
    }).then((loadedImages) => {
      setImages(loadedImages);
      setIsPreloadComplete(true);
    });
  }, []);

  const handleFinishLoading = () => {
    window.scrollTo(0, 0);
    setHasEntered(true);
  };

  return (
    <div className="relative w-full h-full min-h-screen bg-[#060b08] text-[#faf7f2] overflow-hidden select-none">
      {/* 1. Minimal Loading Page: Only Loading and Percentage */}
      {!hasEntered && (
        <LoadingScreen
          percent={progress.percent}
          isComplete={isPreloadComplete}
          onFinish={handleFinishLoading}
        />
      )}

      {/* 2. Only the Landing Page (Stage Frame-by-Frame Scroll) */}
      {hasEntered && (
        <>
          <FrameScrollCanvas images={images} />
          <AudioPlayer />
        </>
      )}
    </div>
  );
}
