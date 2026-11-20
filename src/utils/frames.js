export const TOTAL_FRAMES = 169;

/**
 * Returns the URL for a specific frame number (1-based index: 1 to 169)
 * Pattern:
 * 1..9   => /madhurem/frame_01.jpg .. /madhurem/frame_09.jpg
 * 10..99 => /madhurem/frame_10.jpg .. /madhurem/frame_99.jpg
 * 100..169 => /madhurem/frame_100.jpg .. /madhurem/frame_169.jpg
 */
export function getFrameUrl(index) {
  const clamped = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(index)));
  const padded = clamped < 10 ? `0${clamped}` : `${clamped}`;
  return `/madhurem/frame_${padded}.jpg`;
}

/**
 * Preload frames into memory:
 * Loads frame_01 FIRST so it can be immediately shown and frozen on screen,
 * then preloads the remaining frames in the background.
 * 
 * @param {Function} onProgress ({ loaded, total, percent }) => void
 * @returns {Promise<HTMLImageElement[]>}
 */
export function preloadAllFrames(onProgress) {
  return new Promise((resolve) => {
    const images = new Array(TOTAL_FRAMES);
    let loadedCount = 0;
    const concurrency = 12; // 12 parallel image downloads for fast throughput

    // Report initial progress
    if (onProgress) {
      onProgress({ loaded: 0, total: TOTAL_FRAMES, percent: 0 });
    }

    // Step 1: Prioritize loading & decoding frame_01 immediately
    const firstImg = new Image();
    firstImg.src = getFrameUrl(1);

    const startRest = () => {
      images[0] = firstImg;
      loadedCount = 1;
      if (onProgress) {
        const percent = Math.min(100, Math.round((1 / TOTAL_FRAMES) * 100));
        onProgress({ loaded: 1, total: TOTAL_FRAMES, percent });
      }

      let nextIndex = 2;

      function loadNext() {
        if (nextIndex > TOTAL_FRAMES) {
          if (loadedCount >= TOTAL_FRAMES) {
            resolve(images);
          }
          return;
        }

        const currentIndex = nextIndex++;
        const img = new Image();
        img.src = getFrameUrl(currentIndex);

        const handleFinished = () => {
          images[currentIndex - 1] = img;
          loadedCount++;
          if (onProgress) {
            const percent = Math.min(100, Math.round((loadedCount / TOTAL_FRAMES) * 100));
            onProgress({ loaded: loadedCount, total: TOTAL_FRAMES, percent });
          }
          if (loadedCount >= TOTAL_FRAMES) {
            resolve(images);
          } else {
            loadNext();
          }
        };

        img.onload = () => {
          if ('decode' in img) {
            img.decode().then(handleFinished).catch(handleFinished);
          } else {
            handleFinished();
          }
        };

        img.onerror = () => {
          console.warn(`Frame ${currentIndex} failed to load, continuing...`);
          handleFinished();
        };
      }

      // Step 2: Concurrently preload frames 2 through 240
      const initialWorkers = Math.min(concurrency, TOTAL_FRAMES - 1);
      for (let i = 0; i < initialWorkers; i++) {
        loadNext();
      }
    };

    firstImg.onload = () => {
      if ('decode' in firstImg) {
        firstImg.decode().then(startRest).catch(startRest);
      } else {
        startRest();
      }
    };

    firstImg.onerror = () => {
      console.warn('Frame 1 failed to load, proceeding with remaining frames...');
      startRest();
    };
  });
}
