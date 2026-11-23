import React, { useEffect, useRef, useCallback, useState } from 'react';
import { MapPin } from 'lucide-react';
import { TOTAL_FRAMES, MADHUREM_FRAMES } from '../utils/frames';
import RsvpPaperModal from './RsvpPaperModal';

const FRAME_160_INDEX = 159; // 0-based index for madhurem/frame_160.jpg (start slow fade-in)
const MADHUREM_END_INDEX = MADHUREM_FRAMES - 1; // 168: 0-based index for madhurem/frame_169.jpg
const DETAILS_START_INDEX = MADHUREM_FRAMES; // 169: 0-based index for details/frame_01.jpg
const FINAL_FRAME_INDEX = TOTAL_FRAMES - 1; // 408: 0-based index for details/frame_240.jpg

// Directions button appearance window: details2 frame_90 to frame_215 with smooth fade-in/fade-out
const DIRECTIONS_BTN_IN_START = DETAILS_START_INDEX + 87;   // ~frame 88: begin fade-in
const DIRECTIONS_BTN_IN_END = DETAILS_START_INDEX + 92;     // ~frame 93: fully visible (100% opacity)
const DIRECTIONS_BTN_OUT_START = DETAILS_START_INDEX + 212; // ~frame 213: begin fade-out
const DIRECTIONS_BTN_OUT_END = DETAILS_START_INDEX + 217;   // ~frame 218: fully faded out (0% opacity)

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

