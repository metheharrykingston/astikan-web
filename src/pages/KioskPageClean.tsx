import React, { useLayoutEffect, useRef } from 'react';
import KioskPage from './KioskPage';

function replaceVideoWithStill(video, timestamp) {
  const originalClassName = video.className;

  const drawStill = () => {
    if (!video.videoWidth || !video.videoHeight) return;

    const canvas = document.createElement('canvas');
    const cropHeight = Math.floor(video.videoHeight * 0.9028);

    canvas.width = video.videoWidth;
    canvas.height = cropHeight;
    canvas.className = originalClassName;
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', 'Astikan Health Kiosk product image');

    const context = canvas.getContext('2d');
    if (!context) return;

    context.drawImage(
      video,
      0,
      0,
      video.videoWidth,
      cropHeight,
      0,
      0,
      canvas.width,
      canvas.height,
    );

    video.replaceWith(canvas);
  };

  const seekToFrame = () => {
    video.pause();
    video.currentTime = Math.min(timestamp, Math.max(0, video.duration - 0.25));
  };

  video.classList.add('invisible');
  video.removeAttribute('autoplay');
  video.loop = false;
  video.pause();
  video.addEventListener('seeked', drawStill, { once: true });

  if (video.readyState >= 1) seekToFrame();
  else video.addEventListener('loadedmetadata', seekToFrame, { once: true });
}

export default function KioskPageClean() {
  const pageRef = useRef(null);

  useLayoutEffect(() => {
    const videos = [...(pageRef.current?.querySelectorAll('main video') ?? [])];

    // The first banner video is approved and remains animated.
    videos.slice(1).forEach((video, index) => {
      replaceVideoWithStill(video, index === 0 ? 8.5 : 24.5);
    });
  }, []);

  return (
    <div ref={pageRef}>
      <KioskPage />
    </div>
  );
}
