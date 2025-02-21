import type { Song } from '$lib/types';

async function checkImage(url: string): boolean {
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

export async function queryMB(query: string): Promise<Song[]> {
  const url = `https://musicbrainz.org/ws/2/recording?query=${encodeURIComponent(query)}&fmt=json`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    let searchResults: Song[] = data.recordings?.map(rec => ({
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
      }
    })) || [];

    return searchResults;
  } catch (error) {
    console.error("Error fetching songs:", error);
    return [];
  }
}
