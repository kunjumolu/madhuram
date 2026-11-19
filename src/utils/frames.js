export const TOTAL_FRAMES = 240;

/**
 * Returns the URL for a specific frame number (1-based index: 1 to 240)
 * Pattern:
 * 1..9   => /madhurem/frame_01.jpg .. /madhurem/frame_09.jpg
 * 10..99 => /madhurem/frame_10.jpg .. /madhurem/frame_99.jpg
 * 100..240 => /madhurem/frame_100.jpg .. /madhurem/frame_240.jpg
 */
export function getFrameUrl(index) {
  const clamped = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(index)));
  const padded = clamped < 10 ? `0${clamped}` : `${clamped}`;
  return `/madhurem/frame_${padded}.jpg`;
}

/**
 * Preload frames 1 through 168 into memory with concurrency control
 * and live progress feedback.
 * 
 * @param {Function} onProgress ({ loaded, total, percent }) => void
 * @returns {Promise<HTMLImageElement[]>}
 */
export function preloadAllFrames(onProgress) {
  return new Promise((resolve) => {
    const images = new Array(TOTAL_FRAMES);
    let loadedCount = 0;
    const concurrency = 12; // 12 parallel image downloads for fast localhost/network throughput
    let nextIndex = 1;

    // Report initial frame 1 progress
    if (onProgress) {
      onProgress({ loaded: 0, total: TOTAL_FRAMES, percent: 0 });
    }

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

    // Launch worker pool
    const initialWorkers = Math.min(concurrency, TOTAL_FRAMES);
    for (let i = 0; i < initialWorkers; i++) {
      loadNext();
    }
  });
}
