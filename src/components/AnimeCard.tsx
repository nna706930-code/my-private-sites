import Link from 'next/link';
import { Play } from 'lucide-react';
import { AnimeItem } from '@/lib/types';

export default function AnimeCard({ anime }: { anime: AnimeItem }) {
  return (
    <Link
      href={`/watch/${anime.id}`}
      className="group relative flex flex-col rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800/80 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-950">
        <img
          src={anime.image}
          alt={anime.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Hover overlay with play button */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/40 transform scale-75 group-hover:scale-100 transition-transform">
            <Play className="w-6 h-6 text-white fill-white ml-0.5" />
          </div>
        </div>

        {/* Episode badge */}
        {anime.latestEpisode && (
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-neutral-950/80 backdrop-blur-md text-[11px] font-semibold text-purple-300 border border-purple-500/20">
            {typeof anime.latestEpisode === 'number' ? `Ep ${anime.latestEpisode}` : anime.latestEpisode}
          </div>
        )}

        {/* Sub/Dub tag */}
        {anime.subOrDub && (
          <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-neutral-900/90 backdrop-blur-sm text-[10px] uppercase font-bold text-neutral-300 border border-neutral-700">
            {anime.subOrDub}
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1 justify-between">
        <h3 className="text-sm font-semibold text-neutral-100 line-clamp-2 group-hover:text-purple-400 transition-colors">
          {anime.title}
        </h3>
        {anime.releaseDate && (
          <span className="text-xs text-neutral-500 mt-1">{anime.releaseDate}</span>
        )}
      </div>
    </Link>
  );
}