// Compute exact object-cover layout rectangle for details2 frames (aspect 1080 / 1920)
function getCanvasCoverLayout(containerWidth, containerHeight, imageAspect = 1080 / 1920) {
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
    top = (containerHeight - h) * 0.45;
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
  const slideCooldownUntilRef = useRef(0);
  const touchGestureStartedOnBoardRef = useRef(false);

  // Board scroll state:
  // Fades in thankscard.png directly on scroll continuation (0.0 -> 1.0)
  const targetBoardProgressRef = useRef(0);
  const currentBoardProgressRef = useRef(0);
  const boardWrapperRef = useRef(null);
  const thanksCardRef = useRef(null);
  const rsvpButtonWrapperRef = useRef(null);

  // Responsive Board Layout Rect
  const [boardLayout, setBoardLayout] = useState(() => {
    if (typeof window !== 'undefined') {
      return getCoverLayout(window.innerWidth, window.innerHeight);
    }
    return { width: 0, height: 0, left: 0, top: 0 };
  });

  // Directions button ref and canvas cover layout
  const directionsButtonRef = useRef(null);
  const [canvasLayout, setCanvasLayout] = useState(() => {
    if (typeof window !== 'undefined') {
      return getCanvasCoverLayout(window.innerWidth, window.innerHeight);
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

  // Preload board, rsvp button, paper, and thankscard images in memory
  useEffect(() => {
    const img1 = new Image();
    img1.src = '/board.png';
    const img2 = new Image();
    img2.src = '/rsvp button.png';
    const img3 = new Image();
    img3.src = '/paper.png';
    const img4 = new Image();
    img4.src = '/thankscard.png';
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
    setCanvasLayout(getCanvasCoverLayout(width, height));

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

      // 5. Smooth thankscard fade on the board page (no zoom, board stays at scale 1)
      const now = performance.now();
      if (now < slideCooldownUntilRef.current) {
        // Enforce initial scale(1) and zero thanksCard opacity during slide cooldown
        targetBoardProgressRef.current = 0.0;
        currentBoardProgressRef.current = 0.0;
        if (boardWrapperRef.current) {
          boardWrapperRef.current.style.transform = 'scale(1)';
        }
        if (thanksCardRef.current) {
          thanksCardRef.current.style.opacity = '0';
        }
        if (rsvpButtonWrapperRef.current) {
          rsvpButtonWrapperRef.current.style.opacity = '1';
          rsvpButtonWrapperRef.current.style.pointerEvents = 'auto';
        }
      } else {
        const progressDiff = targetBoardProgressRef.current - currentBoardProgressRef.current;
        if (Math.abs(progressDiff) > 0.001) {
          currentBoardProgressRef.current += progressDiff * 0.22;
        } else if (currentBoardProgressRef.current !== targetBoardProgressRef.current) {
          currentBoardProgressRef.current = targetBoardProgressRef.current;
        }

        const thanksAlpha = Math.min(1.0, Math.max(0.0, currentBoardProgressRef.current));

        if (boardWrapperRef.current) {
          boardWrapperRef.current.style.transform = 'scale(1)';
        }
        if (thanksCardRef.current) {
          thanksCardRef.current.style.opacity = String(thanksAlpha);
        }
        if (rsvpButtonWrapperRef.current) {
          rsvpButtonWrapperRef.current.style.opacity = String(Math.max(0, 1 - thanksAlpha * 2.0));
          rsvpButtonWrapperRef.current.style.pointerEvents = thanksAlpha > 0.08 ? 'none' : 'auto';
        }
      }

      // 6. Redraw canvas only when required
      if (needsDraw) {
        drawFrame(renderedFrameRef.current, overlayAlphaRef.current, seamAlpha);
      }

      // 7. Update directions button opacity between frame_90 and frame_215 of details2
      let dirOpacity = 0;
      if (!isSecondPageVisibleRef.current) {
        if (currentScroll >= DIRECTIONS_BTN_IN_START && currentScroll <= DIRECTIONS_BTN_OUT_END) {
          if (currentScroll < DIRECTIONS_BTN_IN_END) {
            // Smooth fade-in (0.0 -> 1.0)
            dirOpacity = (currentScroll - DIRECTIONS_BTN_IN_START) / (DIRECTIONS_BTN_IN_END - DIRECTIONS_BTN_IN_START);
          } else if (currentScroll > DIRECTIONS_BTN_OUT_START) {
            // Smooth fade-out (1.0 -> 0.0)
            dirOpacity = 1 - (currentScroll - DIRECTIONS_BTN_OUT_START) / (DIRECTIONS_BTN_OUT_END - DIRECTIONS_BTN_OUT_START);
          } else {
            // Fully visible
            dirOpacity = 1.0;
          }
        }
      }
      dirOpacity = Math.min(1, Math.max(0, dirOpacity));

      if (directionsButtonRef.current) {
        directionsButtonRef.current.style.opacity = String(dirOpacity);
        directionsButtonRef.current.style.pointerEvents = dirOpacity > 0.7 ? 'auto' : 'none';
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

        // Prevent action from residual inertia or gestures right after sliding into view
        if (now < slideCooldownUntilRef.current) return;

        // For touch swipe, require that the touch gesture originated on the board page
        if (isSwipe && !touchGestureStartedOnBoardRef.current) return;

        // Scrolling down (deltaY > 0): advance progress forward towards 1.0 to fade in thankscard
        if (deltaY > 0) {
          const step = deltaY * (isSwipe ? 0.0028 : 0.0016);
          targetBoardProgressRef.current = Math.min(1.0, targetBoardProgressRef.current + step);
          return;
        }

        // Scrolling up (deltaY < 0): reverse progress backwards
        if (deltaY < 0) {
          if (targetBoardProgressRef.current > 0.02) {
            const step = Math.abs(deltaY) * (isSwipe ? 0.0028 : 0.0016);
            targetBoardProgressRef.current = Math.max(0.0, targetBoardProgressRef.current - step);
            return;
          }

          // If at minimum progress (0.0), scrolling up slides back to final canvas frame
          if (deltaY < -10 && now - lastToggleTimeRef.current > 400) {
            lastToggleTimeRef.current = now;
            slideCooldownUntilRef.current = now + 900;
            isSecondPageVisibleRef.current = false;
            setIsSecondPageVisible(false);
            targetBoardProgressRef.current = 0.0;
            currentBoardProgressRef.current = 0.0;
            if (boardWrapperRef.current) {
              boardWrapperRef.current.style.transform = 'scale(1)';
            }
            if (thanksCardRef.current) {
              thanksCardRef.current.style.opacity = '0';
            }
            if (rsvpButtonWrapperRef.current) {
              rsvpButtonWrapperRef.current.style.opacity = '1';
              rsvpButtonWrapperRef.current.style.pointerEvents = 'auto';
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
          slideCooldownUntilRef.current = now + 900; // Protection against autozoom
          isSecondPageVisibleRef.current = true;
          setIsSecondPageVisible(true);
          targetBoardProgressRef.current = 0.0;
          currentBoardProgressRef.current = 0.0;
          if (boardWrapperRef.current) {
            boardWrapperRef.current.style.transform = 'scale(1)';
          }
          if (thanksCardRef.current) {
            thanksCardRef.current.style.opacity = '0';
          }
          if (rsvpButtonWrapperRef.current) {
            rsvpButtonWrapperRef.current.style.opacity = '1';
            rsvpButtonWrapperRef.current.style.pointerEvents = 'auto';
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
      touchGestureStartedOnBoardRef.current = isSecondPageVisibleRef.current;
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

      // Swiping right on board page (if at beginning of progress) slides back to final frame
      if (
        isSecondPageVisibleRef.current &&
        !isPaperPopupOpenRef.current &&
        deltaX < -15 &&
        Math.abs(deltaX) > Math.abs(deltaY)
      ) {
        if (targetBoardProgressRef.current <= 0.05) {
          handleDelta(-30, true);
          return;
        }
      }

      // Swiping left on final frame slides to board page (with slide cooldown to prevent autozoom)
      if (
        !isSecondPageVisibleRef.current &&
        targetScrollRef.current >= FINAL_FRAME_INDEX - 0.5 &&
        deltaX > 12 &&
        Math.abs(deltaX) > Math.abs(deltaY)
      ) {
        lastToggleTimeRef.current = performance.now();
        slideCooldownUntilRef.current = performance.now() + 900;
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
            src="/madhurem/frame_01.webp"
            alt="Wedding Stage"
            className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none"
          />
          <canvas
            ref={canvasRef}
            className="relative z-10 w-full h-full object-cover select-none pointer-events-none"
          />

          {/* Invitation Details Overlay: Positioned precisely over the canvas card layout */}
          <div
            className="absolute z-20 pointer-events-none select-none"
            style={{
              position: 'absolute',
              width: `${canvasLayout.width}px`,
              height: `${canvasLayout.height}px`,
              left: `${canvasLayout.left}px`,
              top: `${canvasLayout.top}px`,
            }}
          >
            {/* Click here for directions button: positioned cleanly below venue address */}
            <div
              ref={directionsButtonRef}
              className="absolute select-none pointer-events-none transition-transform duration-200"
              style={{
                left: '50%',
                top: '81.5%',
                transform: 'translate(-50%, -50%)',
                opacity: 0,
                zIndex: 30,
              }}
            >
              <a
                href="https://maps.google.com/?q=St.+Mary's+Jacobite+Syrian+Church+Auditorium,+A.M+Road+Kuruppampady,+Perumbavoor"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="group relative z-10 flex items-center justify-center gap-1.5 sm:gap-2 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full border border-[#b88628] bg-gradient-to-r from-[#201208] via-[#381f10] to-[#201208] text-[#f7d794] shadow-[0_3px_12px_rgba(0,0,0,0.5),0_0_10px_rgba(212,175,55,0.3)] hover:shadow-[0_4px_16px_rgba(212,175,55,0.5)] hover:brightness-110 active:scale-95 transition-all duration-200 cursor-pointer pointer-events-auto text-center"
                aria-label="Click here for directions on Google Maps"
              >
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#f0b256] shrink-0 animate-bounce" />
                <span className="font-serif-luxury italic font-bold tracking-wide text-xs sm:text-sm text-[#faedd7] whitespace-nowrap drop-shadow-sm">
                  Click here for directions
                </span>
              </a>
            </div>
          </div>
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
          {/* Responsive Board Wrapper anchored with exact object-cover dimensions (scale 1, zero zoom) */}
          <div
            ref={boardWrapperRef}
            className="relative select-none"
            style={{
              position: 'absolute',
              width: `${boardLayout.width}px`,
              height: `${boardLayout.height}px`,
              left: `${boardLayout.left}px`,
              top: `${boardLayout.top}px`,
              transform: 'scale(1)',
              transition: 'none',
            }}
          >
            {/* Board Background Image with pristine full-fidelity rendering */}
            <img
              src="/board.png"
              alt="Celebration Board"
              decoding="sync"
              fetchpriority="high"
              className="w-full h-full block object-cover select-none pointer-events-none"
              style={{
                border: 'none',
                boxShadow: 'none',
                outline: 'none',
                imageRendering: '-webkit-optimize-contrast',
              }}
            />

            {/* Thank You Card Overlay with pristine rendering, slowly fades in and replaces board on scroll */}
            <img
              ref={thanksCardRef}
              src="/thankscard.png"
              alt="Thank You Card"
              decoding="sync"
              fetchpriority="high"
              className="absolute inset-0 w-full h-full block object-cover select-none pointer-events-none"
              style={{
                opacity: 0,
                border: 'none',
                boxShadow: 'none',
                outline: 'none',
                imageRendering: '-webkit-optimize-contrast',
                zIndex: 25,
              }}
            />

            {/* RSVP Button: Fixed in the blank arch space under the text, fades out when thankscard fades in */}
            <div
              ref={rsvpButtonWrapperRef}
              className="absolute flex flex-col items-center select-none"
              style={{
                left: '71.2%',
                top: '71.8%',
                transform: 'translate(-50%, -50%)',
                width: '15.2%',
                maxWidth: '92px',
                zIndex: 20,
              }}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPaperPopupOpen(true);
                }}
                className="w-full group focus:outline-none cursor-pointer transition-opacity duration-200 hover:opacity-90 active:opacity-75 flex flex-col items-center"
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

                {/* Small 'Click here' text at bottom of the button in same font */}
                <div className="mt-1 flex flex-col items-center select-none group-hover:opacity-100 transition-opacity">
                  <span
                    className="font-script text-sm sm:text-base md:text-lg font-normal text-[#3d2514] group-hover:text-[#6b3f1f] tracking-wide whitespace-nowrap leading-none transition-colors"
                    style={{
                      textShadow: '0 1px 2px rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    Click here
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Paper Image Popup Modal with Handwritten RSVP Form */}
      <RsvpPaperModal
        isOpen={isPaperPopupOpen}
        onClose={() => setIsPaperPopupOpen(false)}
      />
    </div>
  );
}
