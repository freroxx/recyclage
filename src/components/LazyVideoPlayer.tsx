// @/components/LazyVideoPlayer.tsx
import { memo, useState, useEffect, useRef, useCallback } from 'react';
import styles from './LazyVideoPlayer.module.css';
import { AlertCircle, RefreshCw } from 'lucide-react';

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
  onError?: (error?: string) => void;
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
  const [errorMessage, setErrorMessage] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Aspect ratio class mapping
  const aspectRatioClasses = {
    '16:9': styles.aspectVideo,
    '4:3': styles.aspect4x3,
    '1:1': styles.aspectSquare,
    '9:16': styles.aspect9x16,
  };

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
      rootMargin: '100px',
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
    setErrorMessage('');
    onLoad?.();
  }, [onLoad]);

  // Handle iframe error
  const handleError = useCallback(() => {
    const error = `Failed to load YouTube video: ${youtubeId}`;
    setHasError(true);
    setErrorMessage(error);
    onError?.(error);
  }, [youtubeId, onError]);

  // Handle retry
  const handleRetry = useCallback(() => {
    setHasError(false);
    setErrorMessage('');
    setIsLoaded(false);
    
    if (iframeRef.current) {
      iframeRef.current.src = buildYouTubeUrl();
    }
  }, [buildYouTubeUrl]);

  // Post message to YouTube iframe for better control
  useEffect(() => {
    if (!iframeRef.current || !isLoaded) return;

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

  // Preload thumbnail for better UX
  const thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  const fallbackThumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;

  return (
    <div 
      ref={containerRef}
      className={`${styles.container} ${aspectRatioClasses[aspectRatio]} ${className}`}
      aria-label={`YouTube video player for ${title}`}
    >
      {/* Preload thumbnail */}
      <link rel="preload" href={thumbnailUrl} as="image" />
      
      {/* Background thumbnail for loading state */}
      {!isLoaded && (
        <>
          <img
            src={thumbnailUrl}
            alt={title}
            className={styles.thumbnail}
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = fallbackThumbnailUrl;
              target.className = styles.thumbnailFallback;
            }}
          />
          <img
            src={fallbackThumbnailUrl}
            alt=""
            className={styles.thumbnailFallback}
            style={{ display: 'none' }}
            loading="lazy"
          />
        </>
      )}

      {/* Loading state */}
      {!isLoaded && isVisible && !hasError && (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner} aria-hidden="true" />
          <div className={styles.srOnly} role="status">
            Loading video...
          </div>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className={styles.errorContainer} role="alert">
          <div className={styles.errorIcon}>
            <AlertCircle aria-hidden="true" />
          </div>
          <h3 className={styles.errorTitle}>
            Unable to load video
          </h3>
          <p className={styles.errorMessage}>
            {errorMessage || 'Please check your connection or try again later'}
          </p>
          <button
            onClick={handleRetry}
            className={styles.retryButton}
            aria-label="Retry loading video"
          >
            <RefreshCw size={16} aria-hidden="true" />
            Retry
          </button>
        </div>
      )}

      {/* YouTube iframe - only render when visible */}
      {isVisible && !hasError && (
        <iframe
          ref={iframeRef}
          width="100%"
          height="100%"
          src={buildYouTubeUrl()}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className={`${styles.iframe} ${isLoaded ? styles.iframeLoaded : ''}`}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={handleLoad}
          onError={handleError}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
          aria-label={`YouTube video: ${title}`}
        />
      )}

      {/* Fallback for browsers without JavaScript */}
      <noscript>
        <div className={styles.noscriptFallback}>
          <a
            href={`https://www.youtube.com/watch?v=${youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.noscriptLink}
          >
            Watch on YouTube
          </a>
        </div>
      </noscript>

      {/* Accessibility announcements */}
      <div className={styles.srOnly} aria-live="polite" aria-atomic="true">
        {isLoaded ? 'Video player ready. Use space bar to play or pause.' : 'Loading video player...'}
      </div>
    </div>
  );
});

// Add display name for better debugging
LazyVideoPlayer.displayName = 'LazyVideoPlayer';

export default LazyVideoPlayer;
