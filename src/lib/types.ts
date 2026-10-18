export interface AnimeItem {
  id: string;
  title: string;
  image: string;
  url?: string;
  releaseDate?: string;
  description?: string;
  genres?: string[];
  totalEpisodes?: number;
  type?: string;
  subOrDub?: 'sub' | 'dub' | 'both';
  latestEpisode?: number | string;
}

export interface Episode {
  id: string;
  number: number;
  title?: string;
  url?: string;
}

export interface AnimeDetail extends AnimeItem {
  status?: string;
  otherNames?: string;
  episodes: Episode[];
}

export interface VideoSource {
  url: string;
  isM3U8: boolean;
  quality?: string;
}

export interface EpisodeStreamData {
  headers?: Record<string, string>;
  sources: VideoSource[];
  download?: string;
  embedUrl?: string;
}
