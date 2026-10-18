import { NextResponse } from 'next/server';
import { getTopAiring, getRecentEpisodes, searchAnime, getAnimeDetails, getEpisodeStreams } from '@/lib/anime';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  try {
    if (action === 'top-airing') {
      const results = await getTopAiring();
      return NextResponse.json(results);
    }

    if (action === 'recent') {
      const results = await getRecentEpisodes();
      return NextResponse.json(results);
    }

    if (action === 'search') {
      const query = searchParams.get('q') || '';
      const results = await searchAnime(query);
      return NextResponse.json(results);
    }

    if (action === 'info') {
      const id = searchParams.get('id');
      if (!id) return NextResponse.json({ error: 'Missing anime id' }, { status: 400 });
      const info = await getAnimeDetails(id);
      return NextResponse.json(info);
    }

    if (action === 'watch') {
      const episodeId = searchParams.get('episodeId');
      if (!episodeId) return NextResponse.json({ error: 'Missing episodeId' }, { status: 400 });
      const stream = await getEpisodeStreams(episodeId);
      return NextResponse.json(stream);
    }

    return NextResponse.json({ error: 'Invalid action parameter' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Internal server error' }, { status: 500 });
  }
}
