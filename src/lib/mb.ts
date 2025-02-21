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
    console.error('Error fetching songs:', error);
    return [];
  }
}

// Get Spotify ID using listenbrainz's experimental API
export async function getSpotifyId(song: Song): Promise<string | null> {
  // TODO: Use MBID resolver after the entry to lists is made better
  const url = `https://labs.api.listenbrainz.org/spotify-id-from-metadata/json?artist_name=${encodeURIComponent(song.artist.title)}&release_name=&track_name=${encodeURIComponent(song.title)}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data[0].spotify_track_ids.length > 0) {
      return data[0].spotify_track_ids[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching Spotify ID:', error);
    return null;
  }
}
