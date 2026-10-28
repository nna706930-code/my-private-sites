'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { ExternalLink, RefreshCw, Server, ShieldCheck } from 'lucide-react';
import { EpisodeStreamData } from '@/lib/types';

interface PlayerProps {
  streamData: EpisodeStreamData | null;
  loading: boolean;
  episodeTitle?: string;
  animeId?: string;
  episodeNumber?: number | string;
}

export default function VideoPlayer({
  streamData,
  loading,
  episodeTitle,
  animeId,
  episodeNumber,
}: PlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [selectedServer, setSelectedServer] = useState<'videasy_slug' | 'vidsu_slug' | 'vidsu_clean' | 'vidpm_slug' | 'direct'>('videasy_slug');

  const rawSlug = animeId || 'demon-slayer-kimetsu-no-yaiba-hashira-training-arc';
  const cleanSlug = rawSlug
    .replace(/-tv$/i, '')
    .replace(/-season-\d+$/i, '')
    .replace(/-kimetsu-no-yaiba-.*$/i, ''); // e.g. "demon-slayer"

  const ep = episodeNumber || 1;

  // Multi-tier server embeds mapping exact title slugs and clean fallbacks
  const embedUrls: Record<'videasy_slug' | 'vidsu_slug' | 'vidsu_clean' | 'vidpm_slug', string> = {
    videasy_slug: `https://player.videasy.to/anime/${rawSlug}/${ep}`,
    vidsu_slug: `https://vidsrc.su/embed/anime/${rawSlug}/1/${ep}`,
    vidsu_clean: `https://vidsrc.su/embed/anime/${cleanSlug}/1/${ep}`,
    vidpm_slug: `https://vidsrc.pm/embed/anime/${rawSlug}/${ep}`,
  };

  const currentEmbedUrl = selectedServer !== 'direct' ? embedUrls[selectedServer] : '';
  const directM3U8 = streamData?.sources?.find((s) => s.isM3U8)?.url || streamData?.sources?.[0]?.url;

  // Intercept window.open popups cleanly
  useEffect(() => {
    const originalOpen = window.open;
    window.open = function (...args: any[]) {
      console.warn('[AdBlocker] Blocked popup attempt:', args[0]);
      return null;
    };

    return () => {
      window.open = originalOpen;
    };
  }, []);

  useEffect(() => {
    if (selectedServer !== 'direct' || !directM3U8 || !videoRef.current) return;

    const video = videoRef.current;
    if (Hls.isSupported()) {
      const hls = new Hls({
        xhrSetup: (xhr) => {
          if (streamData?.headers) {
            Object.entries(streamData.headers).forEach(([k, v]) => {
              xhr.setRequestHeader(k, v);
            });
          }
        },
      });

      hls.loadSource(directM3U8);
      hls.attachMedia(video);

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = directM3U8;
    }
  }, [directM3U8, selectedServer, streamData]);

  return (
    <div className="space-y-4">
      {/* Stream Player Viewport */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-neutral-400">Connecting stream feed...</p>
          </div>
        ) : selectedServer === 'direct' && directM3U8 ? (
          <video
            ref={videoRef}
            controls
            autoPlay
            className="w-full h-full object-contain bg-black"
          />
        ) : (
          <iframe
            key={`${selectedServer}-${rawSlug}-${ep}`}
            src={currentEmbedUrl}
            className="w-full h-full border-0"
            allowFullScreen
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          />
        )}
      </div>

      {/* Server & Mirror Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-neutral-900/80 border border-neutral-800 rounded-xl text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <Server className="w-4 h-4 text-purple-400" />
          <span className="font-semibold text-neutral-300">Server Selector:</span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedServer('videasy_slug')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                selectedServer === 'videasy_slug'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              Server 1 (Videasy HD)
            </button>
            <button
              onClick={() => setSelectedServer('vidsu_slug')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                selectedServer === 'vidsu_slug'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              Server 2 (VidSU Full)
            </button>
            <button
              onClick={() => setSelectedServer('vidsu_clean')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                selectedServer === 'vidsu_clean'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              Server 3 (VidSU Main)
            </button>
            <button
              onClick={() => setSelectedServer('vidpm_slug')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                selectedServer === 'vidpm_slug'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              Server 4 (VIP Backup)
            </button>
            {directM3U8 && (
              <button
                onClick={() => setSelectedServer('direct')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  selectedServer === 'direct'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                HLS Direct
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {currentEmbedUrl && (
            <a
              href={currentEmbedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 underline"
            >
              <span>Open in New Tab</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Ad Shield Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
