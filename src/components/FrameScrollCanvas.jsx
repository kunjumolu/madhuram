import React, { useEffect, useRef, useCallback, useState } from 'react';
import { TOTAL_FRAMES, MADHUREM_FRAMES } from '../utils/frames';

const FRAME_160_INDEX = 159; // 0-based index for madhurem/frame_160.jpg (start slow fade-in)
const MADHUREM_END_INDEX = MADHUREM_FRAMES - 1; // 168: 0-based index for madhurem/frame_169.jpg
const DETAILS_START_INDEX = MADHUREM_FRAMES; // 169: 0-based index for details/frame_01.jpg
const FINAL_FRAME_INDEX = TOTAL_FRAMES - 1; // 408: 0-based index for details/frame_240.jpg

// Compute exact object-cover layout rectangle for board.png (aspect 941 / 1672)
function getCoverLayout(containerWidth, containerHeight, imageAspect = 941 / 1672) {
  if (!containerWidth || !containerHeight) {
    return { width: 0, height: 0, left: 0, top: 0 };
  }
  const screenAspect = containerWidth / containerHeight;
  let w, h, left, top;
  if (screenAspect > imageAspect) {
    // Desktop / widescreen
    w = containerWidth;
    h = containerWidth / imageAspect;
    left = 0;
    top = (containerHeight - h) / 2;
  } else {
    // Mobile / portrait
    h = containerHeight;
    w = containerHeight * imageAspect;
    left = (containerWidth - w) / 2;
    top = 0;
  }
  return {
    width: Math.round(w),
    height: Math.round(h),
    left: Math.round(left),
    top: Math.round(top),
  };
}

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

  // Board Page state (Panel 2 with board.png)
  const [isSecondPageVisible, setIsSecondPageVisible] = useState(false);
  const isSecondPageVisibleRef = useRef(false);
  const lastToggleTimeRef = useRef(0);

  // Board zoom state (zooms directly in to RSVP button on scroll)
  const targetBoardZoomRef = useRef(1);
  const currentBoardZoomRef = useRef(1);
  const boardWrapperRef = useRef(null);

  // Responsive Board Layout Rect
  const [boardLayout, setBoardLayout] = useState(() => {
    if (typeof window !== 'undefined') {
      return getCoverLayout(window.innerWidth, window.innerHeight);
    }
    return { width: 0, height: 0, left: 0, top: 0 };
  });

  // Paper popup modal state
  const [isPaperPopupOpen, setIsPaperPopupOpen] = useState(false);
  const isPaperPopupOpenRef = useRef(false);
  useEffect(() => {
    isPaperPopupOpenRef.current = isPaperPopupOpen;
  }, [isPaperPopupOpen]);

  const rAFRef = useRef(null);

  // Preload board, rsvp button, and paper images in memory
  useEffect(() => {
    const img1 = new Image();
    img1.src = '/board.png';
    const img2 = new Image();
    img2.src = '/rsvp button.png';
    const img3 = new Image();
    img3.src = '/paper.png';
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
    setBoardLayout(getCoverLayout(width, height));

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

  // Unified 60fps/120fps animation loop with momentum lerp and smooth board zoom
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

      // 2. Slowly fade in frame_169 starting from frame_160 up 
      // to frame 168
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

      // 5. Smooth hardware-accelerated zoom interpolation on the board page
      const zoomDiff = targetBoardZoomRef.current - currentBoardZoomRef.current;
      if (Math.abs(zoomDiff) > 0.001) {
        currentBoardZoomRef.current += zoomDiff * 0.22;
        if (boardWrapperRef.current) {
          boardWrapperRef.current.style.transform = `scale(${currentBoardZoomRef.current})`;
        }
      } else if (currentBoardZoomRef.current !== targetBoardZoomRef.current) {
        currentBoardZoomRef.current = targetBoardZoomRef.current;
        if (boardWrapperRef.current) {
          boardWrapperRef.current.style.transform = `scale(${currentBoardZoomRef.current})`;
        }
      }

      // 6. Redraw canvas only when required
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

      // Case 1: Currently on the Board Page (Second Page)
      if (isSecondPageVisibleRef.current) {
        // If paper popup is currently open, do not zoom or navigate
        if (isPaperPopupOpenRef.current) return;

        // Scrolling down (deltaY > 0): zoom in directly towards the RSVP button
        if (deltaY > 0) {
          const zoomStep = deltaY * (isSwipe ? 0.0032 : 0.0018);
          targetBoardZoomRef.current = Math.min(2.4, targetBoardZoomRef.current + zoomStep);
          return;
        }

        // Scrolling up (deltaY < 0):
        if (deltaY < 0) {
          // If currently zoomed in, zoom out first towards 1.0
          if (targetBoardZoomRef.current > 1.02) {
            const zoomStep = Math.abs(deltaY) * (isSwipe ? 0.0032 : 0.0018);
            targetBoardZoomRef.current = Math.max(1.0, targetBoardZoomRef.current - zoomStep);
            return;
          }

          // If at minimum zoom (1.0), scrolling up slides back to final canvas frame
          if (deltaY < -10 && now - lastToggleTimeRef.current > 350) {
            lastToggleTimeRef.current = now;
            isSecondPageVisibleRef.current = false;
            setIsSecondPageVisible(false);
            targetBoardZoomRef.current = 1.0;
            currentBoardZoomRef.current = 1.0;
            if (boardWrapperRef.current) {
              boardWrapperRef.current.style.transform = 'scale(1)';
            }
            targetScrollRef.current = FINAL_FRAME_INDEX;
            currentScrollRef.current = FINAL_FRAME_INDEX;
            return;
          }
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
          targetBoardZoomRef.current = 1.0;
          currentBoardZoomRef.current = 1.0;
          if (boardWrapperRef.current) {
            boardWrapperRef.current.style.transform = 'scale(1)';
          }
          return;
        }
        return;
      }

      // Case 3: Normal Scrubbing between Frame 0 and FINAL_FRAME_INDEX (Forward & Backward)
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

      // Swiping right on board page (if zoomed out) slides back to final frame
      if (
        isSecondPageVisibleRef.current &&
        !isPaperPopupOpenRef.current &&
        deltaX < -15 &&
        Math.abs(deltaX) > Math.abs(deltaY)
      ) {
        if (targetBoardZoomRef.current <= 1.05) {
          handleDelta(-30, true);
          return;
        }
      }

      // Swiping left on final frame slides to board page
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

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isPaperPopupOpenRef.current) {
        setIsPaperPopupOpen(false);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-black select-none z-10 touch-none">
      {/* Synchronized Horizontal Slider Track: Canvas Stage and Board Page touching edge-to-edge */}
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

        {/* Panel 2: Board Page touching Panel 1 on the right */}
        <div
          className="relative w-screen h-full overflow-hidden bg-[#060b08] shrink-0 select-none flex items-center justify-center"
          style={{
            border: 'none',
            boxShadow: 'none',
            outline: 'none',
          }}
        >
          {/* Responsive Board Wrapper anchored with exact object-cover dimensions */}
          <div
            ref={boardWrapperRef}
            className="relative select-none will-change-transform origin-[71.2%_70.5%]"
            style={{
              position: 'absolute',
              width: `${boardLayout.width}px`,
              height: `${boardLayout.height}px`,
              left: `${boardLayout.left}px`,
              top: `${boardLayout.top}px`,
              transformOrigin: '71.2% 70.5%',
              transform: 'scale(1)',
              transition: 'none',
            }}
          >
            {/* Board Background Image */}
            <img
              src="/board.png"
              alt="Celebration Board"
              className="w-full h-full block object-cover select-none pointer-events-none"
              style={{
                border: 'none',
                boxShadow: 'none',
                outline: 'none',
              }}
            />

            {/* RSVP Button: Fixed in the blank arch space under the text, zooms in place */}
            <div
              className="absolute flex flex-col items-center select-none"
              style={{
                left: '71.2%',
                top: '70.5%',
                transform: 'translate(-50%, -50%)',
                width: '13.5%',
                maxWidth: '80px',
                zIndex: 20,
              }}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPaperPopupOpen(true);
                }}
                className="w-full group focus:outline-none cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95 flex flex-col items-center"
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                  boxShadow: 'none',
                  outline: 'none',
                }}
                aria-label="RSVP - Mark your presence"
              >
                <img
                  src="/rsvp button.png"
                  alt="RSVP Button"
                  className="w-full h-auto object-contain select-none pointer-events-none transition-transform duration-200"
                  style={{
                    filter: 'none',
                    boxShadow: 'none',
                  }}
                />

                {/* Small 'Click here' text and static up arrow at bottom of the button in same font */}
                <div className="mt-0.5 flex flex-col items-center select-none group-hover:opacity-100 transition-opacity">
                  <span
                    className="font-script text-xs sm:text-sm md:text-base font-normal text-[#3d2514] group-hover:text-[#6b3f1f] tracking-wide whitespace-nowrap leading-none transition-colors"
                    style={{
                      textShadow: '0 1px 2px rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    Click here
                  </span>
                  <div className="mt-0.5 flex flex-col items-center">
                    <svg
                      className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#3d2514] group-hover:text-[#6b3f1f] transition-colors"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Paper Image Popup Modal */}
      {isPaperPopupOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 select-none bg-black/25 backdrop-blur-[3px] transition-all duration-300"
          onClick={() => setIsPaperPopupOpen(false)}
        >
          <div
            className="relative max-w-[85vw] max-h-[82vh] sm:max-w-[420px] md:max-w-[460px] animate-popup-3d flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsPaperPopupOpen(false)}
              className="absolute -top-3 -right-3 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1c1815]/90 text-[#f0b256] border border-[#f0b256]/60 flex items-center justify-center shadow-2xl hover:bg-[#2a241f] hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
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

            {/* Paper Image: Medium size, leaving ~25% of background visible around it */}
            <img
              src="/paper.png"
              alt="Wedding Invitation Paper"
              className="w-full h-auto max-h-[82vh] object-contain rounded-lg drop-shadow-[0_20px_45px_rgba(0,0,0,0.75)] select-none pointer-events-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
