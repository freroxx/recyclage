// src/components/LazyVideoPlayer.tsx
import { memo } from 'react';

interface LazyVideoPlayerProps {
  youtubeId: string;
  title: string;
  autoplay?: boolean;
}

const LazyVideoPlayer = memo(function LazyVideoPlayer({ 
  youtubeId, 
  title, 
  autoplay = false 
}: LazyVideoPlayerProps) {
  return (
    <iframe
      width="100%"
      height="100%"
      src={`https://www.youtube.com/embed/${youtubeId}?autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1&playsinline=1`}
      title={title}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      className="w-full h-full"
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
    />
  );
});

export default LazyVideoPlayer;
