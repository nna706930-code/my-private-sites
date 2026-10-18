import axios from 'axios';
import { AnimeItem, AnimeDetail, EpisodeStreamData } from './types';

// Multiple public fallback proxies and providers (Consumet, Gogo, Zoro/Aniwave mirror providers)
const CONSUMET_INSTANCES = [
  'https://api.consumet.org',
  'https://consumet-api-production.up.railway.app',
  'https://c.delusionz.xyz'
];

async function fetchWithFallback<T>(path: string): Promise<T | null> {
  for (const base of CONSUMET_INSTANCES) {
    try {
      const res = await axios.get(`${base}${path}`, {
        timeout: 7000,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      if (res.data) return res.data as T;
    } catch (err) {
      // try next provider fallback
    }
  }
  return null;
}

// Built-in curated popular anime list fallback in case external scraper is warming up
const FEATURED_ANIMES: AnimeItem[] = [
  {
    id: 'solo-leveling-season-2',
    title: 'Solo Leveling: Arise from the Shadow',
    image: 'https://cdn.myanimelist.net/images/anime/1149/141706.jpg',
    releaseDate: '2025',
    subOrDub: 'sub',
    latestEpisode: 12,
    description: 'Jinwoo Sung journeys deeper into mysteries as the strongest hunter.'
  },
  {
    id: 'jujutsu-kaisen-tv',
    title: 'Jujutsu Kaisen',
    image: 'https://cdn.myanimelist.net/images/anime/1171/109222.jpg',
    releaseDate: '2020',
    subOrDub: 'both',
    latestEpisode: 24,
    description: 'A boy swallows a cursed talisman and becomes cursed himself.'
  },
  {
    id: 'demon-slayer-kimetsu-no-yaiba-hashira-training-arc',
    title: 'Demon Slayer: Hashira Training Arc',
    image: 'https://cdn.myanimelist.net/images/anime/1898/138005.jpg',
    releaseDate: '2024',
    subOrDub: 'both',
    latestEpisode: 8,
    description: 'Tanjiro undergoes rigorous training with the Stone Hashira, Himejima.'
  },
  {
    id: 'attack-on-titan',
    title: 'Attack on Titan',
    image: 'https://cdn.myanimelist.net/images/anime/10/47347.jpg',
    releaseDate: '2013',
    subOrDub: 'both',
    latestEpisode: 25,
    description: 'Humans fight giant Titans behind immense walls.'
  },
  {
    id: 'one-piece',
    title: 'One Piece',
    image: 'https://cdn.myanimelist.net/images/anime/6/73245.jpg',
    releaseDate: '1999',
    subOrDub: 'both',
    latestEpisode: 1120,
    description: 'Monkey D. Luffy embarks on an adventure across the Grand Line to find the One Piece.'
  },
  {
    id: 'chainsaw-man',
    title: 'Chainsaw Man',
    image: 'https://cdn.myanimelist.net/images/anime/1806/126216.jpg',
    releaseDate: '2022',
    subOrDub: 'both',
    latestEpisode: 12,
    description: 'Denji lives as a Devil Hunter with Pochita, the Chainsaw Devil.'
  }
];

export async function getTopAiring(): Promise<AnimeItem[]> {
  const data = await fetchWithFallback<{ results: any[] }>('/anime/gogoanime/top-airing');
  if (data && data.results && data.results.length > 0) {
    return data.results.map((item) => ({
      id: item.id,
      title: item.title,
      image: item.image,
      url: item.url,
      latestEpisode: item.latestEpisode || 'New',
    }));
  }
  return FEATURED_ANIMES;
}

export async function getRecentEpisodes(): Promise<AnimeItem[]> {
  const data = await fetchWithFallback<{ results: any[] }>('/anime/gogoanime/recent-episodes');
  if (data && data.results && data.results.length > 0) {
    return data.results.map((item) => ({
      id: item.id,
      title: item.title,
      image: item.image,
      latestEpisode: item.episodeNumber || 'Episode ' + (item.episodeId?.split('-episode-')[1] || ''),
    }));
  }
  return FEATURED_ANIMES;
}

export async function searchAnime(query: string): Promise<AnimeItem[]> {
  if (!query) return [];
  const data = await fetchWithFallback<{ results: any[] }>(`/anime/gogoanime/${encodeURIComponent(query)}`);
  if (data && data.results && data.results.length > 0) {
    return data.results.map((item) => ({
      id: item.id,
      title: item.title,
      image: item.image,
      releaseDate: item.releaseDate,
      subOrDub: item.subOrDub,
    }));
  }
  // Local filter fallback
  return FEATURED_ANIMES.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase())
  );
}

export async function getAnimeDetails(animeId: string): Promise<AnimeDetail> {
  const data = await fetchWithFallback<any>(`/anime/gogoanime/info/${animeId}`);
  if (data && data.id) {
    return {
      id: data.id,
      title: data.title,
      image: data.image,
      description: data.description,
      status: data.status,
      totalEpisodes: data.totalEpisodes,
      genres: data.genres,
      otherNames: data.otherNames,
      episodes: (data.episodes || []).map((ep: any) => ({
        id: ep.id,
        number: ep.number,
        title: ep.title || `Episode ${ep.number}`,
        url: ep.url
      }))
    };
  }

  // Fallback for featured items
  const found = FEATURED_ANIMES.find((a) => a.id === animeId) || FEATURED_ANIMES[0];
  const total = typeof found.latestEpisode === 'number' ? found.latestEpisode : 12;
  const mockEpisodes: any[] = [];
  for (let i = 1; i <= total; i++) {
    mockEpisodes.push({
      id: `${found.id}-episode-${i}`,
      number: i,
      title: `Episode ${i}`,
    });
  }

  return {
    ...found,
    status: 'Ongoing / Completed',
    genres: ['Action', 'Fantasy', 'Adventure'],
    episodes: mockEpisodes,
  };
}

export async function getEpisodeStreams(episodeId: string): Promise<EpisodeStreamData> {
  const data = await fetchWithFallback<any>(`/anime/gogoanime/watch/${episodeId}`);
  
  // Safe embed fallback generator for Aniwave / Re Anime / Gogo streams
  const aniwaveEmbed = `https://vidsrc.to/embed/anime/${episodeId}`;
  const fastEmbed = `https://2embed.cc/embed/anime/${episodeId}`;

  if (data && data.sources && data.sources.length > 0) {
    return {
      headers: data.headers,
      sources: data.sources.map((s: any) => ({
        url: s.url,
        isM3U8: s.isM3U8 || s.url?.includes('.m3u8'),
        quality: s.quality || 'auto'
      })),
      download: data.download,
      embedUrl: aniwaveEmbed
    };
  }

  return {
    sources: [],
    embedUrl: aniwaveEmbed,
    download: `https://anitaku.so/download?id=${episodeId}`
  };
}
