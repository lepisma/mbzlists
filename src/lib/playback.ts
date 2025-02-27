import type { Song, List } from '$lib/types';
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

export async function playListOnYt(list: List) {
  // This uses the comma hack to create a temporary playlist. A problem with
  // this approach is that the URL length is going to set an upper bound on the
  // length of the playlist.

  const urls = await Promise.all(list.items.map(resolveYt));
  const ids = urls.filter(url => url != null).map(url => url.split('v=', 2)[1]);

  window.open(`https://www.youtube.com/watch_videos?video_ids=${ids.join(',')}`, '_blank');
}
