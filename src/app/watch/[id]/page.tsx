'use client';

import { Suspense, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import VideoPlayer from '@/components/VideoPlayer';
import { AnimeDetail, Episode, EpisodeStreamData } from '@/lib/types';
import { ArrowLeft, BookOpen, Layers, ListFilter, PlayCircle } from 'lucide-react';
import Link from 'next/link';

function WatchContent() {
  const params = useParams();
  const animeId = (params?.id as string) || '';

  const [anime, setAnime] = useState<AnimeDetail | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [streamData, setStreamData] = useState<EpisodeStreamData | null>(null);
  const [loadingAnime, setLoadingAnime] = useState(true);
  const [loadingStream, setLoadingStream] = useState(false);

  useEffect(() => {
    async function fetchInfo() {
      try {
        const res = await fetch(`/api/anime?action=info&id=${encodeURIComponent(animeId)}`);
        if (res.ok) {
          const data: AnimeDetail = await res.json();
          setAnime(data);
          if (data.episodes && data.episodes.length > 0) {
            setSelectedEpisode(data.episodes[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load anime info:', err);
      } finally {
        setLoadingAnime(false);
      }
    }

    fetchInfo();
  }, [animeId]);

  useEffect(() => {
    if (!selectedEpisode?.id) return;

    const epId = selectedEpisode.id;
    async function fetchStream() {
      setLoadingStream(true);
      try {
        const res = await fetch(
          `/api/anime?action=watch&episodeId=${encodeURIComponent(epId)}`
        );
        if (res.ok) {
          setStreamData(await res.json());
        }
      } catch (err) {
        console.error('Failed to load stream:', err);
      } finally {
        setLoadingStream(false);
      }
    }

    fetchStream();
  }, [selectedEpisode]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-purple-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Browse</span>
        </Link>

        {loadingAnime ? (
          <div className="py-20 flex justify-center">
            <div className="w-10 h-10 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !anime ? (
          <div className="p-8 text-center bg-neutral-900 rounded-xl">
            Anime information could not be loaded.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Player and Information section */}
            <div className="lg:col-span-2 space-y-5">
              <VideoPlayer
                streamData={streamData}
                loading={loadingStream}
                episodeTitle={selectedEpisode?.title}
                animeId={anime.id}
                episodeNumber={selectedEpisode?.number}
              />

              <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h1 className="text-2xl font-bold text-white">{anime.title}</h1>
                  {selectedEpisode && (
                    <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full text-xs font-bold">
                      Now Playing: Episode {selectedEpisode.number}
                    </span>
                  )}
                </div>

                {anime.genres && (
                  <div className="flex flex-wrap gap-1.5">
                    {anime.genres.map((g) => (
                      <span
                        key={g}
                        className="px-2.5 py-0.5 rounded-md bg-neutral-800 text-xs font-medium text-neutral-300"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                )}

                {anime.description && (
                  <p className="text-sm text-neutral-400 leading-relaxed pt-2">
                    {anime.description}
                  </p>
                )}
              </div>
            </div>

            {/* Episode List Sidebar */}
            <div className="space-y-3">
              <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <h2 className="text-base font-bold flex items-center gap-2 text-white">
                    <ListFilter className="w-4 h-4 text-purple-400" />
                    Episodes ({anime.episodes?.length || 0})
                  </h2>
                </div>

                <div className="max-h-[600px] overflow-y-auto pr-1 space-y-2 custom-scrollbar">
                  {anime.episodes && anime.episodes.length > 0 ? (
                    anime.episodes.map((ep) => {
                      const isActive = selectedEpisode?.id === ep.id;
                      return (
                        <button
                          key={ep.id}
                          onClick={() => setSelectedEpisode(ep)}
                          className={`w-full text-left p-3 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                            isActive
                              ? 'bg-purple-600 text-white font-semibold shadow-md shadow-purple-600/30'
                              : 'bg-neutral-950/70 hover:bg-neutral-800 text-neutral-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <PlayCircle className={`w-4 h-4 ${isActive ? 'text-white' : 'text-purple-400'}`} />
                            <span className="text-xs truncate max-w-[190px]">
                              {ep.title || `Episode ${ep.number}`}
                            </span>
                          </div>
                          <span className={`text-[11px] px-1.5 py-0.5 rounded ${isActive ? 'bg-purple-700' : 'bg-neutral-800 text-neutral-400'}`}>
                            #{ep.number}
                          </span>
                        </button>
                      );
                    })
                  ) : (
                    <p className="text-xs text-neutral-500 text-center py-4">
                      No episodes found.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function WatchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
          <div className="w-10 h-10 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <WatchContent />
    </Suspense>
  );
}
