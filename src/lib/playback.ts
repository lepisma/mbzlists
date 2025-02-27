import type { Song } from '$lib/types';
import { resolveYt, resolveSpotify } from '$lib/resolution';

export async function playTrackOnYt(song: Song) {
  let ytURL = await resolveYt(song);
  if (ytURL) {
    window.open(ytURL, '_blank');
  } else {
    window.alert(`Not able to find the song ${song.title} on Youtube`);
  }
}

export async function playTrackOnSpotify(song: Song) {
  let spURL = await resolveSpotify(song);
  if (spURL) {
    window.open(spURL, '_blank');
  } else {
    window.alert(`Not able to find the song ${song.title} on Spotify`);
  }
}
