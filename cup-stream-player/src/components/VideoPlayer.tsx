'use client';

import { useEffect, useRef } from 'react';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';
import 'video.js/dist/video-js.css';

interface VideoPlayerProps {
  src: string;
}

export default function VideoPlayer({ src }: VideoPlayerProps) {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current && videoRef.current) {
      const videoElement = document.createElement('video-js');
      videoElement.classList.add('vjs-big-play-centered', 'vjs-theme-city');
      videoRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, {
        controls: true,
        fluid: true,
        responsive: true,
        liveui: true, // Enables special UI markers for live streams
        sources: [{ src, type: 'application/x-mpegURL' }]
      }));
    } else if (playerRef.current) {
      // If the source changes, update the player dynamically
      const player = playerRef.current;
      player.src({ src, type: 'application/x-mpegURL' });
    }
  }, [src]);

  // Dispose player on unmount
  useEffect(() => {
    const player = playerRef.current;
    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div data-vjs-player className="w-full rounded-xl overflow-hidden border border-zinc-800 bg-black shadow-2xl">
      <div ref={videoRef} />
    </div>
  );
}