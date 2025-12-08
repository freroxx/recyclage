// @/components/LazyVideoPlayer.tsx
import { memo, useState, useEffect, useRef, useCallback } from 'react';

interface LazyVideoPlayerProps {
  youtubeId: string;
  title: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  showControls?: boolean;
  modestBranding?: boolean;
  playsInline?: boolean;
  className?: string;
  aspectRatio?: '16:9' | '4:3' | '1:1' | '9:16';
  onLoad?: () => void;
  onError?: (error: Error) => void;
  onPlay?: () => void;
  onPause?: () => void;
}

const LazyVideoPlayer = memo(function LazyVideoPlayer({ 
  youtubeId, 
  title, 
  autoplay = false,
  loop = false,
  muted = false,
  showControls = true,
  modestBranding = true,
  playsInline = true,
  className = '',
  aspectRatio = '16:9',
  onLoad,
  onError,
  onPlay,
  onPause,
}: LazyVideoPlayerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Handle intersection observer for lazy loading
  useEffect(() => {
    if (!containerRef.current || isVisible) return;

    const handleIntersection: IntersectionObserverCallback = (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '50px',
      threshold: 0.1,
    });

    observerRef.current.observe(containerRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isVisible]);

  // Build YouTube URL with parameters
  const buildYouTubeUrl = useCallback(() => {
    const params = new URLSearchParams({
      autoplay: autoplay ? '1' : '0',
      rel: '0',
      playsinline: playsInline ? '1' : '0',
      controls: showControls ? '1' : '0',
      mute: muted ? '1' : '0',
      modestbranding: modestBranding ? '1' : '0',
      loop: loop ? '1' : '0',
      enablejsapi: '1',
      origin: typeof window !== 'undefined' ? window.location.origin : '',
    });

    // Add playlist parameter for loop functionality
    if (loop) {
      params.append('playlist', youtubeId);
    }

    return `https://www.youtube.com/embed/${youtubeId}?${params.toString()}`;
  }, [youtubeId, autoplay, playsInline, showControls, muted, modestBranding, loop]);

  // Handle iframe load
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.();
  }, [onLoad]);

  // Handle iframe error
  const handleError = useCallback(() => {
    setHasError(true);
    onError?.(new Error(`Failed to load YouTube video: ${youtubeId}`));
  }, [youtubeId, onError]);

  // Post message to YouTube iframe for better control
  useEffect(() => {
    if (!iframeRef.current || !isLoaded) return;

    const sendPostMessage = (event: string, data?: any) => {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event, data }),
        'https://www.youtube.com'
      );
    };

    // Send play/pause events if callbacks are provided
    const messageHandler = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.event === 'infoDelivery') {
          if (data.info.playerState === 1 && onPlay) {
            onPlay();
          } else if (data.info.playerState === 2 && onPause) {
            onPause();
          }
        }
      } catch (e) {
        // Ignore non-JSON messages
      }
    };

    window.addEventListener('message', messageHandler);

    return () => {
      window.removeEventListener('message', messageHandler);
    };
  }, [isLoaded, onPlay, onPause]);

  // Aspect ratio classes
  const aspectRatioClasses = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-4/3',
    '1:1': 'aspect-square',
    '9:16': 'aspect-[9/16]',
  };

  // Preload thumbnail for better UX
  const thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  const fallbackThumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden bg-black transition-all duration-300 ${aspectRatioClasses[aspectRatio]} ${className}`}
    >
      {/* Preload thumbnail */}
      <link rel="preload" href={thumbnailUrl} as="image" />
      
      {/* Loading state */}
      {!isLoaded && isVisible && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
          <div className="relative">
            {/* Loading spinner */}
            <div className="w-12 h-12 border-3 border-transparent border-t-emerald-500 rounded-full animate-spin"></div>
            {/* Background thumbnail for loading state */}
            <img
              src={thumbnailUrl}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = fallbackThumbnailUrl;
              }}
            />
          </div>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-red-900/20 to-black p-4 text-center">
          <div className="mb-4 text-red-400">
            <div className="w-16 h-16 border-2 border-red-500/50 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">!</span>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Unable to load video
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Please check your connection or try again later
          </p>
          <button
            onClick={() => {
              setHasError(false);
              setIsLoaded(false);
              if (iframeRef.current) {
                iframeRef.current.src = buildYouTubeUrl();
              }
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-300"
          >
            Retry
          </button>
        </div>
      )}

      {/* YouTube iframe - only render when visible */}
      {isVisible && (
        <iframe
          ref={iframeRef}
          width="100%"
          height="100%"
          src={buildYouTubeUrl()}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={handleLoad}
          onError={handleError}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
        />
      )}

      {/* Fallback for browsers without JavaScript */}
      <noscript>
        <div className="absolute inset-0 flex items-center justify-center">
          <a
            href={`https://www.youtube.com/watch?v=${youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Watch on YouTube
          </a>
        </div>
      </noscript>

      {/* Keyboard shortcuts hint for screen readers */}
      <div className="sr-only" aria-live="polite">
        YouTube video player loaded. Use space bar to play/pause, arrow keys to seek.
      </div>
    </div>
  );
});

// Add display name for better debugging
LazyVideoPlayer.displayName = 'LazyVideoPlayer';

export default LazyVideoPlayer;
