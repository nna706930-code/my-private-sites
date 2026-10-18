'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import AnimeCard from '@/components/AnimeCard';
import { AnimeItem } from '@/lib/types';
import { Flame, Sparkles, TrendingUp, Tv } from 'lucide-react';

export default function HomePage() {
  const [topAiring, setTopAiring] = useState<AnimeItem[]>([]);
  const [recent, setRecent] = useState<AnimeItem[]>([]);
  const [searchResults, setSearchResults] = useState<AnimeItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [airingRes, recentRes] = await Promise.all([
          fetch('/api/anime?action=top-airing'),
          fetch('/api/anime?action=recent'),
        ]);

        if (airingRes.ok) setTopAiring(await airingRes.json());
        if (recentRes.ok) setRecent(await recentRes.json());
      } catch (err) {
        console.error('Failed to load anime feed:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    setSearchLoading(true);
    try {
      const res = await fetch(`/api/anime?action=search&q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      <Navbar onSearch={handleSearch} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Hero banner for private anime hub */}
        <div className="relative rounded-2xl overflow-hidden p-8 sm:p-12 border border-purple-900/40 bg-gradient-to-r from-purple-950/60 via-neutral-900 to-indigo-950/60 shadow-2xl">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Aniwave & Re Anime High-Speed Stream Mirror</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Unlimited Anime Streaming. <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                Private & Free Forever.
              </span>
            </h1>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
              Protected private hub with zero ads, high-speed multi-source embeds, and continuous sync with Aniwave and Re Anime providers.
            </p>
          </div>
        </div>

        {/* Search Results Display */}
        {searchResults !== null && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Search Results
              </h2>
              <button
                onClick={() => setSearchResults(null)}
                className="text-xs text-purple-400 hover:underline cursor-pointer"
              >
                Clear Search
              </button>
            </div>

            {searchLoading ? (
              <div className="py-12 flex justify-center">
                <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : searchResults.length === 0 ? (
              <div className="p-8 text-center text-neutral-400 bg-neutral-900/50 rounded-xl border border-neutral-800">
                No matching anime found. Try different keywords!
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {searchResults.map((anime) => (
                  <AnimeCard key={anime.id} anime={anime} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Top Airing Section */}
        {searchResults === null && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                <Flame className="w-5 h-5 text-orange-400" />
                Top Airing
              </h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-neutral-900 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {topAiring.map((anime) => (
                  <AnimeCard key={anime.id} anime={anime} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Recent Releases Section */}
        {searchResults === null && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
                Latest Episodes
              </h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-neutral-900 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {recent.map((anime) => (
                  <AnimeCard key={anime.id} anime={anime} />
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="mt-auto border-t border-neutral-800 bg-neutral-950 py-6 text-center text-xs text-neutral-500">
        <p>Private Anime Streamer Vault &copy; 2026. Free & Private Forever.</p>
      </footer>
    </div>
  );
}
