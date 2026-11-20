import React, { useEffect, useRef, useCallback, useState } from 'react';
import { TOTAL_FRAMES, MADHUREM_FRAMES } from '../utils/frames';

const FRAME_160_INDEX = 159; // 0-based index for madhurem/frame_160.jpg (start slow fade-in)
const MADHUREM_END_INDEX = MADHUREM_FRAMES - 1; // 168: 0-based index for madhurem/frame_169.jpg
const DETAILS_START_INDEX = MADHUREM_FRAMES; // 169: 0-based index for details/frame_01.jpg
const FINAL_FRAME_INDEX = TOTAL_FRAMES - 1; // 408: 0-based index for details/frame_240.jpg

export default function FrameScrollCanvas({
  images,
  isPreloadComplete = true,
  onScrollStart,
}) {
  const canvasRef = useRef(null);

  // Cached screen & canvas dimensions to eliminate layout thrashing
  const dimensionsRef = useRef({ width: 0, height: 0, dpr: 1 });

  // Preload and onScrollStart refs for listener access without re-binding
  const isPreloadCompleteRef = useRef(isPreloadComplete);
  useEffect(() => {
    isPreloadCompleteRef.current = isPreloadComplete;
  }, [isPreloadComplete]);

  const onScrollStartRef = useRef(onScrollStart);
  useEffect(() => {
    onScrollStartRef.current = onScrollStart;
  }, [onScrollStart]);

  // Smooth lerp scrolling state
  const targetScrollRef = useRef(0);
  const currentScrollRef = useRef(0);
  const renderedFrameRef = useRef(0);

  // Smooth crossfade state for frame 169 and seamless transitions
  const targetAlphaRef = useRef(0);
  const overlayAlphaRef = useRef(0);
  const stayUntilRef = useRef(0);
  const hasStayedRef = useRef(false);

  // Second page state (fullscreen second.png image)
  const [isSecondPageVisible, setIsSecondPageVisible] = useState(false);
  const isSecondPageVisibleRef = useRef(false);
  const lastToggleTimeRef = useRef(0);

  const rAFRef = useRef(null);

  // Preload second.png in memory
  useEffect(() => {
    const img = new Image();
    img.src = '/second.png';
  }, []);

  // High-performance image render helper with cover fitting
  const renderImageToCtx = useCallback((ctx, img, width, height, alpha = 1, baseAspect = null) => {
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const aspect = baseAspect || img.naturalWidth / img.naturalHeight;
    const screenAspect = width / height;

    let drawW, drawH, drawX, drawY;

    if (screenAspect > aspect) {
      // Widescreen / desktop
      drawW = width;
      drawH = width / aspect;
      drawX = 0;
      drawY = (height - drawH) * 0.45;
    } else {
      // Portrait / mobile
      drawH = height;
      drawW = height * aspect;
      drawX = (width - drawW) / 2;
      drawY = 0;
    }

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    ctx.restore();
  }, []);

  // Draw frame on canvas using cached dimensions
  const drawFrame = useCallback(
    (frameIndex, overlayAlpha = 0, seamAlpha = 0) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return;

      const baseImg = images && images[frameIndex];
      if (!baseImg || !baseImg.complete || baseImg.naturalWidth === 0) return;

      const { width, height, dpr } = dimensionsRef.current;
      if (width === 0 || height === 0) return;

      ctx.save();
      ctx.scale(dpr, dpr);

      // Deep dark background fill
      ctx.fillStyle = '#060b08';
      ctx.fillRect(0, 0, width, height);

      const baseAspect = baseImg.naturalWidth / baseImg.naturalHeight;

      // 1. Draw base frame
      renderImageToCtx(ctx, baseImg, width, height, 1, baseAspect);

      // 2. Draw frame_169 overlay if overlayAlpha > 0 (during 160..168 transition)
      if (overlayAlpha > 0.005 && images && images[MADHUREM_END_INDEX]) {
        renderImageToCtx(
          ctx,
          images[MADHUREM_END_INDEX],
          width,
          height,
          Math.min(1, Math.max(0, overlayAlpha)),
          baseAspect
        );
      }

      // 3. Draw seamless seam crossfade into details/frame_01 at transition point
      if (seamAlpha > 0.005 && images && images[DETAILS_START_INDEX]) {
        renderImageToCtx(
          ctx,
          images[DETAILS_START_INDEX],
          width,
          height,
          Math.min(1, Math.max(0, seamAlpha)),
          baseAspect
        );
      }

      ctx.restore();
    },
    [images, renderImageToCtx]
  );

  // Resize listener: updates dimensions and resizes canvas buffer only when changed
  const updateDimensions = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    dimensionsRef.current = { width, height, dpr };

    const targetW = Math.round(width * dpr);
    const targetH = Math.round(height * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    drawFrame(renderedFrameRef.current, overlayAlphaRef.current, 0);
  }, [drawFrame]);

  useEffect(() => {
    updateDimensions();

    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateDimensions, 100);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, [updateDimensions]);

  // Initial draw
  useEffect(() => {
    if (images && images.length > 0) {
      drawFrame(0, 0, 0);
    }
  }, [images, drawFrame]);

  // Unified 60fps/120fps animation loop with faster, responsive momentum lerp
  useEffect(() => {
    let active = true;

    const loop = () => {
      if (!active) return;

      let needsDraw = false;

      // 1. Smoothly interpolate currentScroll towards targetScroll (0.24 for snappier follow)
      const scrollDiff = targetScrollRef.current - currentScrollRef.current;
      if (Math.abs(scrollDiff) > 0.005) {
        currentScrollRef.current += scrollDiff * 0.24;
      } else if (currentScrollRef.current !== targetScrollRef.current) {
        currentScrollRef.current = targetScrollRef.current;
      }

      // Notify parent when scrolling advances past initial position
      if (onScrollStartRef.current && currentScrollRef.current > 0.3) {
        onScrollStartRef.current();
      }

      const currentScroll = currentScrollRef.current;
      const frameToDraw = Math.min(
        FINAL_FRAME_INDEX,
        Math.max(0, Math.floor(currentScroll))
      );

      if (frameToDraw !== renderedFrameRef.current) {
        renderedFrameRef.current = frameToDraw;
        needsDraw = true;
      }

      // 2. Slowly fade in frame_169 starting from frame_160 up to frame 168
      if (currentScroll >= FRAME_160_INDEX && currentScroll <= MADHUREM_END_INDEX) {
        const fadeProgress =
          (currentScroll - FRAME_160_INDEX) / (MADHUREM_END_INDEX - FRAME_160_INDEX);
        targetAlphaRef.current = Math.min(1, Math.max(0, fadeProgress));
      } else {
        targetAlphaRef.current = 0;
      }

      // Smoothly interpolate overlayAlpha towards targetAlpha
      const alphaDiff = targetAlphaRef.current - overlayAlphaRef.current;
      if (Math.abs(alphaDiff) > 0.005) {
        overlayAlphaRef.current += alphaDiff * 0.18;
        needsDraw = true;
      } else if (overlayAlphaRef.current !== targetAlphaRef.current) {
        overlayAlphaRef.current = targetAlphaRef.current;
        needsDraw = true;
      }

      // 3. Seam crossfade between frame 168 (madhurem/frame_169) and 169 (details/frame_01)
      let seamAlpha = 0;
      if (currentScroll >= MADHUREM_END_INDEX && currentScroll < DETAILS_START_INDEX) {
        seamAlpha = currentScroll - MADHUREM_END_INDEX;
        needsDraw = true;
      }

      // 4. Track initial stay duration for final frame (details/frame_240 at FINAL_FRAME_INDEX)
      if (currentScroll >= FINAL_FRAME_INDEX - 0.2 && !hasStayedRef.current) {
        hasStayedRef.current = true;
        stayUntilRef.current = performance.now() + 1800; // 1.8s gentle stay
      } else if (currentScroll < FINAL_FRAME_INDEX - 1.5) {
        hasStayedRef.current = false;
        stayUntilRef.current = 0;
      }

      // 5. Redraw canvas only when required
      if (needsDraw) {
        drawFrame(renderedFrameRef.current, overlayAlphaRef.current, seamAlpha);
      }

      rAFRef.current = requestAnimationFrame(loop);
    };

    rAFRef.current = requestAnimationFrame(loop);

    return () => {
      active = false;
      if (rAFRef.current) {
        cancelAnimationFrame(rAFRef.current);
      }
    };
  }, [drawFrame]);

  // Seamless bidirectional scroll and swipe input handling
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;
    let lastTouchX = 0;
    let lastTouchY = 0;

    const handleDelta = (deltaY, isSwipe = false) => {
      if (!isPreloadCompleteRef.current) return;

      // Notify parent when forward scroll gesture starts
      if (onScrollStartRef.current && deltaY > 1.5) {
        onScrollStartRef.current();
      }

      const now = performance.now();

      // Case 1: Currently on the Second Page
      if (isSecondPageVisibleRef.current) {
        if (deltaY > 0) return; // Keep on second page

        // Scrolling up slides back to final frame of details
        if (deltaY < -10 && now - lastToggleTimeRef.current > 350) {
          lastToggleTimeRef.current = now;
          isSecondPageVisibleRef.current = false;
          setIsSecondPageVisible(false);
          targetScrollRef.current = FINAL_FRAME_INDEX;
          currentScrollRef.current = FINAL_FRAME_INDEX;
          return;
        }
        return;
      }

      // Case 2: On Final Frame (at FINAL_FRAME_INDEX with details/frame_240)
      const isAtEnd = targetScrollRef.current >= FINAL_FRAME_INDEX - 0.5;

      if (isAtEnd) {
        // Scrolling up immediately breaks any stay and scrolls backward seamlessly
        if (deltaY < 0) {
          stayUntilRef.current = 0;
          const step = Math.min(-1, deltaY * (isSwipe ? 0.35 : 0.22));
          targetScrollRef.current = Math.max(0, targetScrollRef.current + step);
          return;
        }

        // Scrolling down: checks whether 1.8s stay is active for gentle resistance
        const isStaying = stayUntilRef.current > 0 && now < stayUntilRef.current;
        const threshold = isStaying ? 35 : 12;

        if (deltaY > threshold && now - lastToggleTimeRef.current > 350) {
          lastToggleTimeRef.current = now;
          isSecondPageVisibleRef.current = true;
          setIsSecondPageVisible(true);
          return;
        }
        return;
      }

      // Case 3: Normal Scrubbing between Frame 0 and FINAL_FRAME_INDEX (Forward & Backward)
      // Faster, responsive scrubbing speed as requested ("little more fast")
      const scale = isSwipe ? 0.35 : 0.22;
      const step = deltaY * scale;

      targetScrollRef.current = Math.max(
        0,
        Math.min(FINAL_FRAME_INDEX, targetScrollRef.current + step)
      );
    };

    const handleWheel = (e) => {
      e.preventDefault();
      let delta = e.deltaY;
      if (e.deltaMode === 1) {
        delta *= 25; // Line-based scroll normalization
      }
      handleDelta(delta, false);
    };

    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      lastTouchX = touchStartX;
      lastTouchY = touchStartY;
    };

    const handleTouchMove = (e) => {
      if (e.cancelable) {
        e.preventDefault();
      }
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const deltaY = lastTouchY - currentY;
      const deltaX = lastTouchX - currentX;
      lastTouchX = currentX;
      lastTouchY = currentY;

      // Swiping right on second page slides back to final frame
      if (isSecondPageVisibleRef.current && deltaX < -12 && Math.abs(deltaX) > Math.abs(deltaY)) {
        handleDelta(-30, true);
        return;
      }

      // Swiping left on final frame slides to second page
      if (
        !isSecondPageVisibleRef.current &&
        targetScrollRef.current >= FINAL_FRAME_INDEX - 0.5 &&
        deltaX > 12 &&
        Math.abs(deltaX) > Math.abs(deltaY)
      ) {
        handleDelta(40, true);
        return;
      }

      handleDelta(deltaY, true);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-black select-none z-10 touch-none">
      {/* Synchronized Horizontal Slider Track: Canvas Stage and Second Page touching edge-to-edge */}
      <div
        className="absolute top-0 left-0 w-[200vw] h-full flex flex-row transition-transform duration-600 ease-out will-change-transform"
        style={{
          transform: isSecondPageVisible ? 'translate3d(-100vw, 0, 0)' : 'translate3d(0vw, 0, 0)',
          border: 'none',
          boxShadow: 'none',
          outline: 'none',
        }}
      >
        {/* Panel 1: Stage Canvas (Madhurem 1..169 and Details 1..240 seamlessly combined) */}
        <div className="relative w-screen h-full overflow-hidden bg-[#060b08] shrink-0">
          {/* Pristine base frame_01 image underneath canvas to eliminate any canvas initialization blink */}
          <img
            src="/madhurem/frame_01.jpg"
            alt="Wedding Stage"
            className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none"
          />
          <canvas
            ref={canvasRef}
            className="relative z-10 w-full h-full object-cover select-none pointer-events-none"
          />
        </div>

        {/* Panel 2: Second Page Fullscreen Image touching Panel 1 on the right */}
        <div
          className="relative w-screen h-full overflow-hidden bg-[#060b08] shrink-0 select-none flex items-center justify-center"
          style={{
            border: 'none',
            boxShadow: 'none',
            outline: 'none',
          }}
        >
          <img
            src="/second.png"
            alt="Wedding Invitation Details"
            className="w-full h-full object-cover object-center select-none pointer-events-none"
            style={{
              border: 'none',
              boxShadow: 'none',
              outline: 'none',
            }}
          />
        </div>
      </div>
    </div>
  );
}
