import type { Song } from '$lib/types';

interface SongMatch {
  score: number;
  song: Song;
}

async function checkImage(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch (error) {
    return false;
  }
}

export async function getCoverArt(releaseId: string) {
  const url = `https://coverartarchive.org/release/${releaseId}/front-250`;
  const isValid = await checkImage(url);
  if (isValid) {
    return url;
  };
}

async function fetchSearchResults(url: string): Promise<SongMatch[]> {
  try {
    const res = await fetch(url);
    const data = await res.json();
    let searchResults: SongMatch[] = data.recordings?.map((rec: any) => ({
      score: rec.score,
      song: {
        title: rec.title,
        artist: {
          title: rec['artist-credit']?.[0]?.name,
          mbid: rec['artist-credit']?.[0]?.artist.id
        },
        mbid: rec.id,
        release: {
          date: rec['releases']?.[0]?.date,
          mbid: rec['releases']?.[0]?.id,
          title: rec['releases']?.[0]?.title
        },
        length: rec.length
      }
    })) || [];

    return searchResults;
  } catch (error) {
    console.error('Error fetching songs:', error);
    return [];
  }
}

function isQueryAdvanced(query: string): boolean {
  return query.includes('artist:') || query.includes('release:');
}

export async function queryMB(query: string): Promise<Song[]> {
  const n = 25;

  let url;
  if (isQueryAdvanced(query)) {
    url = `https://musicbrainz.org/ws/2/recording?query=${encodeURIComponent(query)}&fmt=json&limit=${n}`;
  } else {
    url = `https://musicbrainz.org/ws/2/recording?query=${encodeURIComponent(query)}&fmt=json&limit=${n}&dismax=true`;
  }

  const matches = await fetchSearchResults(url);
  return matches.map(m => m.song);
}
