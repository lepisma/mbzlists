// Basic content resolution utilities

import yts from 'yt-search';
import pMemoize from 'p-memoize';
import type { Song } from '$lib/types';

async function ytFirstVideoIdInt(title: string, artist: string): Promise<string | null> {
  let r = await yts(title + ' ' + artist);
  return r.videos ? r.videos[0].videoId : null;
}

async function spotifyTrackIdInt(title: string, artist: string): Promise<string | null> {
  // TODO: Use MBID resolver after the entry to lists is made better
  const url = `https://labs.api.listenbrainz.org/spotify-id-from-metadata/json?artist_name=${encodeURIComponent(artist)}&release_name=&track_name=${encodeURIComponent(title)}`;
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

export const ytFirstVideoId = pMemoize(ytFirstVideoIdInt);
export const spotifyTrackId = pMemoize(spotifyTrackIdInt);
