'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { ExternalLink, RefreshCw, Server, Shield } from 'lucide-react';
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
  const [selectedServer, setSelectedServer] = useState<'videasy' | 'vidsu' | 'vidpm' | 'vidsrc' | 'direct'>('videasy');

  // Slug sanitizer: turns "jujutsu-kaisen-tv" into "jujutsu-kaisen"
  const cleanAnimeSlug = (animeId || 'jujutsu-kaisen')
    .replace(/-tv$/i, '')
    .replace(/-season-\d+$/i, '');

  const ep = episodeNumber || 1;

  // Active, live multi-stream embed providers (Videasy and Vidsrc.su first)
  const embedUrls: Record<'videasy' | 'vidsu' | 'vidpm' | 'vidsrc', string> = {
    videasy: `https://player.videasy.to/anime/${cleanAnimeSlug}/${ep}`,
    vidsu: `https://vidsrc.su/embed/anime/${cleanAnimeSlug}/${ep}`,
    vidpm: `https://vidsrc.pm/embed/anime/${cleanAnimeSlug}/${ep}`,
    vidsrc: `https://vidsrc.sh/embed/anime/${cleanAnimeSlug}/${ep}`,
  };

  const directM3U8 = streamData?.sources?.find((s) => s.isM3U8)?.url || streamData?.sources?.[0]?.url;

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
            key={`${selectedServer}-${cleanAnimeSlug}-${ep}`}
            src={selectedServer !== 'direct' ? embedUrls[selectedServer] : ''}
            className="w-full h-full border-0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
              onClick={() => setSelectedServer('videasy')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                selectedServer === 'videasy'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              Server 1 (Videasy Fast)
            </button>
            <button
              onClick={() => setSelectedServer('vidsu')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                selectedServer === 'vidsu'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              Server 2 (VidSU Mirror)
            </button>
            <button
              onClick={() => setSelectedServer('vidpm')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                selectedServer === 'vidpm'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              Server 3 (VIP Stream)
            </button>
            <button
              onClick={() => setSelectedServer('vidsrc')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                selectedServer === 'vidsrc'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              Server 4 (Backup)
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

        <div className="flex items-center gap-2 text-neutral-500">
          <Shield className="w-3.5 h-3.5 text-green-400" />
          <span>High Definition Player</span>
        </div>
      </div>
    </div>
  );
}
